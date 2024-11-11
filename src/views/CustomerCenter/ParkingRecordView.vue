<script setup>
//表格 暫放 尚未用到
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore"; //要取Pinia

const userStore = useUserStore();
const userId = userStore.userId;
const API_URL = "https://goparkapi.azurewebsites.net/api";
const parkingRecords = ref([]); //儲存所有停車紀錄
const filteredRecords = ref([]); // 儲存經過過濾的紀錄
const licensePlate = ref([]); //儲存用戶的車牌
const choseCar = ref("請選擇車牌");
const choseDates = ref([]);
const search = ref(""); //搜尋行政區

//分頁控制屬性
const currentPage = ref(1); // 當前頁數
const pageSize = ref(10); // 每頁顯示的資料數量
const totalRecords = ref(0); // 總資料數

//用來判斷視窗大小決定顯示欄位
const isPhoneSize = ref(false);
const isSmallScreen = ref(false);
const isMiddleScreen = ref(false);

const router = useRouter();
//取得用戶的車牌
const getLicensePlate = async () => {
  const response = await fetch(
    `${API_URL}/Reservations/GetUserCarPlate?userId=${userId}`
  );
  const datas = await response.json();
  licensePlate.value = datas.userCarPlate;
  console.log(licensePlate);
};

const loadParkingRecords = async () => {
  const response = await fetch(
    `${API_URL}/EntryExitManagements?userId=${userId}`
  );
  const datas = await response.json();
  parkingRecords.value = datas;
  filteredRecords.value = datas;
  totalRecords.value = parkingRecords.value.length;

  // 根據當前頁面和每頁顯示的資料數量來顯示資料
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  filteredRecords.value = filteredRecords.value.slice(start, end);
};
//進階篩選
const applyFilters = () => {
  filteredRecords.value = parkingRecords.value.filter((record) => {
    // 滿足條件的項目才會保留
    let isMatch = true;

    // 如果有選擇車牌，進行車牌篩選
    if (choseCar.value != "請選擇車牌") {
      isMatch = isMatch && record.licensePlate == choseCar.value;
    }
    //如果有選擇日期
    if (choseDates.value) {
      const startDate = new Date(choseDates.value[0])
        .toISOString()
        .split("T")[0];
      const endDate = new Date(choseDates.value[1]).toISOString().split("T")[0];
      const recordDate = new Date(record.entryTime).toISOString().split("T")[0];
      isMatch = isMatch && recordDate >= startDate && recordDate <= endDate;
    }
    //如果有搜尋行政區
    if (search.value) {
      isMatch = isMatch && record.district.includes(search.value);
    }
    return isMatch; // 滿足所有篩選條件的紀錄才保留
  });
  totalRecords.value = filteredRecords.value.length; //篩選過後總資料數

  // 根據當前頁面和每頁顯示的資料數量來顯示資料
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  filteredRecords.value = filteredRecords.value.slice(start, end);
};

//當改變選擇頁數
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  applyFilters(); // 重新篩選資料
};

//辨識視窗大小(依照視窗大小調整看到的表格欄位)
const checkScreenSize = () => {
  isPhoneSize.value = window.innerWidth < 450;
  isSmallScreen.value = window.innerWidth >= 450 && window.innerWidth < 768;
  isMiddleScreen.value = window.innerWidth >= 768 && window.innerWidth < 1200;
};

const formatTime = (time) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}   ${hour}:${minute}`;
};

//跳轉到詳細資訊
const viewDetails = (id) => {
  router.push(`/CustomerCenter/parking-record/${id}`);
};

onMounted(() => {
  checkScreenSize();
  getLicensePlate();
  loadParkingRecords();
  window.addEventListener("resize", checkScreenSize); // 監聽視窗大小變化
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-4 ps-0">
        <!-- 設定寬度 -->
      </div>
    </div>

    <!----- 篩選區塊 ----->
    <!-- 篩選入場日期 -->
    <div class="filterArea">
      <div class="mb-2">
        入場日期
        <el-date-picker
          @change="applyFilters"
          v-model="choseDates"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
        />
      </div>

      <div class="row mb-2">
        <!-- 搜尋行政區 -->
        <div class="col-md-8 mb-2">
          <input
            v-model="search"
            @keyup="applyFilters"
            type="text"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            placeholder="預訂停車場行政區(e.g., 三民區)"
          />
        </div>
        <!-- 選擇車牌 -->
        <div class="col-md-4">
          <select
            @change="applyFilters"
            v-model="choseCar"
            width="300px"
            class="form-select form-select-sm mb-2"
            aria-label=".form-select-sm example"
          >
            <option value="請選擇車牌">請選擇車牌</option>
            <option v-for="car in licensePlate" :value="car">{{ car }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 表格區 -->

    <!-- 屬性說明:show-overflow-tooltip-欄位超出寬度會顯示提示 -->
    <el-table :data="filteredRecords" height="440">
      <el-table-column
        prop="lotName"
        label="停車場名稱"
        :min-width="isPhoneSize ? 120 : 150"
        :sortable="true"
        show-overflow-tooltip
        header-cell-class-name="custom-header"
      ></el-table-column>

      <el-table-column
        v-if="!isPhoneSize"
        prop="licensePlate"
        label="車牌號碼"
        :min-width="105"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        v-if="!isSmallScreen && !isPhoneSize"
        label="入場時間"
        :min-width="150"
        :sortable="true"
        ><template #default="scope">
          <div>
            {{ formatTime(scope.row.entryTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!isMiddleScreen && !isSmallScreen && !isPhoneSize"
        label="離場時間"
        :min-width="150"
        :sortable="true"
        ><template #default="scope">
          <div>
            {{ formatTime(scope.row.exitTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalMins"
        label="時長(分)"
        :min-width="100"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        prop="amount"
        label="金額"
        :min-width="80"
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
    <!-- 分頁元件 -->
    <div class="d-flex justify-content-end mt-4">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :total="totalRecords"
        layout="prev, pager, next, jumper,total"
      />
    </div>
  </div>
</template>

<style lang="css">
#outside {
  box-shadow: -5px 0px 10px lightgrey;
}

.seeDetail {
  cursor: pointer; /* 確保整個 div 都能顯示手型游標 */
}

.filterArea {
  padding-top: 5px;
  padding-left: 5px;
  border-radius: 10px;
}

.el-table__header {
  background: linear-gradient(
    to right,
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
