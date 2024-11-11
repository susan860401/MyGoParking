<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore"; //要取Pinia
import Swal from "sweetalert2";

const API_URL = "https://goparkapi.azurewebsites.net/api";
const userStore = useUserStore();
const userId = userStore.userId;

const reservations = ref([]); //傳回的預訂資料放此
const search = ref(""); //搜尋關鍵字
const period = ref("all"); //選擇篩選區段
const router = useRouter();
const completedRes = ref([]); //已完成的訂單(用isFinish判斷，區分為上下區塊)
const ongoingRes = ref([]); //還在進行的訂單(用isFinish判斷，區分為上下區塊)
const isAllStatus = ref(true); //用來判斷如果是顯示全部的情況(才會顯示現正進行中區塊)
const currentStatus = ref("all"); //目前停留在哪個頁面
const countAll = ref(0); //上方顯示全部預訂數字
const countComplete = ref(0); //上方顯示已完成預訂數字
const countCancel = ref(0); //上方顯示已取消預訂數字
const countOverdue = ref(0); //上方顯示逾時預訂數字(違規)
const isNoData = ref();

const loadReservations = async () => {
  const response = await fetch(`${API_URL}/Reservations?userId=${userId}`);
  const datas = await response.json();
  reservations.value = datas;
  //已完成的訂單
  completedRes.value = reservations.value.filter((res) => res.isFinish);
  ongoingRes.value = reservations.value.filter((res) => !res.isFinish);
  countAll.value = reservations.value.length;
  countComplete.value = reservations.value.filter(
    (res) => res.isFinish && !res.isCanceled & !res.isOverdue
  ).length;
  countCancel.value = reservations.value.filter((res) => res.isCanceled).length;
  countOverdue.value = reservations.value.filter((res) => res.isOverdue).length;
  if (ongoingRes.value.length == 0) {
    isNoData.value = true; //判斷有無資料顯示佔位符
  }
};

//切換觀看不同狀態的預訂紀錄
const filterByStatus = async (filter) => {
  currentStatus.value = filter;
  if (filter == "all") {
    isAllStatus.value = true;
    loadReservations();
    return;
  } else {
    isAllStatus.value = false;
    const response = await fetch(
      `${API_URL}/Reservations/filter?userId=${userId}&filter=${filter}`
    );
    const datas = await response.json();
    reservations.value = datas;
    completedRes.value = reservations.value.filter((res) => res.isFinish);
  }
};

//待改成以區域篩選(可能改前端篩選就好?)
const filterByDistrict = async () => {
  if (search.value == "") {
    loadReservations(); //但其實要考慮可能有進階篩選問題
  } else {
    const response = await fetch(
      `${API_URL}/Reservations/search/?userId=${userId}&district=${search.value}`
    );
    const datas = await response.json();
    reservations.value = datas;
    completedRes.value = datas.filter((res) => res.isFinish);
    ongoingRes.value = datas.filter((res) => !res.isFinish);
  }
};

// 以預訂日期篩選預訂紀錄
const changePeriod = () => {
  const today = new Date();

  if (period.value === "all") {
    // 所有區間，這裡可以放置處理所有預訂的邏輯
    loadReservations(); //但要考慮進階篩選..
    return;
  } else {
    let filterDate;

    if (period.value === "month") {
      filterDate = new Date(today.setDate(today.getDate() - 30));
    } else if (period.value === "month_3") {
      filterDate = new Date(today.setMonth(today.getMonth() - 3));
    } else if (period.value === "year") {
      filterDate = new Date(today.setFullYear(today.getFullYear() - 1));
    }

    ongoingRes.value = ongoingRes.value.filter(
      (res) => new Date(res.resTime) >= filterDate
    );
    completedRes.value = completedRes.value.filter(
      (res) => new Date(res.resTime) >= filterDate
    );
  }
};

