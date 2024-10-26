<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore"; // 引入 store

const router = useRouter();
const authStore = useAuthStore();
const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 分鐘
let timeout;


//pinia
const logout = () => {
  authStore.logout();
  alert("已登出")
  router.push("/"); // 導向登入頁面
};



const resetTimeout = () => {
  clearTimeout(timeout);
  timeout = setTimeout(logout, TIMEOUT_DURATION);
};

onMounted(() => {
  authStore.checkLoginStatus(); // 初始化時檢查登入狀態
  // 監聽用戶活動事件
  window.addEventListener("mousemove", resetTimeout);
  window.addEventListener("keypress", resetTimeout);
  resetTimeout(); // 初始化計時器
});
</script>

<template>
  <div>
    <!-- ======= Header ======= -->
    <header id="header" class="header d-flex align-items-center">
      <div
        id="test"
        class="container-fluid container-xl d-flex align-items-center justify-content-between"
      >
        <RouterLink
          class="nav-link logo d-flex align-items-center"
          activeClass="active"
          to="/"
        >
          <!-- Uncomment the line below if you also wish to use an image logo -->
          <!-- <img src="assets/img/logo.png" alt=""> -->
          <h1>MyGO Parking<span>.</span></h1>
        </RouterLink>

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
            <!-- 用戶中心選單 -->
            <li v-if="authStore.isLogin" class="dropdown">
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
            <li v-if="!authStore.isLogin">
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'signUp' }"
                >註冊</RouterLink
              >
            </li>
            <li v-if="!authStore.isLogin">
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'signIn' }"
                >登入</RouterLink
              >
            </li>
            <li v-if="authStore.isLogin">
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

<style lang="css" scoped></style>
