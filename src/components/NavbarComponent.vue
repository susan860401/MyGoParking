<script setup>
import { onMounted } from "vue";
import { useRouter,onBeforeRouteLeave } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import SearchInputComponent from "@/components/SearchInputComponent.vue";
import { ref } from "vue";

const router = useRouter();
const userStore = useUserStore();
const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 分鐘
let timeout;

//pinia
const logout = () => {
  userStore.logout();
  alert("已登出");
  router.push("/"); // 導向登入頁面
};

const resetTimeout = () => {
  clearTimeout(timeout);
  timeout = setTimeout(logout, TIMEOUT_DURATION);
};

onMounted(() => {
  userStore.checkLoginStatus(); // 初始化時檢查登入狀態
  // 監聽用戶活動事件
  window.addEventListener("mousemove", resetTimeout);
  window.addEventListener("keypress", resetTimeout);
  resetTimeout(); // 初始化計時器
});


const searchQuery = ref("");
const searchInput = ref(null);
const SearchHandler = (searchQuery) => {
  if (searchQuery) {
    router.push({
      name: "search",
      query: { searchQuery: searchQuery },
    });
  }
};

const isSearch_barOpen = ref(false);

const handleBlur = (event) => {
      // 檢查當前失去焦點的元素是否為按鈕
      const relatedTarget = event.relatedTarget;
      // console.log(relatedTarget)
      if (!relatedTarget) {
        isSearch_barOpen.value = false; 
      }
    };

const enable_Search_bar = () => {
  if (isSearch_barOpen.value){
    // console.log(searchQuery.value)
    SearchHandler(searchQuery.value)
    // 在猶豫按下去跳轉後這邊要關起來還是保持開著
    isSearch_barOpen.value = false;
  }
  else{
    // console.log("Focus",isSearch_barOpen.value)
    searchInput.value.focus();
    isSearch_barOpen.value = true;
  }
}
</script>

<template>
  <div>
    <!-- ======= Header ======= -->
    <header id="header" class="header d-flex align-items-center">
      <div
        id="test"
        class="container-fluid container-xl d-flex align-items-center justify-content-between"
      >
        <div style="display: inline-flex;">
          <RouterLink
            class="nav-link logo d-flex align-items-center"
            activeClass="active"
            to="/"
          >
            <!-- Uncomment the line below if you also wish to use an image logo -->
            <!-- <img src="assets/img/logo.png" alt=""> -->
            <h1>MyGO Parking<span>.</span></h1>
          </RouterLink>
          <div class="nav_search_bar" :class="{'nav_search_bar_animation_forwards':isSearch_barOpen},{'nav_search_bar_animation_reverse':!isSearch_barOpen}">
            <a id="nav_search_bar_icon" href="" @click.prevent="enable_Search_bar" :class="{'nav_search_bar_icon_animation':isSearch_barOpen}"><i id="nav_search_bar_icon_size" class="fa-solid fa-magnifying-glass fa-beat"></i></a>
            <input 
              v-model="searchQuery" 
              @blur="handleBlur" 
              type="text" 
              ref="searchInput" 
              class="nav_search_bar_input" 
              :class="{'nav_search_bar_input_animation_forwards':isSearch_barOpen},{'nav_search_bar_animation_reverse':!isSearch_barOpen}"
              placeholder="搜尋停車場"
              >
          </div>
        </div>
        <i class="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
        <i class="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>
        <nav id="navbar" class="navbar">
          <ul>
            <li>
              <RouterLink class="nav-link" activeClass="active" to="/"
                >Home</RouterLink
              >
            </li>
            <!-- <li>
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'search' }"
                >查找停車位</RouterLink
              >
            </li> -->
            <li>
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'guide' }"
                >使用者教學及規範</RouterLink
              >
            </li>
            <li>
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'service' }"
                >客服中心</RouterLink
              >
            </li>
            <li>
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'service' }"
                >客服中心</RouterLink
              >
            </li>
            <!-- 用戶中心選單 -->
            <li v-if="userStore.isLogin" class="dropdown">
              <RouterLink
                class="nav-link"
                activeClass="active"
                to="/CustomerCenter"
                ><span
                  ><i class="fa-solid fa-bell fa-beat"></i
                  ><i> </i>用戶中心</span
                >
                <i class="bi bi-chevron-down dropdown-indicator"></i
              ></RouterLink>
              <ul>
                <li>
                  <RouterLink
                    class="nav-link"
                    activeClass="active"
                    :to="{ name: 'edit-profile' }"
                    >用戶基本資訊</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    class="nav-link"
                    activeClass="active"
                    :to="{ name: 'parking-order' }"
                    >停車訂單查詢</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    class="nav-link"
                    activeClass="active"
                    :to="{ name: 'parking-record' }"
                    >停車紀錄查詢</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    class="nav-link"
                    activeClass="active"
                    :to="{ name: 'coupon' }"
                    >優惠券專區</RouterLink
                  >
                </li>
              </ul>
            </li>
            <li v-if="!userStore.isLogin">
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'signUp' }"
                >註冊</RouterLink
              >
            </li>
            <li v-if="!userStore.isLogin">
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'signIn' }"
                >登入</RouterLink
              >
            </li>
            <li v-if="userStore.isLogin">
              <button class="btn btn-light" @click="logout">登出</button>
            </li>
          </ul>
        </nav>
        <!-- .navbar -->
      </div>
    </header>
    <!-- End Header -->
  </div>
</template>

<style lang="css" scoped>
.nav_search_bar{
  margin-left: 3px;
  align-content: center;
  width: 0;
  /* background-color: aqua; */
  transition: width 3s;
}

.nav_search_bar_input{
  border-radius: 5px;
  background-color: white;
  width: 0;
  border: 1px;
  outline: none;
  transition: width 3s;
}

.nav_search_bar_animation_forwards, .nav_search_bar_input_animation_forwards{
  width: 20vmin; 
  transition: width 0.3s ease;
}

.nav_search_bar_animation_reverse, .nav_search_bar_input_animation_reverse{
  width: 0; 
  transition: width 0.3s ease;
  overflow: hidden;
}

#nav_search_bar_icon{
  position: absolute;
  display: inline-block;
  transition: 0.3s ease-in-out;
}

.nav_search_bar_icon_animation{
  transform: translateX(21vmin);
}

#nav_search_bar_icon_size {
  font-size: 3vmin;
  color: rgb(226, 183, 43);
}

@keyframes searchbar {
  0%{
    transform: translateX(0px);
  }
  100%{
    transform: translateX(15vmin);
  }
}
</style>
