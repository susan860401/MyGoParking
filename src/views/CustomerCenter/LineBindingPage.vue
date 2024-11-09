<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
</script>

<template>
  <div>
    <main id="main">
      <!-- 麵包屑 -->
      <BreadcrumbsComponent>
        <template #title>
          <!-- 插入到 title 插槽 -->
          <h2>Line Binding</h2>
        </template>
        <template #page>
          <!-- 插入到 page 插槽 -->
          完成會員綁定
        </template>
      </BreadcrumbsComponent>

      <!-- ======= About Section ======= -->
      <section id="about" class="about">
        <div class="container" data-aos="fade-up">
          <h1>完成會員綁定</h1>
          <p v-if="loading">正在處理綁定請求...</p>
          <p v-if="error" class="error">綁定失敗: {{ errorMessage }}</p>
          <p v-if="success">綁定成功!</p>
        </div>
      </section>
      <!-- End About Section -->
    </main>
  </div>
</template>

<style lang="css" scoped></style>
