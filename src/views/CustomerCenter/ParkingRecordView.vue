<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const API_URL = "https://localhost:7077/api";
const parkingRecords = ref([]);

const loadParkingRecords = async () => {
  const response = await fetch(`${API_URL}/EntryExitManagements?userId=1`);
  const datas = await response.json();
  parkingRecords.value = datas;
  console.log(parkingRecords.value);
};

const router = useRouter();
const goToDetail = (id) => {
  router.push(`/CustomerCenter/parking-record/${id}`);
};

loadParkingRecords();
</script>

<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-4 ps-0">
          <!-- 設定寬度 -->
          <select
            class="form-select form-select-sm mb-2"
            aria-label=".form-select-sm example"
          >
            <option selected>所有紀錄</option>
            <option value="1">過去30天</option>
            <option value="2">過去3個月</option>
            <option value="3">過去1年</option>
          </select>
        </div>
      </div>
    </div>

    <div style="padding: 5px 15px">
      <div
        v-for="record in parkingRecords"
        :key="record.entryexitId"
        @click="goToDetail(record.entryexitId)"
        class="card mb-2"
      >
        <div
          class="card-header fw-bold d-flex justify-content-between"
          style="color: white; background-color: #d9cab3"
        >
          <span>{{ record.lotName }}</span>
          <span>#{{ record.entryexitId }}</span>
        </div>
        <div class="card-body">
          <p class="align-items-center mb-2" style="font-size: 20px">
            <span
              ><i class="fa-regular fa-clock"></i> {{ record.formatTime }}</span
            >
          </p>
          <p class="mb-1" style="font-size: 12px">
            <i class="fa-solid fa-car"></i>
            進場時間
            {{ record.entryTime }}
          </p>
          <p class="mb-1" style="font-size: 12px">
            <i class="fa-solid fa-car"></i>
            離場時間
            {{ record.exitTime }}
          </p>
          <p style="text-align: end; font-size: 20px; color: #939185">
            <i class="fa-solid fa-circle-dollar-to-slot"></i>
            {{ record.amount }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
* {
  margin: 0;
}
</style>
