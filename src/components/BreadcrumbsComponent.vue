<script setup>
const props = defineProps({
  backgroundImage: {
    type: String,
    default: "src/assets/images/breadcrumbs-bg.jpg",
  },
  breadcrumbs: {
    type: Array,
    default: () => [
      {
        name: "home",
        link: "/",
      },
    ],
  },
});
</script>

<template>
  <!-- Breadcrumbs.vue -->
  <div
    class="breadcrumbs d-flex align-items-center"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <!--根據props設置每個vue背景-->
    <div
      class="container position-relative d-flex flex-column align-items-center"
      data-aos="fade"
    >
      <slot name="title"></slot>
      <!-- 使用插槽 -->
      <ol>
        <li v-for="(breadcrumb, index) in breadcrumbs" :key="index">
          <RouterLink
            v-if="breadcrumb.link"
            :to="breadcrumb.link"
            class="nav-link"
            activeClass="active"
            >{{ breadcrumb.name }}</RouterLink
          >
          <span v-else>{{ breadcrumb.name }}</span>
        </li>
        <li><slot name="page"></slot></li>
        <!-- 使用插槽 -->
      </ol>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
