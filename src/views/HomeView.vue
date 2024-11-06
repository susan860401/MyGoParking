<script setup>
import { nextTick, onBeforeUnmount, onMounted, onUpdated } from "vue";
import { scrollanimation, killAnimation } from "@/js/scroll";
import SearchInputComponent from "@/components/SearchInputComponent.vue";
import { ref } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { subscribeUserToPush } from "../js/userToPush";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const router = useRouter();
const searchQuery = ref("");
const isLoading = ref(true);

const SearchHandler = (searchQuery) => {
  if (searchQuery) {
    router.push({
      name: "search",
      query: { searchQuery: searchQuery },
    });
  }
};




onMounted(async () => {
  userStore.checkLoginStatus(); // 初始化時檢查登入狀態
  const user = localStorage.getItem("isLogin");
  const data = JSON.parse(user);
  if (userStore.isLogin) {
    await router.push("/search");
  }
  else{
    try {
    await scrollanimation();
    await new Promise((resolve) => setTimeout(resolve, 300)); // 模擬加載
    await nextTick();
    } catch (error) {
      console.error("Error during mounted:", error);
    } finally {
      isLoading.value = false;
    }
  }
  Notification.requestPermission().then((permission) => {
    if (permission == "granted") {
      subscribeUserToPush();
    } else {
      console.warn("拒絕");
    }
  });
});

onBeforeUnmount(() => {
  killAnimation();
});

onBeforeRouteLeave(() => {
  isLoading.value = true;
  window.scrollTo(0, 0);
  nextTick();
});

// window.addEventListener('resize',() => {
//   window.location.reload();
// })

const redirectSignUp = () => {
  router.push("signUp");
};
</script>

<template>
  <div v-if="isLoading" class="loading d-flex justify-content-center">
    <div class="loader">
      <div class="loader-text">Loading...</div>
      <div class="loader-bar"></div>
    </div>
  </div>
  <div class="view-container">
    <section class="view-point">
      <div class="background" id="background">
        <!-- <img src="@/images/background.svg" alt=""> -->
      </div>
      <div class="phone" id="phone1">
        <img v-once src="@/images/phone.svg" alt="" />
        <div class="function">
          <div class="function_desc">試試我們的功能吧</div>
          <div class="component">
            <div id="searchbar">
              <SearchInputComponent
                @search="SearchHandler"
                v-model="searchQuery"
              ></SearchInputComponent>
            </div>
          </div>
          <img v-once src="@/images/location.svg" alt="" />
        </div>
      </div>
      <div class="phone" id="phone2">
        <img v-once src="@/images/phone.svg" alt="" />
        <div class="function">
          <div class="function_desc mb-3">加入我們, 試試預訂或月租!</div>
          <div class="component">
            <div id="searchbar">
              <button class="btn btn-outline-success" @click="redirectSignUp">
                加入會員
              </button>
            </div>
          </div>
          <img v-once src="@/images/location.svg" alt="" />
        </div>
      </div>
      <div class="chat">
        <img v-once src="@/images/chat_small.svg" alt="" />
        <div class="story" id="story">不知道去哪邊找停車場嗎?</div>
      </div>
      <div class="main_stars">
        <div class="sun">
          <img v-once src="@/images/Sun.svg" alt="" />
        </div>
        <div class="moon">
          <img v-once src="@/images/Moon.svg" alt="" />
        </div>
      </div>
      <div class="sky">
        <div class="cloud_back">
          <img v-once id="cloud_long1" src="@/images/cloud_long.svg" alt="" />
        </div>
        <div class="cloud_front">
          <img v-once id="cloud_big1" src="@/images/cloud_big1.svg" alt="" />
          <img v-once id="cloud_small1" src="@/images/cloud_small.svg" alt="" />
        </div>
      </div>
      <div class="night">
        <div class="stars">
          <!-- <img src="@/images/Stars.svg" alt=""> -->
        </div>
      </div>
      <div class="buildings" style="--width: 300px; --quantity: 7">
        <div class="building">
          <img v-once src="@/images/buildings.svg" alt="">
        </div>
        <!-- <div class="building" style="--position: 1">
          <img v-once src="@/images/school.svg" alt="" />
        </div>
        <div class="building" style="--position: 2">
          <img v-once src="@/images/apartment.svg" alt="" />
        </div>
        <div class="building" style="--position: 3">
          <img v-once src="@/images/cityscape.svg" alt="" />
        </div>
        <div class="building" style="--position: 5">
          <img v-once src="@/images/convenience_store.svg" alt="" />
        </div>
        <div class="building" style="--position: 4">
          <img v-once src="@/images/apartment_small.svg" alt="" />
        </div>
        <div class="building" style="--position: 7">
          <img v-once src="@/images/residential_area.svg" alt="" />
        </div>
        <div class="building" style="--position: 6">
          <img v-once src="@/images/apartment_rent.svg" alt="" />
        </div> -->
      </div>
      <div class="question">
        <img v-once src="@/images/question_cloud.svg" alt="" />
        <div class="parking_icon">
          <i class="fa-solid fa-square-parking"></i>
        </div>
      </div>
      <div id="car_container">
        <div class="parking">
          <div id="parking_slot">
            <img v-once src="@/images/parking_slot.png" alt="" />
          </div>
          <div id="parked_car1">
            <img v-once src="@/images/car_parked1.svg" alt="" />
          </div>
          <div id="parked_car2">
            <img v-once src="@/images/car_parked2.svg" alt="" />
          </div>
          <div id="parked_car3">
            <img v-once src="@/images/car_parked3.svg" alt="" />
          </div>
        </div>
        <div id="car_path">
          <div id="car">
            <div id="car_body">
              <!-- <img id="car" src="@/images/car.svg"></img> -->
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="panel title"><!--title--></section>
    <section class="panel panel_search">search</section>
    <section class="panel panel_test panel_search_follow">test</section>
    <section class="panel panel_reserve">reserve</section>
    <section class="panel panel_test panel_reserve_follow">test</section>
  </div>
