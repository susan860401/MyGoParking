<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import SearchInputComponent from "@/components/SearchInputComponent.vue";
import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.min.js";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import flatpickr from "flatpickr";

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const API_URL = `${BASE_URL}?address=`;
const router = useRouter();
const route = useRoute();
const map = ref(null);
const markerGroup = ref(null);
const markerClusterGroup = ref(null);
const searchMarkerGroup = ref(null); // 用於搜尋標記
let userLocationMarker = ref(null); // 用來存放用戶定位的標記
const parkingLots = ref([]); // 儲存所有停車場資訊
const selectedParkingLot = ref(null); // 儲存選中的停車場資訊
const displayedParkingLots = ref([]); // 儲存顯示的10個停車場
const destinationLat = ref(null); //儲存目的地經緯度
const destinationLon = ref(null);
const isLoading = ref(false);
const selectedDate = ref(null);
const dateConfig = { enableTime: true, dateFormat: "Y-m-d H:i" };

// 使用的定位圖標
var locationIcon = L.icon({
  iconUrl: "Location.png",
  iconSize: [38, 40],
  iconAnchor: [19, 35],
  popupAnchor: [0, -35],
});

var userLocationMarkerIcon = L.icon({
  iconUrl: "Visit.png",
  iconSize: [38, 40],
  iconAnchor: [19, 35],
  popupAnchor: [0, -35],
});

