<script setup>
//表格 暫放 尚未用到
import { onMounted, ref } from "vue";
const API_URL = "https://localhost:7077/api";
const parkingRecords = ref([]);
const isPhoneSize = ref(false);
const isSmallScreen = ref(false); //用來判斷視窗大小決定顯示欄位
const isMiddleScreen = ref(false);

const loadParkingRecords = async () => {
  const response = await fetch(`${API_URL}/EntryExitManagements?userId=1`);
  const datas = await response.json();
  parkingRecords.value = datas;
};

const checkScreenSize = () => {
  isPhoneSize.value = window.innerWidth < 450;
  isSmallScreen.value = window.innerWidth >= 450 && window.innerWidth < 768;
  isMiddleScreen.value = window.innerWidth >= 768 && window.innerWidth < 1200;
};

onMounted(() => {
  checkScreenSize();
  loadParkingRecords();
  window.addEventListener("resize", checkScreenSize); // 監聽視窗大小變化
});
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

      <!-- 表格區 -->
      <el-table :data="parkingRecords" style="width: 100%">
        <el-table-column
          prop="lotName"
          label="停車場名稱"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="!isPhoneSize"
          prop="licensePlate"
          label="車牌號碼"
          width="100"
        ></el-table-column>
        <el-table-column
          v-if="!isSmallScreen & !isPhoneSize"
          prop="entryTime"
          label="入場時間"
          width="180"
        ></el-table-column>
        <el-table-column
          v-if="!isMiddleScreen && !isSmallScreen && !isPhoneSize"
          prop="exitTime"
          label="離場時間"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="totalMins"
          label="停車時間(分)"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="amount"
          label="金額"
          width="60"
        ></el-table-column>
        <el-table-column prop="amount" label="" width="60"
          ><i class="fa-solid fa-magnifying-glass"></i
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