</template>

<style lang="css" scoped>
.loading {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: skyblue;
  opacity: 1;
  z-index: 9999;
}

.loader {
  /* background-color: blue; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.loader-text {
  font-size: 24px;
  color: rgb(0, 0, 0);
  margin-bottom: 20px;
  align-self: center;
}

.loader-bar {
  width: 30%;
  height: 10px;
  border-radius: 5px;
  background-color: rgb(0, 0, 0);
  animation: loader-bar-animation 2s ease-in-out infinite;
}

@keyframes loader-bar-animation {
  0% {
    /* transform: translateX(-100%) rotate(270deg); */
    transform: translateX(-100%);
  }

  50% {
    /* transform: translateX(100%) rotate(-90deg); */
    transform: translateX(100%);
  }

  100% {
    /* transform: translateX(-100%) rotate(270deg); */
    transform: translateX(-100%);
  }
}

/* 背景 */
.background {
  position: absolute;
  bottom: 15vmin;
  right: 0;
  z-index: 1;
  width: 100vw;
}

/* 手機 */
.phone {
  /* pointer-events: auto; */
  position: absolute;
  left: 0;
  z-index: 4000;
  opacity: 0;
  height: 100vh;
  width: auto;
  display: flex;
  justify-items: center;
  justify-content: center;
  align-items: center;
}

@media (max-width: 850px) {
  .phone {
    width: 100vw;
    /* border:10px solid black; */
    display: flex;
    justify-items: center;
    justify-content: center;
  }

  .phone img {
    width: 130vw;
  }

  .function {
    justify-content: center;
    align-content: center;
    flex-wrap: nowrap;
  }

  .function_desc {
    font-size: 1.3rem;
  }
}

.phone img {
  height: 100vh;
}

.function {
  /* pointer-events: auto; */
  position: absolute;
  width: 60%;
  height: 70%;
  color: black;
  /* 設定文字顏色，使其在圖片上清晰可見 */
  font-size: 1.5rem;
  /* 根據需求調整文字大小 */
  text-align: center;
  align-items: center;
  align-content: center;
}

.function img {
  display: block;
  /* position: relative; */
  height: fit-content;
  width: 100%;
}

/* 情境對話 */
.chat {
  position: absolute;
  right: 0;
  z-index: 3000;
  opacity: 0;
}

.chat img {
  width: 100vmin;
  display: block;
}

.story {
  position: absolute;
  top: 50%;
  /* 將文字置於垂直中間 */
  left: 50%;
  /* 將文字置於水平中間 */
  transform: translate(-65%, -75%);
  /* 平移使文字居中 */
  color: black;
  /* 設定文字顏色，使其在圖片上清晰可見 */
  font-size: 4vmin;
  /* 根據需求調整文字大小 */
  text-align: center;
}

/*太陽跟月亮和星星*/
.main_stars {
  top: 95%;
  position: absolute;
  width: 185vh;
  display: flex;
  justify-content: space-between;
  z-index: -1;
}

.sun * {
  height: 20vmin;
}

.moon * {
  height: 20vmin;
}

.stars {
  opacity: 0;
  height: 50%;
  width: 100vmax;
}

#stars g {
  width: 100vw;
  animation: twinkle 3s infinite;
}

