<script setup>
import { onMounted } from 'vue';
import { scrollanimation } from '@/js/scroll';
import SearchInputComponent from '@/components/SearchInputComponent.vue';
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchQuery = ref("");

const SearchHandler = (searchQuery) => {
  if (searchQuery) {
    router.push({
      name: "search",
      query: { searchQuery: searchQuery },
    });
  }
};


onMounted(()=>{
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
      <div class="phone">
        <img src="@/images/phone.svg" alt="">
        <div class="function">
          <div class="function_desc">試試我們的功能吧</div>
          <div class="component">
            <div id="searchbar">
              <SearchInputComponent @search="SearchHandler" v-model="searchQuery"></SearchInputComponent>
            </div>
          </div>
          <img src="@/images/location.svg" alt="">
        </div>
      </div>
      <div class="chat">
        <img src="@/images/chat_small.svg" alt="">
        <div class="story" id="story">不知道去哪邊找停車場嗎?</div>
        <i class="fa-solid fa-square-parking"></i>
      </div>
      <div class="main_stars">
        <div class="sun">
          <img src="@/images/Sun.svg" alt="">
        </div>
        <div class="moon">
          <img src="@/images/Moon.svg" alt="">
        </div>
      </div>
      <div class="sky">
        <div class="cloud_back">
          <img id="cloud_long1" src="@/images/cloud_long.svg" alt="">
        </div>
        <div class="cloud_front">
          <img id="cloud_big1" src="@/images/cloud_big1.svg" alt="">
          <img id="cloud_small1" src="@/images/cloud_small.svg" alt="">
        </div>
      </div>
      <div class="night">
        <div class="stars">
          <!-- <img src="@/images/Stars.svg" alt=""> -->
        </div>
      </div>
      <div class="buildings" style="--width:300px;--quantity:7">
        <div class="building" style="--position:1">
          <img src="@/images/school.svg" alt="">
        </div>
        <div class="building" style="--position:2">
          <img src="@/images/apartment.svg" alt="">
        </div>
        <div class="building" style="--position:3">
          <img src="@/images/cityscape.svg" alt="">
        </div>
        <div class="building" style="--position:4">
          <img src="@/images/apartment_small.svg" alt="">
        </div>
        <div class="building" style="--position:5">
          <img src="@/images/convenience_store.svg" alt="">
        </div>
        <div class="building" style="--position:6">
          <img src="@/images/apartment_rent.svg" alt="">
        </div>
        <div class="building" style="--position:7">
          <img src="@/images/residential_area.svg" alt="">
        </div>
      </div>
      <div id="car_container">
        <div id="car_path">
          <div id="car">
            <!-- <img id="car" src="@/images/car.svg"></img> -->
          </div>
        </div>
      </div>
      <div class="box box1"></div>
      <div class="box box2"></div>
      <div class="box box3"></div>
      <div class="box box4"></div>
    </section>    
    <section class="panel title">
    </section>
    <section class="panel panel_search">search</section>
    <section class="panel panel_test panel_search_follow">test</section>
    <section class="panel panel_reserve">reserve</section>
    <section class="panel panel_test panel_reserve_follow">test</section>
  </div>
</template>

<style lang="css" scoped>
.box{
  width: 30px;
  height: 30px;
  background-color: blueviolet;
}
.box1{
  position: sticky;
  top:0;
}
.box2{
  opacity: 0;
}
/* 手機 */
.phone{
  pointer-events:auto;
  position: absolute;
  left: -5%;
  bottom: -5%;
  z-index: 4000;
  opacity: 0;
}
.phone img{
  height: 90vh;
}
.function{
  pointer-events:auto;
  position: absolute;
  width: 60%;
  height: 60%;
  top: 50%; /* 將文字置於垂直中間 */
  left: 50%; /* 將文字置於水平中間 */
  transform: translate(-47%, -60%); /* 平移使文字居中 */
  color: black; /* 設定文字顏色，使其在圖片上清晰可見 */
  font-size: 2rem; /* 根據需求調整文字大小 */
  text-align: center;
}
.function img{
  position: absolute;
  bottom: 0;
  left: 0;
  height: 80%;
  width: 100%;
}

/* 情境對話 */
.chat{
  position: absolute;
  right: 0;
  z-index: 3000;
  opacity: 0;
}
.chat img{
  width: 100vmin;
  display: block;
}
.story{
  position: absolute;
  top: 50%; /* 將文字置於垂直中間 */
  left: 50%; /* 將文字置於水平中間 */
  transform: translate(-65%, -75%); /* 平移使文字居中 */
  color: black; /* 設定文字顏色，使其在圖片上清晰可見 */
  font-size: 1.5rem; /* 根據需求調整文字大小 */
  text-align: center;
}

/*太陽跟月亮和星星*/
.main_stars{
  top:95%;
  position: absolute;
  width: 185vh;
  display: flex;
  justify-content: space-between;
  /* rotate:70deg; */
}
.sun * {
  height:20vmin;
}
.moon * {
  height:20vmin;
}
.stars{
  opacity: 0;
  height: 50%;
  width: 100vmax;
}
#stars g{
  /* display: block; */
  width: 100vw;
  animation: twinkle 3s infinite;
}

@keyframes twinkle{
  0%{
    opacity: 0;
  }
  25%{
    opacity: 0.5;
  }
  50%{
    opacity: 1;
  }
  75%{
    opacity: 0.5;
  }
  100%{
    opacity: 0;
  }
}

/* 天空 */
.sky{
  position: absolute;
  width: 100%;
  opacity: 0;
}
.cloud_front{
  position: absolute;
  top:10vmax;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.cloud_back{
  height: 30vmin;
  width: 100vmax;
  top: 5vmin;
  position: absolute;
}
#cloud_big1{
  top:10vmin;
  width: 70vmin;
}
#cloud_small1{
  width: 30vmin;
}
#cloud_long1{
  height: inherit;
  position: absolute;
  left: -10%;
  z-index: -1;
}


