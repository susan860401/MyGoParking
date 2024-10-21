<script setup></script>

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
            <li class="dropdown">
              <RouterLink
                class="nav-link"
                activeClass="active"
                to="/CustomerCenter"
                ><span>用戶中心</span>
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
            <li>
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'signUp' }"
                >Sign Up</RouterLink
              >
            </li>
            <li>
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'signIn' }"
                >Sign In</RouterLink
              >
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
</style>