@keyframes twinkle {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }

  75% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
  }
}

/* 天空 */
.sky {
  position: absolute;
  width: 100%;
  opacity: 0;
}

.cloud_front {
  position: absolute;
  top: 10vmax;
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.cloud_back {
  height: 30vmin;
  width: 100vmax;
  top: 5vmin;
  position: absolute;
  z-index: -10;
}

#cloud_big1 {
  top: 10vmin;
  width: 70vmin;
}

#cloud_small1 {
  width: 30vmin;
}

#cloud_long1 {
  height: inherit;
  position: absolute;
  left: -10%;
  z-index: -1;
}

/* 建築物部分 */
.buildings {
  /* pointer-events: none; */
  position: absolute;
  bottom: 13vmin;
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  padding: 0;
  z-index: 10;
}

.building {
  position: relative;
  bottom: 0;
}

.building img {
  /* width: 50vmin; */
  width: 400vmin;
  transform: translate();
}

/* 這是拿來做一個視野窗來放我要載入的東西 */
.view-point {
  /* pointer-events: none; */
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-items: center;
  justify-content: center;
  background-color: #87ceeb;
}

.title {
  background-color: skyblue;
  padding: 0;
  height: 100vh;
  position: relative;
  align-items: center;
}

/* 搜尋欄 */
.component {
  height: 10vh;
  margin-top: 1vh;
}

.component * {
  /* pointer-events: auto; */
  height: 5vh;
  z-index: 1000;
  position: relative;
}

#searchbar {
  position: absolute;
  width: 100%;
  justify-content: center;
  justify-items: center;
}

#searchbar div {
  width: 100%;
}

.panel {
  width: 100vw;
  height: 100vh;
  font-size: 300px;
  z-index: -1;
  background-color: transparent;
}

/* .panel_search {
  background-color: green;
}

.panel_reserve {
  background-color: gray;
} */

.panel_test {
  height: 100vh;
  /* background-color: sienna; */
  padding: 0;
  /* animation: sky 10s infinite; */
}

@keyframes sky {
  0% {
    background-color: skyblue;
  }

  50% {
    background-color: #ff8600;
  }

  100% {
    background-color: #000;
  }
}

.view-container {
  position: relative;
  /* 關鍵：確保子元素相對這個容器定位 */
  overflow: hidden;
  /* 防止子元素超出這個區域 */
  min-height: 500vh;
  /* 留出足夠的空間讓動畫運行 */
}

/* 停車格 */

.parking {
  position: absolute;
  /* top:85vmin; */
  left: 65%;
  bottom: 9vmin;
  z-index: 5000;
  display: flex;
  opacity: 1;
  z-index: -1;
}

#parking_slot img {
  height: 5vmin;
  /* width: 7vmin; */
}

#parked_car1 {
  position: absolute;
  bottom: -3vmin;
  left: -10vmin;
  height: 15vmin;
  width: 15vmin;
  opacity: 0;
}

#parked_car2 {
  position: absolute;
  bottom: -3vmin;
  left: 22vmin;
  height: 15vmin;
  width: 15vmin;
}

#parked_car3 {
  position: absolute;
  bottom: -3vmin;
  left: 39vmin;
  height: 15vmin;
  width: 15vmin;
}

/* 車子部分 */
#car_container {
  background-image: url("../images/road.png");
  background-size: contain;
  height: 15vmin;
  width: 400vw;
  position: absolute;
  z-index: 1000;
  bottom: 0;
  right: 0;
}

#car,
#car_path,
#car_body {
  height: 15vmin;
  width: 15vmin;
  position: absolute;
  top: 1vmin;
  right: 10px;
  display: flex;
  z-index: -1;
}

#car {
  animation: shakeCar 0.5s ease-in-out infinite;
}

@keyframes moveCar {
  to {
    transform: translateX(-100vw);
    /* 完全移出視窗 */
  }
}

@keyframes shakeCar {
  0%,
  100% {
    transform: translateY(0);
    /* 垂直方向震動 */
  }

  50% {
    transform: translateY(-1px);
  }
}

.question {
  position: absolute;
  right: 16vmin;
  bottom: 16vmin;
  height: 15vmin;
  width: 15vmin;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.question img {
  position: absolute;
  /* right: 10vmin; */
  /* bottom: 8vmin; */
  height: 15vmin;
  width: 15vmin;
}

.parking_icon {
  position: absolute;
  /* right: 95%; */
  /* bottom: 80%; */
  font-size: 8vmin;
}

/* 標題跟footer的部分 */
#header {
  z-index: 1001;
}

#footer {
  z-index: 1001;
}
</style>
