<script setup>
import { ref, onMounted } from "vue";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
// 初始化資料
const amount = ref(0);
const lotName = ref("");
const paymentStatus = ref("等待確認...");
const isDisabled = ref(true);
const buttonClass = ref("btn-secondary");
const startTime = ref("");

// API 路徑
const baseApiUrl = `${import.meta.env.VITE_API_BASEURL}/LinePay`;

// 取得 sessionStorage 中的付款資料
onMounted(() => {
  const storedInfo = JSON.parse(sessionStorage.getItem("paymentInfo"));
  startTime.value = dayjs
    .utc(sessionStorage.getItem("startTime"))
    .format("YYYY-MM-DD HH:mm");
  if (storedInfo) {
    amount.value = storedInfo.amount;
    lotName.value = storedInfo.lot;
  } else {
    alert("無法讀取方案資料，請重新選擇方案。");
    window.location.href = "/";
  }

  setTimeout(() => {
    isDisabled.value = false;
    buttonClass.value = "btn-warning";
  }, 5000);
});

// 確認付款
async function confirmPayment() {
  try {
    isDisabled.value = true;
    paymentStatus.value = "確認中...";

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    const transactionId = params.get("transactionId");
    const payment = { amount: amount.value, currency: "TWD" };

    const confirmUrl = `${baseApiUrl}/Confirm?transactionId=${transactionId}&orderId=${orderId}`;

    const check = await axios.post(confirmUrl, payment, {
      headers: { "Content-Type": "application/json" },
    });

    if (check.data.returnCode === "0000") {
      alert("付款確認成功");
      paymentStatus.value = "交易狀態: 成功";
      // 更新付款狀態
      const response = await axios.post(
        `${baseApiUrl}/UpdateResPayment`,
        { orderId },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("確認成功:", check.data.returnCode);
    } else if (check.data.returnCode === "1172") {
      alert("重複付款");
      paymentStatus.value = "交易狀態: 已有重複訂單";
      console.log("確認成功:", check.data.returnCode);
    } else {
      paymentStatus.value = `交易狀態: ${check.data.message}`;
    }

    setTimeout(() => (window.location.href = "/"), 300);
  } catch (error) {
    console.error("交易確認失敗:", error);
    paymentStatus.value = "交易狀態: 失敗，請稍後再試";
    setTimeout(() => (window.location.href = "/"), 1000);
  } finally {
    isDisabled.value = false;
  }
}
</script>

<template>
  <BreadcrumbsComponent>
    <template #title>
      <h2>訂金付款</h2>
    </template>
    <template #page>訂金付款</template>
  </BreadcrumbsComponent>
  <div class="payment-form-container">
    <h1 class="text-center mb-4">訂金支付確認頁面</h1>
    <form class="payment-form shadow-lg p-5 rounded">
      <div class="form-group mb-4">
        <h2>{{ lotName }}</h2>
      </div>
      <div class="form-group mb-4">
        <label for="amount" class="form-label">預約訂金</label>
        <input
          type="text"
          id="amount"
          class="form-control form-control-lg"
          :value="`${amount} TWD`"
          readonly
        />
      </div>
      <div class="form-group mb-4">
        <label for="paymentStatus" class="form-label">交易狀態</label>
        <input
          type="text"
          id="paymentStatus"
          class="form-control form-control-lg"
          :value="paymentStatus"
          readonly
        />
      </div>
      <div class="form-group mb-4">
        <label for="paymentStatus" class="form-label">入場時間</label>
        <input
          type="text"
          id="paymentStatus"
          class="form-control form-control-lg"
          readonly
          :value="startTime"
        />
      </div>
      <div class="text-center">
        <button
          class="btn btn-lg mt-3"
          :class="[buttonClass]"
          @click.prevent="confirmPayment"
          :disabled="isDisabled"
        >
          確認支付
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.payment-form-container {
  max-width: 600px;
  margin: 100px auto;
  /* 讓表單垂直置中 */
}

.payment-form {
  background-color: #fff;
  border-radius: 16px;
}

.form-control-lg {
  font-size: 1.25rem;
  padding: 15px;
}

button {
  font-size: 20px;
  padding: 15px;
  font-weight: bold;
}

#paymentStatus {
  margin-top: 15px;
  font-weight: bold;
  font-size: 18px;
}

@media (min-width: 768px) {
  .payment-form-container {
    max-width: 700px;
  }
}
</style>
