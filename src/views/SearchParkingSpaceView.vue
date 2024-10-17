<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import SearchInputComponent from "@/components/SearchInputComponent.vue";
import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const API_URL = `${BASE_URL}?address=`;
const router = useRouter();
const route = useRoute();
const map = ref(null);
const markerGroup = ref(null);
const searchMarkerGroup = ref(null); // 用於搜尋標記

var locationIcon = L.icon({
  iconUrl: "Location.png",
  iconSize: [38, 35], // size of the icon
  iconAnchor: [19, 35], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -35], // point from which the popup should open relative to the iconAnchor
});

const updateUrlQuery = (newQuery) => {
  router.push({ name: "search", query: { searchQuery: newQuery } });
};

const SearchHandler = async (searchQuery) => {
  if (!map.value) {
    console.error("地圖尚未初始化");
    return;
  }
  if (searchQuery) {
    const res = await fetch(`${API_URL}${encodeURIComponent(searchQuery)}`);
    if (!res.ok) {
      throw new Error("Server無法獲取數據");
    }
    const data = await res.json();
    if (data.latitude && data.longitude) {
      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);
      // 確保 markerGroup 已初始化
      if (!searchMarkerGroup.value) {
        searchMarkerGroup.value = L.layerGroup().addTo(map.value);
      }
      // 清除之前的標記
      searchMarkerGroup.value.clearLayers();
      //增加標記
      const marker = L.marker([lat, lon], { icon: locationIcon })
        .bindPopup(`位置：${searchQuery}`)
        .openPopup();
      searchMarkerGroup.value.addLayer(marker);
      //定位
      map.value.setView([lat, lon], 15);
      updateUrlQuery(searchQuery);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "定位錯誤，請聯絡客服人員!",
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "數據異常，請聯絡客服人員!",
    });
  }
};

//載入停車場
const loadParkingLots = async () => {
  if (!map.value) {
    console.error("地圖尚未初始化");
    return;
  }
  try {
    const res = await fetch(`${BASE_URL}/GetParkingLots`);
    if (!res.ok) {
      throw new Error("Server無法獲取停車場數據");
    }
    const parkingLots = await res.json();
    // 確保 markerGroup 已初始化
    if (!markerGroup.value) {
      markerGroup.value = L.layerGroup().addTo(map.value);
    }
    // 清除之前的所有標記
    markerGroup.value.clearLayers();

    // 將每個停車場標記加入地圖
    parkingLots.forEach((lot) => {
      const marker = L.marker([lot.latitude, lot.longitude]).on("click", () => {
        // 關閉地圖上所有的 popup
        map.value.closePopup();

        // 為當前點擊的標記開啟新的 popup
        marker
          .bindPopup(
            `<b>${lot.lotName}</b><br>
            地址：${lot.location}<br>
            可用車位：${lot.validSpace} / ${lot.smallCarSpace}<br>
            平日每小時費用：${lot.weekdayRate} 元<br>
            假日每小時費用：${lot.holidayRate} 元<br>
            月租費用：${lot.monRate} 元<br>
            營業時間：${lot.opendoorTime}<br>
            電話：${lot.tel}`
          )
          .openPopup(); // 開啟新的 popup

        // 當 popup 關閉時清理狀態
        marker.on("popupclose", () => {
          marker.unbindPopup(); // 清除 popup
        });
      });

      // 縮放前關閉所有的 popup，避免錯誤
      map.value.on("zoomstart", () => {
        map.value.closePopup();
      });
      markerGroup.value.addLayer(marker);
    });
  } catch (error) {
    console.error("加載停車場數據時出現錯誤：", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "無法加載停車場數據，請稍後再試!",
    });
  }
};

// 添加 watch 監聽器
watch(
  () => route.query.searchQuery,
  (newQuery) => {
    if (newQuery && map.value) {
      SearchHandler(newQuery);
    }
  }
);

//掛載時檢查有沒有來自首頁的字串
onMounted(() => {
  if (map.value === null) {
    //初始化地圖
    map.value = L.map("map").setView([22.6273, 120.3014], 15); //高雄經緯度
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "EasyPark © OpenStreetMap",
    }).addTo(map.value);
    // 初始化 LayerGroup
    markerGroup.value = L.layerGroup().addTo(map.value); // 停車場標記
    searchMarkerGroup.value = L.layerGroup().addTo(map.value); // 搜尋標記

    loadParkingLots();

    const destinationFromHome = route.query.searchQuery;
    console.log("Received Destination:", destinationFromHome);
    if (destinationFromHome) {
      SearchHandler(destinationFromHome); //自動搜尋跟定位
    }
  }
});

onBeforeUnmount(() => {
  try {
    if (map.value) {
      map.value.remove();
      map.value = null;
    }
    if (searchMarkerGroup.value) {
      searchMarkerGroup.value.clearLayers();
      searchMarkerGroup.value = null;
    }
    if (markerGroup.value) {
      markerGroup.value.clearLayers();
      markerGroup.value = null;
    }
  } catch (error) {
    console.error("移除地圖時發生錯誤：", error);
  }
});
</script>

<template>
  <div>
    <main id="main">
      <!-- 麵包屑 -->
      <BreadcrumbsComponent>
        <template #title>
          <!-- 插入到 title 插槽 -->
          <h2>Search Parking</h2>
        </template>
        <template #page>
          <!-- 插入到 page 插槽 -->
          查找停車位
        </template>
      </BreadcrumbsComponent>

      <!-- ======= About Section ======= -->
      <section id="about" class="about">
        <div class="container" data-aos="fade-up">
          <div class="row">
            <div class="col-md-4">
              <div class="row">
                <div class="col-md-12">
                  <h3>MyGo Parking</h3>
                  <div style="width: 100%">
                    <SearchInputComponent
                      @search="SearchHandler"
                    ></SearchInputComponent>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="container">
                    <div class="row">
                      <!-- Sorting Buttons -->
                      <div class="sorting-buttons mt-3">
                        <button @click="sortByDistance" class="btn btn-primary">
                          按距離排序
                        </button>
                        <button @click="sortByCost" class="btn btn-secondary">
                          按費用排序
                        </button>
                      </div>
                      <div class="col-md-12">
                        <div class="card" style="width: 18rem">
                          <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">
                              Card subtitle
                            </h6>
                            <p class="card-text">
                              Some quick example text to build on the card title
                              and make up the bulk of the card's content.
                            </p>
                            <a href="#" class="card-link">Card link</a>
                            <a href="#" class="card-link">Another link</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-8">
              <div id="map"></div>
            </div>
          </div>
        </div>
      </section>
      <!-- End About Section -->
    </main>
  </div>
</template>

<style lang="css" scoped>
#map {
  width: 100%;
  height: 650px;
}
</style>
