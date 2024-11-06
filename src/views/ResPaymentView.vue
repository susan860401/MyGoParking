<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import axios from "axios";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
const baseUrl = `${import.meta.env.VITE_API_BASEURL}/LinePay/`;
const MylotId = ref(0);
const MycarId = ref(0);
const MyAmount = ref(0);
const startTime = ref("");
const lotInfo = reactive({
  lotName: "",
  lotType: "",
  lotLocation: "",
  lotValid: 0,
  lotWeek: 0,
  lotTel: "",
  lotLatitude: "",
  lotLongitude: "",
  errorMessage: "",
  lotResDeposit: 0,
});

// 動態計算地圖 URL
const mapUrl = computed(
  () =>
    `https://maps.googleapis.com/maps/api/staticmap?center=${lotInfo.lotLatitude},${lotInfo.lotLongitude}&zoom=18&size=600x300&markers=color:red%7Clabel:P%7C${lotInfo.lotLatitude},${lotInfo.lotLongitude}&key=AIzaSyALBHIW2HQWkmhCK-VXqGIoTVttRvMTtXo`
);

onMounted(async () => {
  try {
    MycarId.value = Number(sessionStorage.getItem("carId")) || 0;
    console.log("c=" + MycarId.value);

    MylotId.value = Number(sessionStorage.getItem("lotId")) || 0;
    console.log("l=" + MylotId.value);

    MyAmount.value = Number(sessionStorage.getItem("resDeposit")) || 0;
    console.log("D=" + MyAmount.value);

    startTime.value = sessionStorage.getItem("startTime");
    console.log("取得的 startTime:", startTime.value);

    if (MylotId.value === 0) {
      lotInfo.errorMessage = "LotId 無效";
      return;
    }
    const response = await axios.post(`${baseUrl}ListenLotId`, {
      LotId: MylotId.value,
    });
    Object.assign(lotInfo, response.data);
  } catch (error) {
    lotInfo.errorMessage = error.response?.data.message || "取得資料時發生錯誤";
  }
});

// 建立交易請求
async function requestPayment() {
  const RespaymentInfo = {
    amount: MyAmount.value,
    lot: lotInfo.lotName,
    car: MycarId.value,
    startTime: startTime.value,
  };

  // 儲存金額與方案資訊於 sessionStorage
  sessionStorage.setItem("paymentInfo", JSON.stringify(RespaymentInfo));

  const payment = {
    amount: MyAmount.value, // 總金額
    currency: "TWD", // 貨幣類型
    orderId: Date.now().toString(), // 訂單 ID
    carId: MycarId.value,
    lotId: MylotId.value,
    planId: "預約",
    startTime: startTime.value,
    packages: [
      {
        id: `pkg_${Date.now()}_${Math.floor(Math.random() * 10000)}`, // 包裹 ID
        amount: MyAmount.value, // 包裹金額
        amount: lotInfo.lotResDeposit, // 包裹金額
        name: lotInfo.lotName, // 停車名稱
        products: [
          {
            name: `${lotInfo.lotName}預約`, // 產品名稱
            quantity: 1, // 數量
            price: MyAmount.value, // 單價
          },
        ],
        userFee: 0, // 可選：使用者費用
      },
    ],
    redirectUrls: {
      confirmUrl: `${window.location.origin}/ResConfirm`, // 確認頁面
      cancelUrl: `${baseUrl}Cancel`, // 取消頁面
    },
    options: null, // 可選：額外選項
  };
  // 使用 console.log 檢查 payment 的內容
  console.log("準備發送的 payment 物件:", JSON.stringify(payment, null, 2));

  try {
    const response = await axios.post(`${baseUrl}CreateDay`, payment, {
      headers: { "Content-Type": "application/json" },
    });

    const paymentUrl = response.data.info.paymentUrl.web;
    console.log("前往支付頁面:", paymentUrl);
    window.location.href = paymentUrl;
  } catch (error) {
    console.error("交易失敗:", error);
    alert("交易失敗，請稍後再試。");
  }
}
</script>

<template>
  <main id="main">
    <BreadcrumbsComponent
      backgroundImage="/03.jpg"
      :breadcrumbs="[
        { name: 'Home', link: '/' },
        { name: 'GoParkingMap', link: '/search' },
      ]"
    >
      <template #title>
        <!-- 插入到 title 插槽 -->
        <h2>Reservation & MonthlyRental</h2>
      </template>
      <template #page>
        <!-- 插入到 page 插槽 -->
        預約服務
      </template>
    </BreadcrumbsComponent>

    <div class="container py-5">
      <h2 class="text-center mb-3">請確認您的預約停車場</h2>
      <p class="text-center text-muted">為了您的權益，請閱讀使用規則</p>

      <div class="tab-content">
        <div class="tab-pane show active">
          <div class="text-left p-4 bg-white rounded shadow">
            <div class="row">
              <div class="col-md-5 p-3 img-container">
                <img
                  :src="mapUrl"
                  alt="Map of {{ lotInfo.lotName }}"
                  class="rounded img-fluid"
                  style="width: 100%; height: 100%"
                />
              </div>
              <div class="col-md-7 p-3 mt-2">
                <h1>{{ lotInfo.lotName }}</h1>
                <p><strong>停車地址：</strong>{{ lotInfo.lotLocation }}</p>
                <p><strong>停車費用：</strong>{{ lotInfo.lotWeek }} 元/小時</p>
                <p><strong>停車場類型：</strong>{{ lotInfo.lotType }}</p>
                <p><strong>剩餘車位：</strong>{{ lotInfo.lotValid }}</p>
                <p><strong>聯絡電話：</strong>{{ lotInfo.lotTel }}</p>
                <p><strong>預約訂金:</strong> {{ lotInfo.lotResDeposit }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-warning btn-lg" @click="requestPayment">
          立即付款
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