//格式化時間
const formatTime = (time) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}   ${hour}:${minute}`;
};

//點擊前往預訂 導航到其停車場的預定頁面
const toRes = (res) => {
  router.push({
    name: "resmon", // 目標路由的名稱
    query: {
      lotId: res.lotId, // 傳遞選中的停車場 ID
      // 傳遞選中的停車場名稱
    },
  });
};

const toHome = () => {
  router.push("/search");
};

//開啟地圖(導航)
const openMap = (latitude, longitude) => {
  const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
  window.location.href = url;
};

//取消預訂
const cancelRes = async (id) => {
  const confirmResult = await Swal.fire({
    title: "是否確認取消此筆預訂?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確定",
  });

  // 如果確認取消預訂
  if (confirmResult.isConfirmed) {
    try {
      const response = await fetch(`${API_URL}/Reservations/${id}`, {
        method: "PUT",
      });

      if (response.ok) {
        const result = await response.text(); // 獲取返回的字串
        await Swal.fire("成功", "預訂取消成功", "success");
        loadReservations(); // 重新載入預訂列表
      } else {
        const errorResult = await response.text();
        await Swal.fire("錯誤", errorResult, "error");
      }
    } catch (error) {
      console.error("API 呼叫錯誤:", error);
      await Swal.fire("錯誤", "API 呼叫失敗，請稍後再試。", "error");
    }
  }
};

onMounted(() => {
  loadReservations();
});
</script>

<template>
  <!-- ======= Features Section ======= -->

  <!-- 增加與固定 nav bar 相同高度的間距 -->
  <div id="outside" class="container" data-aos="fade-up">
    <ul id="nav" class="d-flex justify-content-around">
      <li
        @click="filterByStatus('all')"
        class="text-center"
        :class="{ active: currentStatus == 'all' }"
      >
        全部 <small>({{ countAll }})</small>
      </li>
      <li
        @click="filterByStatus('isCompleted')"
        class="text-center"
        :class="{ active: currentStatus == 'isCompleted' }"
      >
        已完成
        <small>({{ countComplete }})</small>
      </li>
      <li
        @click="filterByStatus('isCanceled')"
        class="text-center"
        :class="{ active: currentStatus == 'isCanceled' }"
      >
        已取消
        <small>({{ countCancel }})</small>
      </li>
      <li
        @click="filterByStatus('isOverDue')"
        class="text-center"
        :class="{ active: currentStatus == 'isOverDue' }"
      >
        逾時紀錄
        <small>({{ countOverdue }})</small>
      </li>
    </ul>

    <div class="row">
      <div class="row">
        <!-- 選擇預訂期間 -->
        <div class="col-md-3">
          <select
            v-model="period"
            @change="changePeriod"
            class="form-select form-select-sm mb-2"
            aria-label=".form-select-sm example"
          >
            <option value="all" selected>所有預訂</option>
            <option value="month">過去30天</option>
            <option value="month_3">過去3個月</option>
            <option value="year">過去1年</option>
          </select>
        </div>
        <!-- 搜尋特定停車場 -->
        <div class="col-md-3 ms-auto">
          <div class="input-group input-group-sm mb-3">
            <input
              v-model="search"
              @keyup="filterByDistrict"
              type="text"
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              placeholder="預訂停車場行政區(e.g., 三民區)"
            />
          </div>
        </div>
      </div>

      <div
        class="order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <!-- 現正進行中區塊:還未取消、還未overdue -->
        <i
          ><h3 class="title" v-if="isAllStatus && !isNoData">
            當前預訂 Active
          </h3></i
        >
        <!-- place holder -->
        <div class="container mb-3 noDataArea" v-if="isNoData && isAllStatus">
          <div class="row">
            <div class="col-md-6">
              <div class="d-flex mb-2">
                <img
                  src="/src/assets/images/parkinglot.png"
                  alt="無預訂資料"
                  class="img-fluid"
                  style="width: 400px; height: 250px; object-fit: cover"
                />
              </div>
            </div>
            <div class="col-md-6 d-flex flex-column justify-content-center">
              <h2>無進行中預訂</h2>
              <p>立即開始您的預訂，體驗我們的便捷服務！</p>
              <button
                class="btn btn-light"
                style="text-align: left"
                @click="toHome"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
                立即體驗
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="isAllStatus"
          v-for="ongoing in ongoingRes"
          :key="ongoing.resId"
          class="card mb-3"
        >
          <div class="row g-0">
            <!-- 地圖區塊 -->
            <div class="col-md-6 p-2 img-container">
              <img
                class="rounded img-fluid"
                :src="`https://maps.googleapis.com/maps/api/staticmap?center=${ongoing.latitude},${ongoing.longitude}&zoom=18&size=600x300&markers=color:red%7Clabel:P%7C${ongoing.latitude},${ongoing.longitude}&key=AIzaSyALBHIW2HQWkmhCK-VXqGIoTVttRvMTtXo`"
                alt="Map of {{ ongoing.lotName }}"
                style="width: 100%; height: 100%"
              />

              <!-- <img src="..." class="img-fluid rounded-start" alt="..." /> -->
            </div>
            <div class="col-md-6">
              <div class="card-body">
                <p style="text-align: right">
                  {{ ongoing.licensePlate }}
                </p>
                <p></p>
                <h5 class="card-title">
                  {{ ongoing.lotName }}
                </h5>
                <p style="line-height: 30px">
                  <strong>位置</strong> {{ ongoing.district }}
                  {{ ongoing.location }}
                </p>
                <p class="mb-1">預訂時間： {{ formatTime(ongoing.resTime) }}</p>
                <p>
                  預計入場時間：
                  {{ formatTime(ongoing.startTime) }}
                </p>
                <p v-if="ongoing.paymentStatus" class="text-success">
                  <i class="fa-regular fa-clock"></i>
                  最遲於 {{ formatTime(ongoing.validUntil) }} 入場
                </p>
                <p v-else-if="!ongoing.paymentStatus" class="text-danger">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  請盡速繳費
                </p>
                <div style="text-align: right">
                  <button
                    @click="openMap(ongoing.latitude, ongoing.longitude)"
                    class="btn btn-light"
                  >
                    <i class="fa-solid fa-location-crosshairs"></i> 開啟導航
                  </button>
                  <button
                    @click="cancelRes(ongoing.resId)"
                    type="button"
                    class="btn btn-light"
                  >
                    <i class="fa-regular fa-calendar"></i> 取消預訂
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 已完成區塊 -->

        <i><h3 class="title" v-if="isAllStatus">歷史預訂 Past</h3></i>
        <div
          v-for="complete in completedRes"
          :key="complete.resId"
          class="card mb-3"
        >
          <div class="row g-0">
            <!-- 地圖區塊 -->
            <div class="col-md-6 p-2 img-container">
              <img
                class="rounded img-fluid"
                :src="`https://maps.googleapis.com/maps/api/staticmap?center=${complete.latitude},${complete.longitude}&zoom=18&size=600x300&markers=color:red%7Clabel:P%7C${complete.latitude},${complete.longitude}&key=AIzaSyALBHIW2HQWkmhCK-VXqGIoTVttRvMTtXo`"
                alt="Map of {{ complete.lotName }}"
                style="width: 100%; height: 100%"
              />

              <!-- <img src="..." class="img-fluid rounded-start" alt="..." /> -->
            </div>
            <div class="col-md-6">
              <div class="card-body">
                <p style="text-align: right">
                  {{ complete.licensePlate }}
                </p>
                <h5 class="card-title">{{ complete.lotName }}</h5>
                <p style="line-height: 30px">
                  <strong>位置</strong> {{ complete.district }}
                  {{ complete.location }}
                </p>
                <p class="mb-1">預訂時間：{{ formatTime(complete.resTime) }}</p>
                <p>預計入場時間：{{ formatTime(complete.startTime) }}</p>
                <small
                  v-if="
                    complete.isFinish &&
                    complete.isOverdue == false &&
                    !complete.isCanceled
                  "
                  class="text-success"
                  ><i class="fa-regular fa-circle-check"></i> 已完成</small
                >
                <small v-else-if="complete.isCanceled" class="text-secondary"
                  ><i class="fa-solid fa-xmark"></i> 已取消</small
                >
                <small v-else-if="complete.isOverdue" class="text-danger"
                  ><i class="fa-solid fa-triangle-exclamation"></i>
                  逾時未進場</small
                >

                <div style="text-align: right">
                  <button
                    @click="toRes(complete)"
                    type="button"
                    class="btn btn-light"
                  >
                    <i class="fa-regular fa-calendar"></i> 重新預訂
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
#outside {
  box-shadow: -5px 0px 10px lightgrey;
}

#nav {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

#nav li {
  font-size: 18px;
  font-weight: bold;
  display: block !important; /* 強制 li 成為 block 元素 */
  text-align: center;
  cursor: pointer;
  padding: 10px 20px;
  width: 100%; /* 讓 li 佔滿父容器寬度 */
  border-bottom: 2px solid #ccc; /* 設定下方邊框 */
}

#nav li:hover {
  color: #507687;
  /* color: #fabc3f; */
}

#nav li.active {
  color: #507687 !important; /* 使用 !important 確保樣式生效 */
  border-bottom: 4px solid #fab12f !important; /* 確保底線顯示 */
}

strong {
  /* background-color: rgb(247, 238, 238); */
  border: 1px solid lightgray;
  border-radius: 10px;
  padding: 5px;
}

.title {
  padding: 5px 10px;
  color: white;
  font-weight: normal;
  background: linear-gradient(to left, #ffe259, #fab12f);
  opacity: 0.7;
  /* background: linear-gradient(to right, #dfe9f3 0%, white 100%); */
  background-color: transparent;
  font-size: 20px;
  border-radius: 50px 20px 20px 50px;
}
</style>
