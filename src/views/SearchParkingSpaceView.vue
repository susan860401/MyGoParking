<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import SearchInputComponent from "@/components/SearchInputComponent.vue";
import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { locatePlace } from "@/js/mapFunction";

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const API_URL = `${BASE_URL}/ParkingLot?address=`;
const router = useRouter();
const route = useRoute();
const map = ref(null);
const markerGroup = ref(null);
const markerClusterGroup = ref(null);
const searchMarkerGroup = ref(null); // 用於搜尋標記
const userLocationMarker = ref(null); // 用來存放用戶定位的標記
const parkingLots = ref([]); // 儲存所有停車場資訊
const displayedParkingLots = ref([]); // 儲存顯示的10個停車場
const isLoading = ref(false);
const markerMap = ref(new Map()); // 用於存儲每個停車場的標記

// 使用的定位圖標
var locationIcon = L.icon({
  iconUrl: "/location.gif",
  iconSize: [50, 65],
  iconAnchor: [19, 35],
  popupAnchor: [0, -35],
});

const updateUrlQuery = (newQuery) => {
  router.push({ name: "search", query: { searchQuery: newQuery } });
};

// ResMon 方法裡加上導航邏輯
const ResMon = (lot) => {
  console.log("lot:", lot);
  router.push({
    name: "resmon", // 目標路由的名稱
    query: {
      lotId: lot.lotId, // 傳遞選中的停車場 ID
      lotName: lot.lotName, // 傳遞選中的停車場名稱
    },
  });
};

