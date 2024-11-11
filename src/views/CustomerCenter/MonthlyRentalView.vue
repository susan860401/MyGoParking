<script setup>
import { scrollbarProps } from "element-plus";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/userStore"; //要取Pinia
import { useRouter } from "vue-router";

const userStore = useUserStore();
const userId = userStore.userId;
const API_URL = "https://goparkapi.azurewebsites.net/api";
const router = useRouter();
const activePage = ref("current"); //目前在哪個頁面(當前合約還是歷史)
const monthlyRentals = ref([]);
const filteredRentals = ref([]); // 儲存經過過濾的紀錄
const currentRental = ref([]); //還沒到期的合約
const licensePlate = ref([]); //儲存用戶的車牌
const choseCar = ref("請選擇車牌");
const choseDate = ref("");
const search = ref(""); //搜尋行政區
const isLoaded = ref(false);

//分頁控制屬性
const currentPage = ref(1); // 當前頁數
const pageSize = ref(10); // 每頁顯示的資料數量
const totalRecords = ref(0); // 總資料數

//用來判斷視窗大小決定顯示欄位
const isPhoneSize = ref(false);
const isSmallScreen = ref(false);
const isMiddleScreen = ref(false);

//取得用戶的車牌
const getLicensePlate = async () => {
  const response = await fetch(
    `${API_URL}/Reservations/GetUserCarPlate?userId=${userId}`
  );
  const datas = await response.json();
  licensePlate.value = datas.userCarPlate;
  console.log(licensePlate);
};

const loadMonthlyRental = async () => {
  try {
    const response = await fetch(`${API_URL}/MonthlyRentals?userId=${userId}`);
    const datas = await response.json();
    monthlyRentals.value = datas;
    filteredRentals.value = datas;
    const today = new Date();
    currentRental.value = monthlyRentals.value.filter((rental) => {
      return new Date(rental.endDate) > today;
    });

    totalRecords.value = monthlyRentals.value.length; //資料總數
    // 根據當前頁面和每頁顯示的資料數量來顯示資料
    const start = (currentPage.value - 1) * pageSize.value;
    const end = currentPage.value * pageSize.value;
    filteredRentals.value = filteredRentals.value.slice(start, end);
  } catch (error) {
    console.error("Failed to load monthly rentals", error);
  } finally {
    isLoaded.value = true;
  } // 資料加載完成，設置為 true
};

//載入當前合約
const loadCurrent = async () => {
  activePage.value = "current";
  console.log("current");
};
//載入歷史合約
const loadHistory = async () => {
  activePage.value = "history";
  console.log("history");
};

//進階篩選
const applyFilters = () => {
  filteredRentals.value = monthlyRentals.value.filter((rental) => {
    // 滿足條件的項目才會保留
    let isMatch = true;

    // 如果有選擇車牌，進行車牌篩選
    if (choseCar.value != "請選擇車牌") {
      isMatch = isMatch && rental.licensePlate == choseCar.value;
    }

    // 如果有選擇日期，亦進行日期篩選
    if (choseDate.value) {
      //只比對日期部分
      const startDate = new Date(rental.startDate).toLocaleDateString();
      const chosenDate = new Date(choseDate.value).toLocaleDateString();
      isMatch = isMatch && startDate == chosenDate;
    }
    //如果有搜尋行政區
    if (search.value) {
      isMatch = isMatch && rental.district.includes(search.value);
    }

    return isMatch; // 滿足所有篩選條件的紀錄才保留
  });
  totalRecords.value = filteredRentals.value.length; //篩選過後總資料數

  // 根據當前頁面和每頁顯示的資料數量來顯示資料
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  filteredRentals.value = filteredRentals.value.slice(start, end);
};

//格式化日期
const formatDate = (date) => {
  const convertDate = new Date(date);
  return `${convertDate.getFullYear()}-${(convertDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${convertDate.getDate().toString().padStart(2, "0")}`;
};
//回推月租方案
const getRentalPlan = (amount, rentalFee) => {
  if (amount == rentalFee) {
    return 1;
  } else if (amount == rentalFee * 3 * 0.9) {
    return 3;
  } else if (amount == rentalFee * 6 * 0.85) {
    return 6;
  } else if (amount == rentalFee * 12 * 0.8) {
    return 12;
  }
  return 0; // 沒有匹配到則返回0
};
//存放月租方案適用優惠
const Rentalplan = { 1: "", 3: "9折優惠", 6: "85折優惠", 12: "8折優惠" };

const getRentalStatus = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  if (end > today) {
    return "Active";
  } else {
    return "Expired";
  }
};

//當改變選擇頁數
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  applyFilters(); // 重新篩選資料
};

const toHome = () => {
  router.push("/search");
};

//辨識視窗大小(依照視窗大小調整看到的表格欄位)
const checkScreenSize = () => {
  isPhoneSize.value = window.innerWidth < 450;
  isSmallScreen.value = window.innerWidth >= 450 && window.innerWidth < 768;
  isMiddleScreen.value = window.innerWidth >= 768 && window.innerWidth < 1200;
};
loadMonthlyRental();
onMounted(() => {
  getLicensePlate();
});
</script>