/* 建築物部分 */
.buildings{
  pointer-events: none;
  position: absolute;
  bottom: 15vmin;
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  padding: 0;
}
.building{
  position: relative;
  bottom: 0;
}
.building img{
  width: 40vmin;
}

/* 這是拿來做一個視野窗來放我要載入的東西 */
.view-point{
  pointer-events: none;
  position: fixed;
  width: 100vw;
  height: 100vh;
  /* opacity: 0.5; */
  /* z-index: 1; */
  display: flex;
  justify-items: center;
  justify-content: center;
  /* background-color: rgb(0, 255, 191); */
}

.title{
  padding:0;
  height: 100vh;
  /* background-color: black; */
  position: relative;
  /* display: flex; */
  /* justify-content: center; */
  /* justify-items: center; */
  align-items: center;
  /* z-index: -1; */
}
/* 搜尋欄 */
.component * {
  /* display: inline-block; */
  z-index: 2000;
}
#searchbar{
  position: absolute;
  top:10%;
  width: 100%;
  justify-content: center;
  justify-items: center;
}
#searchbar div{
  width: 100%;
}


.panel{
  width: 100vw;
  height: 100vh;
  font-size: 300px;
  z-index: -1;
}

.panel_search{
  background-color: green;
}

.panel_reserve{
  background-color: gray;
}

.panel_test{
  height: 100vh;
  /* background-color: sienna; */
  padding: 0;
  /* animation: sky 10s infinite; */
}


@keyframes sky{
  0%{
    background-color: skyblue;
  }
  50%{
    background-color: #FF8600;
  }
  100%{
    background-color: #000;
  }
}

.view-container {
  position: relative;  /* 關鍵：確保子元素相對這個容器定位 */
  overflow: hidden;    /* 防止子元素超出這個區域 */
  min-height: 500vh;    /* 留出足夠的空間讓動畫運行 */
}
/* 車子部分 */
#car_container{
  background-image: url('../images/road.png');
  background-size: contain;
  /* background-color: gray; */
  height: 15vmin;
  width: 100vw;
  position: absolute;
  z-index: 1000;
  bottom: 0;
  right: 0;
  /* flex: content; */
  /* align-items: center; */
  /* align-content: center; */
}
#car,#car_path{
  height: 15vmin;
  width: 15vmin;
  position: absolute;
  /* bottom:1vh; */
  right: 10px;
  display: flex;
}
#car{
  /* width: 15vmin; */
  position: absolute;
  animation:shakeCar 0.5s ease-in-out infinite;
}
#car svg {
    position: absolute;
    top:100px;
    right: 0;
    width: 100%; /* 讓 SVG 寬度填滿容器 */
    height: auto; /* 保持 SVG 的比例 */
    display: block; /* 移除 inline 元素的額外間距 */
}

@keyframes moveCar {
  to {
    transform: translateX(-100vw); /* 完全移出視窗 */
  }
}

@keyframes shakeCar {
  0%, 100% {
    transform: translateY(0); /* 垂直方向震動 */
  }
  50% {
    transform: translateY(-1px);
  }
}

#header{
  z-index:1001;
}

#footer{
  z-index:1001;
}
</style>