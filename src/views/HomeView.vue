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
      <div class="main_stars">
        <div class="sun">
          <img src="@/images/Sun.svg" alt="">
        </div>
        <div class="moon">
          <img src="@/images/Moon.svg" alt="">
        </div>
      </div>
      <div class="sky">
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
      <div class="box box1"></div>
      <div class="box box2"></div>
      <div class="box box3"></div>
      <div class="box box4"></div>
    </section>    
    <section class="panel title">
      <div class="component">
        <div id="searchbar">
          <SearchInputComponent @search="SearchHandler" v-model="searchQuery"></SearchInputComponent>
        </div>
      </div>
      <div id="car_container">
        <div id="car_path">
          <div id="car">
            <!-- <img id="car" src="@/images/car.svg"></img> -->
          </div>
          
        </div>
      </div>
    </section>
    <section class="panel panel_search">search</section>
    <section class="panel panel_test">test</section>
    <section class="panel panel_reserve">reserve</section>
    <section class="panel panel_test">test</section>
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
/*太陽跟月亮*/
.main_stars{
  top:90%;
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
  opacity: 0.5;
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
  display: flex;
  /* justify-content: center; */
  /* justify-items: center; */
  align-items: center;
  z-index: 0;
}
/* 搜尋欄 */
.component * {
  /* display: inline-block; */
  z-index: 2000;
}

#searchbar{
  position: absolute;
  /* height: 80vh; */
  width: 100%;
  justify-content: center;
  justify-items: center;
}


.panel{
  width: 100vw;
  height: 100vh;
  font-size: 300px;
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
  /* position: fixed; */
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