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
      <div class="buildings">
        <div class="building">
          <img src="@/images/apartment.svg" alt="">
        </div>
        <div class="building">
        <img src="@/images/cityscape.svg" alt="">
        </div>
        <div class="building">
          <img src="@/images/apartment.svg" alt="">
        </div>
        <div class="building">
          <img src="@/images/residential_area.svg" alt="">
        </div>
      </div>
      <div class="box box1"></div>
      <div class="box box2"></div>
      <div class="box box3"></div>
      <div class="box box4"></div>
    </section>    
    <section class="title">
      <div id="searchbar">
        <SearchInputComponent @search="SearchHandler" v-model="searchQuery"></SearchInputComponent>
      </div>
      <div id="car_container">
        <div id="car_path">
          <div id="car"></div>
          <!-- <img id="car" src="@/images/ot140.svg"></img> -->
        </div>
      </div>
    </section>
    <section class="panel panel_search"></section>
    <section class="panel panel_reserve"></section>
    <section class="panel panel_test"></section>
    <section class="panel panel_test"></section>
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
.buildings{
  width: 100vw;
  position: absolute;
  bottom: 15vmin;
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
}
.building{
  bottom: 0;
}

.view-point{
  position: fixed;
  width: 100vw;
  height: 100vh;
  opacity: 0.5;
  background-color: rgb(0, 255, 191);
  z-index: 1;
}

.title{
  padding:0;
  height: 100vh;
  background-color: black;
  position: relative;
}
#searchbar{
  height: 80vh;
  width: 50%;
  margin: auto;
  align-content: center;
}
.panel{
  width: 100vw;
  height: 100vh;
}

.panel_search{
  background-color: green;
}

.panel_reserve{
  background-color: gray;
}

.panel_test{
  height: 98vh;
  background-color: aquamarine;
  padding: 0;
}

.view-container {
  position: relative;  /* 關鍵：確保子元素相對這個容器定位 */
  overflow: hidden;    /* 防止子元素超出這個區域 */
  min-height: 500vh;    /* 留出足夠的空間讓動畫運行 */
}

#car_container{
  /* background-color: goldenrod; */
  height: 15vmin;
  width: 100vw;
  position: fixed;
  z-index: 1000;
  bottom: 0;
  right: 0;
  flex: content;
  align-items: center;
  /* align-content: center; */
}
#car,#car_path{
  height: 15vmin;
  position: absolute;
  /* bottom:1vh; */
  right: 10px;
}
#car{
  width: 15vmin;
  position: absolute;
  top: 0;
  align-content: center;
  animation:shakeCar 0.5s ease-in-out infinite;
}
#car_path{
  /* animation: moveCar 5s linear infinite; */
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
    transform: translateY(-5px);
  }
}


.footer{
  z-index: 1001;
}
</style>