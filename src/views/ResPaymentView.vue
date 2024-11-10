<script setup>
import { reactive, ref, computed, onMounted, nextTick } from "vue";
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

//------------------------------------------------
// 儲存金額與方案資訊於 sessionStorage
function saveResPaymentInfo(amount, lotName, carId, startTime) {
  const RespaymentInfo = {
    amount: amount,
    lot: lotName,
    car: carId,
    startTime: startTime,
  };

  // 儲存金額與方案資訊於 sessionStorage
  sessionStorage.setItem("paymentInfo", JSON.stringify(RespaymentInfo));
}
//------------------------------------------------


// 建立交易請求
async function requestPayment() {
  saveResPaymentInfo(MyAmount.value, lotInfo.lotName, MycarId.value, startTime.value);
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

//----------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------

const ecpayForm = ref(null); // 將表單引用存儲在 ecpayForm 中
const paymentParameters = ref({}); // 初始化空的支付參數物件
async function fetchPaymentData() {
  console.log("MylotId:", MylotId.value);
  saveResPaymentInfo(MyAmount.value, lotInfo.lotName, MycarId.value, startTime.value);
  try {
    const paymentData = {
      ItemName: "預約停車場",
      TotalAmount: MyAmount.value,
      planId: "預定",
      PlanName: "預定金",
      ClientBackURL: window.location.origin + "/ECPayConfirmView",
      carId: MycarId.value,
      lotId: MylotId.value,
      startTime: startTime.value,
    };
    console.log("paymentData:", paymentData); // 檢查 paymentData 結構

    const response = await axios.post(
      "https://localhost:7077/api/ECPay/ResECPayForm",
      paymentData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("回傳的 response:", response); // 顯示完整的回應內容
    console.log("回傳的 response.data:", response.data); // 顯示回應的資料

    paymentParameters.value = response.data;

    await nextTick(); // 確保 DOM 更新完成後操作
    submitForm();
  } catch (error) {
    console.error("獲取支付參數失敗:", error);
    alert("交易失敗，請稍後再試。");
  }
}


function submitForm() {
  if (ecpayForm.value) {
    ecpayForm.value.submit(); // 使用 ref 引用直接提交表單
  } else {
    console.error("未找到表單");
  }
}

//-----------------------------------------------------------------------------------------------

// 金流選擇資料
const PayData = {
  linePay: { label: "LinePay" },
  ecPay: { label: "綠界金流" },
};

// 設定選中的金流方式
const selectedPayKey = ref("linePay"); // 預設為 LinePay
const selectedPay = ref(PayData[selectedPayKey.value]);

// 選擇金流方法
const selectPayment = (payKey) => {
  if (PayData[payKey]) {
    selectedPay.value = PayData[payKey];
    selectedPayKey.value = payKey;
    console.log("已選擇金流方式:", selectedPay.value);
  } else {
    console.error("無效的金流 Key:", payKey);
  }
};
//-----------------------------------------------------------------------------------------------
const handlePayment = () => {
  if (selectedPayKey.value === "linePay") {
    requestPayment();
  } else if (selectedPayKey.value === "ecPay") {
    fetchPaymentData();
  } else {
    console.error("請選擇一個支付方式");
  }
};
</script>

<template>
  <main id="main">
    <BreadcrumbsComponent backgroundImage="/03.jpg" :breadcrumbs="[
      { name: 'Home', link: '/' },
      { name: 'GoParkingMap', link: '/search' },
    ]">
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
                <img :src="mapUrl" alt="Map of {{ lotInfo.lotName }}" class="rounded img-fluid"
                  style="width: 100%; height: 100%" />
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
              <div class="text-center">
                <h2 class="mt-5">選擇支付方式</h2>
                <ul class="nav justify-content-evenly mb-4 mt-5">
                  <li class="nav-item" style="width: 40%" v-for="(payment, key) in PayData" :key="key">
                    <div class="plan-option" :class="{ active: selectedPayKey === key }" @click="selectPayment(key)">
                      {{ payment.label }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 綠界表單開始 -->
      <div class="text-center mt-4">
        <form ref="ecpayForm" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post"
          v-show="false">
          <div>
            <label>MerchantID:</label>
            <input type="text" name="MerchantID" :value="paymentParameters.MerchantID" readonly />
          </div>
          <div>
            <label>MerchantTradeNo:</label>
            <input type="text" name="MerchantTradeNo" :value="paymentParameters.MerchantTradeNo" readonly />
          </div>
          <div>
            <label>MerchantTradeDate:</label>
            <input type="text" name="MerchantTradeDate" :value="paymentParameters.MerchantTradeDate" readonly />
          </div>
          <div>
            <label>TotalAmount:</label>
            <input type="text" name="TotalAmount" :value="paymentParameters.TotalAmount" readonly />
          </div>
          <div>
            <label>TradeDesc:</label>
            <input type="text" name="TradeDesc" :value="paymentParameters.TradeDesc" readonly />
          </div>
          <div>
            <label>ItemName:</label>
            <input type="text" name="ItemName" :value="paymentParameters.ItemName" readonly />
          </div>
          <div>
            <label>ReturnURL:</label>
            <input type="text" name="ReturnURL" :value="paymentParameters.ReturnURL" readonly />
          </div>
          <div>
            <label>ClientBackURL:</label>
            <input type="text" name="ClientBackURL" :value="paymentParameters.ClientBackURL" readonly />
          </div>
          <div>
            <label>ChoosePayment:</label>
            <input type="text" name="ChoosePayment" :value="paymentParameters.ChoosePayment" readonly />
          </div>
          <div>
            <label>CheckMacValue:</label>
            <input type="text" name="CheckMacValue" :value="paymentParameters.CheckMacValue" readonly />
          </div>
          <div>
            <label>PaymentType:</label>
            <input type="text" name="PaymentType" :value="paymentParameters.PaymentType" readonly />
          </div>
        </form>
      </div>

      <!-- 綠界表單結束 -->

      <div class="text-center mt-4">
        <button class="btn btn-warning btn-lg mt-3" @click="handlePayment">
          立即付款
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.plan-option {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  position: relative;
}

.plan-option::before {
  content: "○";
  font-size: 20px;
  color: #ddd;
  margin-right: 10px;
  transition: color 0.3s;
}

.plan-option.active::before {
  content: "✔" !important;
  color: #007bff !important;
}

.plan-option.active {
  border-color: #007bff !important;
  background: #e7f1ff !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.tab-content h1 {
  font-size: 3rem;
}

.feature-item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}

.feature-item::before {
  content: "✔";
  color: #28a745;
  margin-right: 8px;
  font-size: 18px;
}
</style>
