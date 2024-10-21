<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
</script>

<template>
  <div>
    <!-- 這頁主要放用戶中心細分的導覽列，然後動態載入子路由 -->
    <main id="main">
      <!-- 麵包屑 -->
      <BreadcrumbsComponent>
        <template #title>
          <!-- 插入到 title 插槽 -->
          <h2>User Center</h2>
        </template>
        <template #page>
          <!-- 插入到 page 插槽 -->
          用戶中心
        </template>
      </BreadcrumbsComponent>
    </main>
    <RouterView></RouterView>
  </div>
</template>

<style lang="css" scoped></style>
