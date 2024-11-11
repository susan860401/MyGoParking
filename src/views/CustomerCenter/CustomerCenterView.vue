<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
</script>

<template>
  <!-- 這頁主要放用戶中心細分的導覽列，然後動態載入子路由 -->
  <main id="main">
    <!-- 麵包屑 -->
    <BreadcrumbsComponent
      backgroundImage="/src/assets/images/parkingLot_top.png"
    >
      <template #title>
        <!-- 插入到 title 插槽 -->
        <h2>User Center</h2>
      </template>
      <template #page>
        <!-- 插入到 page 插槽 -->
        用戶中心
      </template>
    </BreadcrumbsComponent>

    <!-- 內容區 含左側選單-->
    <section id="service-details" class="service-details">
      <div class="container" data-aos="fade-up" data-aos-delay="100">
        <div class="row gy-4">
          <!-- 左側選單 -->
          <div class="col-lg-3">
            <div class="services-list">
              <RouterLink activeClass="active" :to="{ name: 'edit-profile' }"
                >用戶基本資訊</RouterLink
              >
              <RouterLink activeClass="active" :to="{ name: 'set-plate' }"
                >車牌設定</RouterLink
              >
              <RouterLink activeClass="active" :to="{ name: 'parking-order' }"
                >預訂紀錄</RouterLink
              >
              <RouterLink activeClass="active" :to="{ name: 'parking-record' }"
                >停車紀錄</RouterLink
              >
              <RouterLink activeClass="active" :to="{ name: 'monthlyRental' }"
                >月租中心</RouterLink
              >
              <RouterLink activeClass="active" :to="{ name: 'coupon' }"
                >優惠券專區</RouterLink
              >
            </div>
          </div>
          <!-- 載入conponent區塊 -->
          <div class="col-lg-9">
            <RouterView></RouterView>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="css" scoped></style>
