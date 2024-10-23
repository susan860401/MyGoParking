<script setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // 引入 useRouter

const router = useRouter(); // 獲取 router 實例

const isLoggedIn = ref(false); // 登入狀態
const isFinished = ref(false); //是否完成通知

const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem('userId');
};

// 登出功能：清除 localStorage 導向登入頁面
const logout = () => {
  localStorage.removeItem('userId'); // 清除 userId
  isLoggedIn.value = false;
  router.push('/signIn'); // 導去登入頁面
  alert('已成功登出')
};

onMounted(() => {
  checkLoginStatus(); // 在元件加載時檢查登入狀態
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
            <li v-show="isLoggedIn" class="dropdown">
              <RouterLink
                class="nav-link"
                activeClass="active"
                to="/CustomerCenter"
                ><span><i v-show="isFinished" class="fa-solid fa-bell fa-beat"></i><i> </i>用戶中心</span>
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
            <li v-show="!isLoggedIn">
              <RouterLink
                class="nav-link" 
                activeClass="active"
                :to="{ name: 'signUp' }"
                >註冊</RouterLink
              >
            </li>
            <li v-show="!isLoggedIn">
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'signIn' }"
                >登入</RouterLink
              >
            </li>
            <li v-show="isLoggedIn">
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


#test {
  /* position: fixed; */
}
/* #header::before{
  content: "";
  background-color: transparent;
  border: 5px solid white;
  position: absolute;
  width: 100%;
  height: 100%;
  filter: blur(5px);
} */
</style>
