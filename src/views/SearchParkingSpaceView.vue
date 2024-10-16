<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import SearchInputComponent from "@/components/SearchInputComponent.vue";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const API_URL = `${BASE_URL}/ParkingLot?address=`;
const router = useRouter();
const route = useRoute();
const map = ref(null);
const markerGroup = ref(null);

const updateUrlQuery = (newQuery) => {
  router.push({ name: "map", query: { address: newQuery } });
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
      if (!markerGroup.value) {
        markerGroup.value = L.layerGroup().addTo(map.value);
      }
      // 清除之前的標記
      markerGroup.value.clearLayers();
      //增加標記
      const marker = L.marker([lat, lon])
        .addTo(map.value)
        .bindPopup(`位置：${searchQuery}`)
        .openPopup();
      markerGroup.value.addLayer(marker);
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
    map.value = L.map("map").setView([22.6273, 120.3014], 13); //高雄經緯度
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "EasyPark © OpenStreetMap",
    }).addTo(map.value);
    // 初始化 LayerGroup
    markerGroup.value = L.layerGroup().addTo(map.value);
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
          <div class="row d-flex">
            <div class="col-md-6">
              <h2>MyGo Parking</h2>
              <div class="our-story" style="width: 100%">
                <SearchInputComponent
                  @search="SearchHandler"
                ></SearchInputComponent>
              </div>
            </div>
            <div id="map" class="col-md-8"></div>
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
  height: 600px;
}
</style>
