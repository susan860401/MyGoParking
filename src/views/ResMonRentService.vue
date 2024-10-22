<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const lotName = route.query.lotName;
</script>

<template>
  <div>
    <main id="main">
      <BreadcrumbsComponent>
        <template #title>
          <!-- 插入到 title 插槽 -->
          <h2>Reservation & MonthlyRental</h2>
        </template>
        <template #page>
          <!-- 插入到 page 插槽 -->
          預約、月租服務
        </template>
      </BreadcrumbsComponent>
      <section>
        <h2>{{ lotName }}</h2>
      </section>
    </main>
  </div>
</template>

<style lang="css" scoped></style>
