<script setup>
//表格 暫放 尚未用到
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const API_URL = "https://localhost:7077/api";
const parkingRecords = ref([]);
const isPhoneSize = ref(false);
const isSmallScreen = ref(false); //用來判斷視窗大小決定顯示欄位
const isMiddleScreen = ref(false);
const router = useRouter();

const loadParkingRecords = async () => {
  const response = await fetch(`${API_URL}/EntryExitManagements?userId=1`);
  const datas = await response.json();
  parkingRecords.value = datas;
};

//辨識視窗大小(依照視窗大小調整看到的表格欄位)
const checkScreenSize = () => {
  isPhoneSize.value = window.innerWidth < 450;
  isSmallScreen.value = window.innerWidth >= 450 && window.innerWidth < 768;
  isMiddleScreen.value = window.innerWidth >= 768 && window.innerWidth < 1200;
};

//跳轉到詳細資訊
const viewDetails = (id) => {
  router.push(`/CustomerCenter/parking-record/${id}`);
};

onMounted(() => {
  checkScreenSize();
  loadParkingRecords();
  window.addEventListener("resize", checkScreenSize); // 監聽視窗大小變化
});
</script>

<template>
  <div>
    <div class="container" id="outside">
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
      <!-- 屬性說明:show-overflow-tooltip-欄位超出寬度會顯示提示 -->
      <el-table :data="parkingRecords" style="width: 100%" height="400">
        <el-table-column
          prop="lotName"
          label="停車場名稱"
          width="150"
          :sortable="true"
          show-overflow-tooltip
          header-cell-class-name="custom-header"
        ></el-table-column>
        <el-table-column
          v-if="!isPhoneSize"
          prop="licensePlate"
          label="車牌號碼"
          width="105"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          v-if="!isSmallScreen & !isPhoneSize"
          prop="entryTime"
          label="入場時間"
          width="180"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          v-if="!isMiddleScreen && !isSmallScreen && !isPhoneSize"
          prop="exitTime"
          label="離場時間"
          width="180"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="totalMins"
          label="停車時間(分)"
          width="130"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="amount"
          label="金額"
          width="80"
          :sortable="true"
        ></el-table-column>
        <el-table-column prop="amount" label="" width="60">
          <template #default="scope">
            <div @click="viewDetails(scope.row.entryexitId)" class="seeDetail">
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="css">
.seeDetail {
  cursor: pointer; /* 確保整個 div 都能顯示手型游標 */
}

.el-table__header {
  background: linear-gradient(
    to left,
    #dfe9f3 0%,
    white 100%
  ) !important; /* 表頭的漸層背景 */
  height: 40px;
}

.el-table__header th {
  background-color: transparent !important; /* 每個 th 背景透明 */
}

.el-table tr {
  background: transparent; /* 確保行背景透明 */
}

/* 表格樣式 */
</style>
