<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const API_URL = "https://goparkapi.azurewebsites.net/api";
const route = useRoute();
const id = route.params.id; //獲取路由的id
const parkingInfo = ref({});

const loadParkingDetail = async () => {
  const response = await fetch(`${API_URL}/EntryExitManagements/${id}`);
  const datas = await response.json();
  parkingInfo.value = datas;
};

loadParkingDetail();
</script>

<template>
  <div class="container mb-2">
    <div class="row bg-light p-2">
      <h3>{{ parkingInfo.lotName }}</h3>
      <span class="mb-2">高雄市 {{ parkingInfo.district }}</span>
      <!-- 放地圖 -->
      <div class="col-12 col-md-7 mb-2">
        <img
          class="img-fluid mb-2"
          :src="`https://maps.googleapis.com/maps/api/staticmap?center=${parkingInfo.latitude},${parkingInfo.longitude}&zoom=18&size=600x300&markers=color:red%7Clabel:P%7C${parkingInfo.latitude},${parkingInfo.longitude}&key=AIzaSyALBHIW2HQWkmhCK-VXqGIoTVttRvMTtXo`"
          alt="Map of {{ parkingInfo.lotName }}"
          style=""
        />
        <p class="bg-light">{{ parkingInfo.location }}</p>
      </div>
      <!-- 放停車資訊 -->
      <div class="col-12 col-md-5 d-flex flex-column justify-content-between">
        <div class="rounded p-2 mb-1" style="background-color: white">
          <p class="mb-1">進場時間 {{ parkingInfo.entryTime }}</p>
          <p>離場時間 {{ parkingInfo.exitTime }}</p>
          <p class="fw-bold">
            <i class="fa-regular fa-clock"></i> {{ parkingInfo.formatTime }}
          </p>
        </div>
        <p class="mt-md-auto fw-bold" style="font-size: 20px; text-align: end">
          $
          {{ parkingInfo.amount }}
        </p>
      </div>
    </div>

    <p style="text-align: end; font-size: 18px">
      <RouterLink :to="{ name: 'parking-record' }"
        ><i class="fa-solid fa-angles-left"></i>返回</RouterLink
      >
    </p>
  </div>
</template>

<style lang="css" scoped></style>