// 自動滾動到卡片區域並高亮顯示的函數
const scrollToCard = (lot) => {
  // 移除之前選中的卡片的高亮顏色
  if (selectedParkingLot.value !== null) {
    const previousCard = document.querySelector(
      `[ref='parkingLotCard-${selectedParkingLot.value}']`
    );
    if (previousCard) {
      previousCard.classList.remove("active-card");
    }
  }
  // 設置新的選中卡片
  const cardElement = document.querySelector(`[ref='parkingLotCard-${lot}']`);
  if (cardElement) {
    cardElement.classList.add("active-card"); // 添加高亮樣式
    cardElement.scrollIntoView({
      behavior: "smooth", // 平滑滾動
      block: "start", // 滾動到頂部
    });
  }
  // 更新當前選中的卡片索引
  selectedParkingLot.value = lot;
};
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

      // 保存目的地經緯度
      destinationLat.value = lat;
      destinationLon.value = lon;

      if (!searchMarkerGroup.value) {
        searchMarkerGroup.value = L.layerGroup().addTo(map.value);
      }
      searchMarkerGroup.value.clearLayers();
      const marker = L.marker([lat, lon], { icon: locationIcon })
        .bindPopup(`位置：${searchQuery}`)
        .openPopup();
      searchMarkerGroup.value.addLayer(marker);
      map.value.setView([lat, lon], 15);
      updateUrlQuery(searchQuery);
      // 更新顯示的停車場
      updateDisplayLots();
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
  if (!map.value) {
    console.error("地圖尚未初始化");
    return;
  }
  try {
    const res = await fetch(`${BASE_URL}/GetParkingLots`);
    if (!res.ok) {
      throw new Error("Server無法獲取停車場數據");
    }
    const data = await res.json();
    parkingLots.value = data;
    AddMarkerToMap();
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
const updateDisplayLots = () => {
  // 確保已經有目的地的經緯度
  if (destinationLat.value === null || destinationLon.value === null) {
    console.error("目的地經緯度未定義");
    return;
  }
  displayedParkingLots.value = parkingLots.value
    .map((lot) => {
      const distance = calculateDistance(
        destinationLat.value,
        destinationLon.value,
        lot.latitude,
        lot.longitude
      );
      return { ...lot, distance };
    })
    .sort((a, b) => a.distance - b.distance);
  AddMarkerToMap();
};

//停車場加上marker
const AddMarkerToMap = async () => {
  console.log("Loading start");
  isLoading.value = true;
  // 如果已經存在 markerClusterGroup，先移除
  if (markerClusterGroup.value) {
    map.value.removeLayer(markerClusterGroup.value);
  }
  // if (markerGroup.value) {
  //   markerGroup.value.clearLayers();
  // }
  // 創建 MarkerClusterGroup
  markerClusterGroup.value = L.markerClusterGroup();

  // 模擬延遲 2 秒鐘
  await new Promise((resolve) => setTimeout(resolve, 2000));
  displayedParkingLots.value.forEach((lot, index) => {
    const iconClass = lot.validSpace > 0 ? "lotsIcon" : "lotsIcon2"; // 根據可用車位判斷class
    const lotsIcon = L.divIcon({
      className: iconClass,
      html: `<div>${lot.validSpace}</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    const marker = L.marker(
      [lot.latitude, lot.longitude],
      {
        icon: lotsIcon,
      },
      13
    ).on("click", () => {
      selectedParkingLot.value = lot;
      scrollToCard(selectedParkingLot.value);
    });
    markerClusterGroup.value.addLayer(marker);
  });
  // 將 MarkerClusterGroup 添加到地圖
  if (map.value) {
    map.value.addLayer(markerClusterGroup.value);
  } else {
    console.error("地圖尚未初始化");
  }
  isLoading.value = false;
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

// 自定義 Leaflet 控制項 (定位按鈕)
const locateUserControl = () => {
  const locateControl = L.Control.extend({
    onAdd: function () {
      const button = L.DomUtil.create("button", "locate-button");
      button.innerHTML =
        '<i class="fa-solid fa-location-crosshairs fa-beat"></i>';
      button.style.backgroundColor = "white";
      button.style.width = "30px";
      button.style.height = "30px";
      button.style.border = "2px solid #4CAF50";
      button.style.borderRadius = "50px";

      L.DomEvent.on(button, "click", function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              // 檢查是否已經有上一個定位標記，若有則清除
              destinationLat.value = lat;
              destinationLon.value = lon;
              updateDisplayLots();
              if (userLocationMarker.value) {
                map.value.removeLayer(userLocationMarker.value);
              }
              searchMarkerGroup.value.clearLayers();
              // 添加新的定位標記
              userLocationMarker.value = L.marker([lat, lon], {
                icon: userLocationMarkerIcon,
              })
                .addTo(map.value)
                .bindPopup("當前位置")
                .openPopup();
              // 移動地圖到使用者位置
              map.value.setView([lat, lon], 18);
            },
            () => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "無法取得當前位置，請確保定位已啟用!",
              });
            }
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "您的瀏覽器不支援定位功能!",
          });
        }
      });

      return button;
    },
  });

  map.value.addControl(new locateControl({ position: "bottomright" })); // 設定按鈕的位置
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

// 掛載時檢查有沒有來自首頁的字串
onMounted(async () => {
  if (map.value === null) {
    //初始化地圖
    map.value = L.map("map").setView([22.6273, 120.3014], 15); //高雄經緯度
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "EasyPark © OpenStreetMap",
    }).addTo(map.value);
    // 初始化 LayerGroup
    markerGroup.value = L.layerGroup().addTo(map.value); // 停車場標記
    searchMarkerGroup.value = L.layerGroup().addTo(map.value); // 搜尋標記
    userLocationMarker.value = L.layerGroup().addTo(map.value);
    isLoading.value = true; // 顯示 loading 畫面
    await loadParkingLots();
    isLoading.value = false; // 資料載入完成，隱藏 loading 畫面
    locateUserControl(); // 添加定位按鈕

    const destinationFromHome = route.query.searchQuery;
    if (destinationFromHome) {
      await SearchHandler(destinationFromHome); //自動搜尋跟定位
    }
    // 防止重複綁定 zoomstart 事件，只需要一次即可
    if (!map.value._zoomEventBound) {
      map.value.on("zoomstart", () => {
        map.value.closePopup();
      });
      map.value._zoomEventBound = true; // 標記事件已綁定
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
        <div class="row ms-2 me-2" data-aos="fade-up">
          <div class="col-md-4">
            <div class="row">
              <div class="col-md-12">
                <h3>MyGo Parking</h3>
                <div style="width: 100%">
                  <flatpickr
                    v-model="selectedDate"
                    :config="dateConfig"
                  ></flatpickr>
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
                          :ref="'parkingLotCard-' + index"
                          class="card mb-4"
                        >
                          <div class="card-body">
                            <h3 class="card-title">{{ lot.lotName }}</h3>
                            <p>
                              費用：
                              <span style="color: red">
                                {{ lot.weekdayRate }}
                              </span>
                            </p>
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
          </div>
        </div>
      </section>
      <!-- End About Section -->
    </main>
  </div>
</template>

<style>
.card {
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 0 15px rgba(243, 6, 6, 0.986); /* 卡片懸停效果 */
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
.locate-button {
  background-color: white;
  border-radius: 5px;
  padding: 5px;
  border: 2px solid #4caf50;
  cursor: pointer;
}

.locate-button:hover {
  background-color: #4caf50;
  color: white;
}

.lotsIcon {
  display: inline-block;
  background-color: transparent; /* 不設置背景，直接顯示內部元素 */
  border-radius: 50%;
}

.lotsIcon div {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  line-height: 40px;
  font-size: 14px;
  text-align: center;
  color: white;
  font-weight: bold;
  border: 2px solid white;
  background-color: #4caf50; /* 綠色背景表示可用 */
}
.lotsIcon2 {
  display: inline-block;
  background-color: transparent; /* 不設置背景，直接顯示內部元素 */
  border-radius: 50%;
}

.lotsIcon2 div {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  line-height: 40px;
  font-size: 14px;
  text-align: center;
  color: white;
  font-weight: bold;
  border: 2px solid white;
  background-color: #e72e0d; /* 綠色背景表示可用 */
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
/* 添加選中卡片的高亮效果 */
.active-card {
  border: 2px solid #ff9800; /* 邊框顏色改為橙色 */
  box-shadow: 0 0 15px rgba(255, 152, 0, 0.8); /* 卡片高亮效果 */
}
</style>
