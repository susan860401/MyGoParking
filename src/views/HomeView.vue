<script setup>
import { onMounted } from "vue";
import { scrollanimation } from "@/js/scroll";
import SearchInputComponent from "@/components/SearchInputComponent.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchQuery = ref("");

//前往新路由重新定向
const SearchHandler = (searchQuery) => {
  if (searchQuery) {
    router.push({
      name: "search",
      query: { searchQuery: searchQuery },
    });
  }
};

onMounted(() => {
  try {
    scrollanimation();
  } catch (error) {
    console.error("Error during mounted:", error);
  }
});
</script>

<template>
  <div class="view-container">
    <section class="view-point">
      <div class="phone" id="phone1">
        <img src="@/images/phone.svg" alt="" />
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
          <img src="@/images/location.svg" alt="" />
        </div>
      </div>
      <div class="phone" id="phone2">
        <img src="@/images/phone.svg" alt="" />
        <div class="function">
          <div class="function_desc">試試我們的功能吧</div>
          <div class="component">
            <div id="searchbar">我這邊要放預定或加入會員的連結</div>
          </div>
          <img src="@/images/location.svg" alt="" />
        </div>
      </div>
      <div class="chat">
        <img src="@/images/chat_small.svg" alt="" />
        <div class="story" id="story">不知道去哪邊找停車場嗎?</div>
      </div>
      <div class="main_stars">
        <div class="sun">
          <img src="@/images/Sun.svg" alt="" />
        </div>
        <div class="moon">
          <img src="@/images/Moon.svg" alt="" />
        </div>
      </div>
      <div class="buildings" style="--width: 300px; --quantity: 7">
        <div class="building" style="--position: 1">
          <img src="@/images/school.svg" alt="" />
        </div>
        <div class="building" style="--position: 2">
          <img src="@/images/apartment.svg" alt="" />
        </div>
        <div class="building" style="--position: 3">
          <img src="@/images/cityscape.svg" alt="" />
        </div>
        <div class="building" style="--position: 4">
          <img src="@/images/apartment_small.svg" alt="" />
        </div>
        <div class="building" style="--position: 5">
          <img src="@/images/convenience_store.svg" alt="" />
        </div>
        <div class="building" style="--position: 6">
          <img src="@/images/apartment_rent.svg" alt="" />
        </div>
        <div class="building" style="--position: 7">
          <img src="@/images/residential_area.svg" alt="" />
        </div>
      </div>
      <div class="box box1"></div>
      <div class="box box2"></div>
      <div class="box box3"></div>
      <div class="box box4"></div>
    </section>
    <section class="panel title">
      <div class="component">
        <div id="searchbar">
          <SearchInputComponent
            @search="SearchHandler"
            v-model="searchQuery"
          ></SearchInputComponent>
        </div>
      </div>
      <div id="car_container">
        <div class="parking">
          <div id="parking_slot">
            <img src="@/images/parking_slot.png" alt="" />
          </div>
          <div id="parked_car1">
            <img src="@/images/car_parked1.svg" alt="" />
          </div>
          <div id="parked_car2">
            <img src="@/images/car_parked2.svg" alt="" />
          </div>
          <div id="parked_car3">
            <img src="@/images/car_parked3.svg" alt="" />
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
    <section class="panel title">title</section>
    <section class="panel panel_search">search</section>
    <section class="panel panel_test panel_search_follow">test</section>
    <section class="panel panel_reserve">reserve</section>
    <section class="panel panel_test panel_reserve_follow">test</section>
  </div>
</template>

<style lang="css" scoped>
.box {
  width: 30px;
  height: 30px;
  background-color: blueviolet;
}
.box1 {
  position: sticky;
  top: 0;
}
.box2 {
  opacity: 0;
}
/*太陽跟月亮*/
.main_stars {
  display: flex;
  justify-content: space-between;
}
.sun * {
  height: 100px;
}
.moon * {
  height: 100px;
}

/* 建築物部分 */
.buildings {
  pointer-events: none;
  position: absolute;
  bottom: 15vmin;
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  padding: 0;
}
.building {
  position: relative;
  bottom: 0;
}
.building img {
  width: 40vmin;
}

/* 這是拿來做一個視野窗來放我要載入的東西 */
.view-point {
  pointer-events: none;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-items: center;
  justify-content: center;
}

.title {
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
  /* display: inline-block; */
  z-index: 2000;
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
}

.panel_search {
  background-color: green;
}

.panel_reserve {
  background-color: gray;
}

.panel_test {
  height: 98vh;
  background-color: aquamarine;
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
  position: relative; /* 關鍵：確保子元素相對這個容器定位 */
  overflow: hidden; /* 防止子元素超出這個區域 */
  min-height: 500vh; /* 留出足夠的空間讓動畫運行 */
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
#car_path {
  height: 15vmin;
  position: absolute;
  /* bottom:1vh; */
  right: 10px;
}
#car {
  width: 15vmin;
  position: absolute;
  top: 0;
  align-content: center;
  animation: shakeCar 0.5s ease-in-out infinite;
}
#car_path {
  /* animation: moveCar 5s linear infinite; */
}

@keyframes moveCar {
  to {
    transform: translateX(-100vw); /* 完全移出視窗 */
  }
}

@keyframes shakeCar {
  0%,
  100% {
    transform: translateY(0); /* 垂直方向震動 */
  }
  50% {
    transform: translateY(-1px);
  }
}

.footer {
  z-index: 1001;
}
</style>