const SearchHandler = async (searchQuery) => {
  if (!map.value) {
    console.error("地圖尚未初始化");
    return;
  }
  if (searchQuery) {
    sessionStorage.setItem("searchQuery", searchQuery);
    const res = await fetch(`${API_URL}${encodeURIComponent(searchQuery)}`);
    if (!res.ok) {
      throw new Error("Server無法獲取數據");
    }
    const data = await res.json();
    if (data.latitude && data.longitude) {
      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);

      if (!searchMarkerGroup.value) {
        searchMarkerGroup.value = L.layerGroup().addTo(map.value);
      }
      searchMarkerGroup.value.clearLayers();
      if (userLocationMarker.value) {
        map.value.removeLayer(userLocationMarker.value);
        userLocationMarker.value = null;
      }
      const marker = L.marker([lat, lon], { icon: locationIcon }).bindPopup(
        `位置：${searchQuery}`
      );
      searchMarkerGroup.value.addLayer(marker);
      map.value.setView([lat, lon], 15);
      updateUrlQuery(searchQuery);
      // 更新顯示的停車場
      updateDisplayLots(lat, lon);
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

// 載入停車場
const loadParkingLots = async () => {
  try {
    const res = await fetch(`${BASE_URL}/ParkingLot/GetParkingLots`);
    if (!res.ok) {
      throw new Error("Server無法獲取停車場數據");
    }
    const data = await res.json();
    //console.log(data);
    data.forEach((lot) => {
      //console.log("monRate:", lot.MonRate);
      lot.isETC = lot.etcSpace > 0;
      lot.monRentalRate = lot.monRate > 0;
      lot.deposit = lot.resDeposit > 0;
    });
    parkingLots.value = data;
    updateDisplayLots(22.6273, 120.3014); // 高雄的經緯度
    //AddMarkerToMap();
  } catch (error) {
    console.error("加載停車場數據時出現錯誤：", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "無法加載停車場數據，請稍後再試!",
    });
  }
};

//show 10 lots data
const updateDisplayLots = (lat, lon) => {
  displayedParkingLots.value = parkingLots.value
    .map((lot) => {
      const distance = calculateDistance(lat, lon, lot.latitude, lot.longitude);
      return { ...lot, distance };
    })
    .sort((a, b) => a.distance - b.distance);
  //AddMarkerToMap();
};
//停車場加上marker
const AddMarkerToMap = async () => {
  isLoading.value = true;
  // 如果已經存在 markerClusterGroup，先移除
  if (markerClusterGroup.value) {
    map.value.removeLayer(markerClusterGroup.value);
  }
  // 創建 MarkerClusterGroup
  //markerClusterGroup.value.clearLayers(); // 清除舊的標記
  markerClusterGroup.value = L.markerClusterGroup();
  markerMap.value.clear(); // 每次都清空舊的 markerMap

  // 模擬延遲 2 秒鐘
  await new Promise((resolve) => setTimeout(resolve, 1000));
  displayedParkingLots.value.forEach((lot) => {
    const iconClass = lot.validSpace > 0 ? "lotsIcon" : "lotsIcon2"; // 根據可用車位判斷class
    const backgroundColor = lot.validSpace > 0 ? "#4caf50" : "#e72e0d"; // 綠色表示可用，紅色表示不可用
    const display = lot.resDeposit > 0 ? "" : "none";
    const lotsIcon = L.divIcon({
      className: iconClass,
      html: `<div class="text-center"><i class="fa-solid fa-star" style="display:${display};color:#FF00FF;font-size:1.5rem;"></i><div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        line-height: 40px;
        font-size: 14px;
        text-align: center;
        color: white;
        font-weight: bold;
        border: 2px solid white;
        background-color: ${backgroundColor};">${lot.validSpace}</div></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    const existingMarker = markerMap.value.get(lot.lotId);
    if (!existingMarker) {
      const marker = L.marker(
        [lot.latitude, lot.longitude],
        {
          icon: lotsIcon,
        },
        13
      );
      marker.on("click", () => {
        // 滾動到對應的停車場卡片
        const cardElement = document.querySelector(
          `[data-lot-id="${lot.lotId}"]`
        );
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: "smooth", block: "center" });

          // 添加 active-card 樣式，並移除其他卡片的樣式
          const allCards = document.querySelectorAll(".card");
          allCards.forEach((card) => card.classList.remove("active-card"));
          cardElement.classList.add("active-card");
        }
      });
      markerClusterGroup.value.addLayer(marker);
      // 將 marker 存入 markerMap，使用 lotId 進行關聯
      markerMap.value.set(lot.lotId, marker);
    }
  });
  // 將 MarkerClusterGroup 添加到地圖
  if (map.value) {
    map.value.addLayer(markerClusterGroup.value);
  } else {
    console.error("地圖尚未初始化");
  }
  isLoading.value = false;
};

const focusOnMarker = (lotId) => {
  const marker = markerMap.value.get(lotId);
  if (marker) {
    map.value.setView(marker.getLatLng(), 18);
  } else {
    console.log("未找到對應marker");
  }
};

// 計算兩個經緯度之間的距離函數
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 地球半徑，單位：公里
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 得到距離
  return distance;
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
watch(displayedParkingLots, () => {
  if (map.value) {
    // 確保地圖已經初始化
    AddMarkerToMap();
  } else {
    console.warn("地圖尚未初始化，無法添加標記");
  }
});

// 掛載時檢查有沒有來自首頁的字串
onMounted(async () => {
  if (map.value === null) {
    //初始化地圖
    map.value = L.map("map").setView([22.6273, 120.3014], 15); //高雄經緯度
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "EasyPark © OpenStreetMap",
    }).addTo(map.value);
    locatePlace(map.value);
    // 初始化 LayerGroup
    markerGroup.value = L.layerGroup().addTo(map.value); // 停車場標記
    searchMarkerGroup.value = L.layerGroup().addTo(map.value); // 搜尋標記
    await loadParkingLots();
    const destinationFromHome = route.query.searchQuery; //查詢home傳來的參數
    if (destinationFromHome) {
      await SearchHandler(destinationFromHome); //自動搜尋跟定位
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
  <main id="main">
    <!-- 麵包屑 -->
    <BreadcrumbsComponent
      backgroundImage="/homePage.jpg"
      :breadcrumbs="[{ name: 'home', link: '/' }]"
    >
      <template #title>
        <!-- 插入到 title 插槽 -->
        <h2>Search Parking</h2>
      </template>
      <template #page>
        <!-- 插入到 page 插槽 -->
        查找停車位
      </template>
    </BreadcrumbsComponent>

    <!-- ======= Map Section ======= -->
    <section id="about" class="about">
      <div class="row ms-2 me-2" data-aos="fade-up">
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
                  <div class="col-md-12">
                    <div v-if="isLoading" class="map-loading-overlay">
                      <img src="/Hourglass.gif" alt="loading" />
                      <div class="spinner"></div>
                    </div>
                    <!-- 停車場資訊卡片 -->
                    <div
                      class="container mt-3"
                      style="overflow-y: auto; max-height: 550px"
                    >
                      <div
                        v-for="(lot, index) in displayedParkingLots.slice(
                          0,
                          30
                        )"
                        :key="index"
                        :data-lot-id="lot.lotId"
                        :ref="'parkingLotCard-' + index"
                        class="card mb-4"
                        @mouseover="focusOnMarker(lot.lotId)"
                        @click="ResMon(lot)"
                      >
                        <div class="card-body">
                          <div class="d-flex justify-content-between">
                            <h3 class="card-title d-flex">
                              {{ lot.lotName }}
                              <span style="color: #ff00ff" v-if="lot.deposit"
                                ><i class="fa-solid fa-star"></i
                              ></span>
                              <span
                                style="color: #d9b300"
                                v-if="lot.monRentalRate"
                                ><i class="fa-solid fa-circle"></i
                              ></span>
                            </h3>
                            <div
                              class="d-flex text-center"
                              style="width: 80px; height: 25px"
                            >
                              <img style="width: 20px" src="/Walk.gif" />
                              <span style="font-size: 15px; color: blue"
                                >{{ lot.distance.toFixed(2) }}km</span
                              >
                            </div>
                          </div>
                          <p style="font-weight: 700">
                            剩餘車位：<span style="color: chocolate">{{
                              lot.validSpace
                            }}</span>
                          </p>
                          <div class="d-flex justify-content-between">
                            <p style="font-weight: 700">
                              費用：
                              <span style="color: red">
                                {{ lot.weekdayRate }}
                              </span>
                            </p>
                            <span v-if="lot.isETC" class="ms-2"
                              ><i class="fa-solid fa-charging-station"></i
                            ></span>
                          </div>
                        </div>
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
          <div class="mt-2 d-flex">
            <p>
              <span style="color: #ff00ff"
                ><i class="fa-solid fa-star"></i></span
              >: 該停車場支援預約服務。
            </p>
            <p>
              <span style="color: #d9b300"
                ><i class="fa-solid fa-circle"></i></span
              >: 該停車場支援月租服務。
            </p>
            <p>
              <span><i class="fa-solid fa-charging-station"></i></span>:
              該停車場支援充電樁
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- End About Section -->
  </main>
</template>

<style scoped>
.card {
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 0 15px rgb(139, 133, 133); /* 卡片懸停效果 */
}

.card-title {
  font-size: 1.25rem;
  color: #333;
}

.card-body p {
  margin: 0;
  font-size: 0.9rem;
}
#map {
  width: 100%;
  height: 700px;
  position: relative;
  z-index: 1;
}
.map-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7); /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 確保它位於最上層 */
}
/* 添加選中卡片的效果 */
.active-card {
  border: 2px solid #b3b0ad; /* 邊框顏色改為橙色 */
  box-shadow: 0 0 15px rgba(85, 83, 80, 0.8); /* 卡片高亮效果 */
}
@media screen and (max-width: 768px) {
  #map {
    display: none;
  }
}
</style>