<template>
  <div id="outside" class="container" data-aos="fade-up">
    <div class="d-flex justify-content-between mb-3">
      <div>
        <button
          class="list me-2"
          @click="loadCurrent"
          :class="{ active: activePage == 'current' }"
        >
          <i class="fa-solid fa-paste"></i> 當前合約
        </button>
        <button
          class="list"
          @click="loadHistory"
          :class="{ active: activePage == 'history' }"
        >
          <i class="fa-solid fa-clock-rotate-left"></i> 歷史合約
        </button>
      </div>
      <div>
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
    <div
      v-if="activePage == 'history'"
      class="d-flex flex-column flex-md-row justify-content-between mb-2"
    >
      <div class="mb-2 col-12 col-md-5">
        <span>起始日期 </span>
        <el-date-picker
          @change="applyFilters"
          v-model="choseDate"
          type="date"
          placeholder="Pick a day"
        />
      </div>

      <!-- 搜尋行政區 -->
      <div class="col-12 col-md-4">
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
    </div>

    <div
      v-if="activePage == 'current'"
      class="accordion mt-2"
      id="accordionPanelsStayOpenExample"
    >
      <!-- 無資料顯示 -->
      <div v-show="isLoaded && !currentRental.length" class="row">
        <div class="col-md-6">
          <div class="d-flex mb-2">
            <img
              src="/src/assets/images/parkinglot2.webp"
              alt="無預訂資料"
              class="img-fluid"
              style="width: 400px; height: 250px; object-fit: cover"
            />
          </div>
        </div>
        <div class="col-md-6 d-flex flex-column justify-content-center">
          <h2>尚無月租車位合約</h2>
          <p>立即租用月租車位，確保長期停車無憂！</p>
          <button
            class="btn btn-light"
            style="text-align: left"
            @click="toHome"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
            馬上開始
          </button>
        </div>
      </div>
      <!-- 至少要顯示一個 -->
      <div v-if="currentRental.length" class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseOne"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
            #{{ currentRental[0].renId }}
            {{ currentRental[0].lotName }}
            <span style="font-size: 14px">
              &nbsp (合約將於
              {{ formatDate(currentRental[0].endDate) }} 終止)</span
            >
          </button>
        </h2>

        <div
          id="panelsStayOpen-collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-headingOne"
        >
          <div class="accordion-body">
            <div class="row">
              <div class="col-md-6 mb-2">
                <img
                  class="rounded img-fluid"
                  :src="`https://maps.googleapis.com/maps/api/staticmap?center=${currentRental[0].latitude},${currentRental[0].longitude}&zoom=18&size=600x300&markers=color:red%7Clabel:P%7C${currentRental[0].latitude},${currentRental[0].longitude}&key=AIzaSyALBHIW2HQWkmhCK-VXqGIoTVttRvMTtXo`"
                  alt="Map of {{ currentRental[0].lotName }}"
                  style="width: 100%; height: 100%"
                />
              </div>
              <div class="col-md-6">
                <div>
                  <p class="fw-bold mb-1" style="font-size: 20px">月租方案</p>
                  <div
                    class="fw-bold"
                    style="
                      font-size: 20px;
                      background-color: aliceblue;
                      padding: 5px;
                    "
                  >
                    {{
                      getRentalPlan(
                        currentRental[0].amount,
                        currentRental[0].monRentalRate
                      )
                    }}個月方案
                    <span
                      style="font-size: 16px"
                      v-if="
                        getRentalPlan(
                          currentRental[0].amount,
                          currentRental[0].monRentalRate
                        ) !== 1
                      "
                      >({{
                        Rentalplan[
                          getRentalPlan(
                            currentRental[0].amount,
                            currentRental[0].monRentalRate
                          )
                        ]
                      }})</span
                    >
                    <p>
                      合約總額 {{ currentRental[0].amount }} (NT$
                      {{
                        currentRental[0].amount /
                        getRentalPlan(
                          currentRental[0].amount,
                          currentRental[0].monRentalRate
                        )
                      }}/月)
                    </p>
                  </div>
                </div>
                <hr />
                <p>
                  <strong>合約期間</strong>
                  {{ formatDate(currentRental[0].startDate) }} 至
                  {{ formatDate(currentRental[0].endDate) }}
                </p>

                <p>
                  <strong>車牌號碼</strong>
                  {{ currentRental[0].licensePlate }}
                </p>
                <p>
                  <strong>停車場地址</strong>
                  {{ currentRental[0].district }}
                  {{ currentRental[0].location }}
                </p>
                <!-- 價格方案 -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="currentRental.length > 1"
        v-for="(current, index) in currentRental"
        class="accordion-item"
      >
        <h2
          v-if="index !== 0"
          class="accordion-header"
          :id="'panelsStayOpen-headingindex' + index"
        >
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#panelsStayOpen-collapse' + index"
            aria-expanded="false"
            :aria-controls="'panelsStayOpen-collapse' + index"
          >
            #{{ current.renId }}
            {{ current.lotName }}
            <span style="font-size: 14px">
              &nbsp (合約將於
              {{ formatDate(current.endDate) }} 終止)</span
            >
          </button>
        </h2>
        <div
          v-if="index !== 0"
          :id="'panelsStayOpen-collapse' + index"
          class="accordion-collapse collapse"
          :aria-labelledby="'panelsStayOpen-heading' + index"
        >
          <div class="accordion-body">
            <div class="row">
              <div class="col-md-6 mb-2">
                <img
                  class="rounded img-fluid"
                  :src="`https://maps.googleapis.com/maps/api/staticmap?center=${current.latitude},${current.longitude}&zoom=18&size=600x300&markers=color:red%7Clabel:P%7C${current.latitude},${current.longitude}&key=AIzaSyALBHIW2HQWkmhCK-VXqGIoTVttRvMTtXo`"
                  alt="Map of {{ current.lotName }}"
                  style="width: 100%; height: 100%"
                />
              </div>
              <div class="col-md-6">
                <div>
                  <p class="fw-bold mb-1" style="font-size: 20px">月租方案</p>
                  <div
                    class="fw-bold"
                    style="
                      font-size: 20px;
                      background-color: aliceblue;
                      padding: 5px;
                    "
                  >
                    {{
                      getRentalPlan(current.amount, current.monRentalRate)
                    }}個月方案
                    <span
                      style="font-size: 16px"
                      v-if="
                        getRentalPlan(current.amount, current.monRentalRate) !==
                        1
                      "
                      >({{
                        Rentalplan[
                          getRentalPlan(current.amount, current.monRentalRate)
                        ]
                      }})</span
                    >
                    <p>
                      合約總額 {{ current.amount }} (NT$
                      {{
                        current.amount /
                        getRentalPlan(current.amount, current.monRentalRate)
                      }}/月)
                    </p>
                  </div>
                </div>
                <hr />
                <p>
                  <strong>合約期間</strong>
                  {{ formatDate(current.startDate) }} 至
                  {{ formatDate(current.endDate) }}
                </p>

                <p>
                  <strong>車牌號碼</strong>
                  {{ current.licensePlate }}
                </p>
                <p>
                  <strong>停車場地址</strong>
                  {{ current.district }}
                  {{ current.location }}
                </p>
                <!-- 價格方案 -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格區 選擇歷史合約才會載入-->
    <!-- 屬性說明:show-overflow-tooltip-欄位超出寬度會顯示提示 -->
    <el-table
      class="mt-2"
      v-else-if="activePage == 'history'"
      :data="filteredRentals"
      style="width: 100%"
      height="400"
    >
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
        label="合約期間"
        :min-width="200"
        :sortable="true"
        ><template #default="scope">
          <div>
            {{ formatDate(scope.row.startDate) }} 至
            {{ formatDate(scope.row.endDate) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="方案名稱" :min-width="120" :sortable="true">
        <template #default="scope">
          <div>
            {{ getRentalPlan(scope.row.amount, scope.row.monRentalRate) }}
            個月方案
          </div>
        </template>
      </el-table-column>
      <el-table-column label="月租費" :min-width="100" :sortable="true"
        ><template #default="scope">
          <div>
            {{
              scope.row.amount /
              getRentalPlan(scope.row.amount, scope.row.monRentalRate)
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="總額"
        :min-width="80"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        label="狀態"
        :min-width="80"
        :sortable="true"
        align="center"
      >
        <template #default="scope">
          <div
            :class="
              getRentalStatus(scope.row.endDate) == 'Active'
                ? 'ongoing'
                : 'expired'
            "
          >
            {{ getRentalStatus(scope.row.endDate) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="" :min-width="60">
        <template #default="scope">
          <div @click="" class="seeDetail">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 加入分頁 -->
  <div v-if="activePage == 'history'" class="d-flex justify-content-end mt-4">
    <el-pagination
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalRecords"
      layout="prev, pager, next, jumper,total"
    />
  </div>
</template>

<style lang="css" scoped>
#outside {
  box-shadow: -5px 0px 10px lightgrey;
  padding: 15px;
}

/* 當前合約&歷史合約按鈕 */
.list {
  background-color: #f8f9fa;
  color: gray;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 5px 10px;
}

/* 點擊按鈕時的狀態 */
.active {
  background-color: #f5c34e;
  color: rgb(255, 255, 255);
  border: none;
  box-shadow: 3px 3px 10px lightgray;
}

/* 暫時未用 */
#noDataImg {
  width: 80%;
  height: 250px;
}

.accordion-button {
  background: linear-gradient(to left, #dfe9f3 0%, white 100%);
  background-color: transparent;
}

strong {
  /* background-color: rgb(247, 238, 238); */
  border: 1px solid lightgray;
  border-radius: 10px;
  padding: 5px;
}

.ongoing {
  background-color: #b5cfa0;
  color: white;
  border-radius: 10px;
}

.expired {
  border: 1px solid lightgray;
  border-radius: 10px;
  background-color: aliceblue;
}
</style>
