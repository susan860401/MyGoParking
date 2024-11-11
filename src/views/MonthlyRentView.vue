<script setup>
import { ref, computed, onMounted, reactive, nextTick } from "vue";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import axios from "axios";

const MycarId = ref(0);
const MylotId = ref(0);
const MyAmount = ref(0);
const startTime = ref("");
// 宣告方案資料，使用 reactive 包裹
const planData = reactive({
  oneMonth: {
    id: "oneMonth",
    label: "1個月方案",
    price: 0,
    averagePerMonth: 0,
    description: "適合短期停車需求，彈性靈活，無需長期綁約。",
    features: ["無綁約，可隨時取消", "方便的自動續約功能", "支援多種付款方式"],
  },
  threeMonths: {
    id: "threeMonths",
    label: "3個月方案",
    price: 0,
    averagePerMonth: 0,
    description: "享有優惠價格，適合中期停車需求。",
    features: ["比單月更划算", "推薦方案，特別優惠", "可提前續約，保障車位"],
  },
  sixMonths: {
    id: "sixMonths",
    label: "6個月方案",
    price: 0,
    averagePerMonth: 0,
    description: "適合長期停車需求，節省更多費用。",
    features: ["半年合約，享有長期優惠", "固定車位保障", "免費升級停車服務"],
  },
  twelveMonths: {
    id: "twelveMonths",
    label: "12個月方案",
    price: 0,
    averagePerMonth: 0,
    description: "最划算的年度合約方案，省下更多。",
    features: ["年度最低價格", "專屬客戶服務", "參加會員活動資格"],
  },
});

// 折扣對應表
const discountMap = {
  1: 1,
  3: 0.9,
  6: 0.85,
  12: 0.8,
};

// 計算價格的函數
function calculatePrice(months, baseAmount) {
  const discount = discountMap[months] || 1;
  const total = baseAmount * months * discount;
  const averagePerMonth = total / months; // 計算每月平均費用
  console.log(
    `計算: ${baseAmount} * ${months} * ${discount} = ${total}, 每月平均: ${averagePerMonth}`
  );
  return { total, averagePerMonth };
}

// 在 onMounted 中初始化資料
onMounted(() => {
  MycarId.value = Number(sessionStorage.getItem("carId")) || 0;
  console.log("c=" + MycarId.value);

  MylotId.value = Number(sessionStorage.getItem("lotId")) || 0;
  console.log("l=" + MylotId.value);

  MyAmount.value = Number(sessionStorage.getItem("amount")) || 0;
  console.log("A=" + MyAmount.value);

  startTime.value = sessionStorage.getItem("startTime");

  // 確保 MyAmount.value 取得的是數字
  if (MyAmount.value === 0) {
    console.error("amount 無法正確取得，請檢查 sessionStorage 的內容。");
    return;
  }

  // 動態計算每個方案的價格和平均每月費用
  const oneMonth = calculatePrice(1, MyAmount.value);
  planData.oneMonth.price = oneMonth.total;
  planData.oneMonth.averagePerMonth = oneMonth.averagePerMonth;

  const threeMonths = calculatePrice(3, MyAmount.value);
  planData.threeMonths.price = threeMonths.total;
  planData.threeMonths.averagePerMonth = threeMonths.averagePerMonth;

  const sixMonths = calculatePrice(6, MyAmount.value);
  planData.sixMonths.price = sixMonths.total;
  planData.sixMonths.averagePerMonth = sixMonths.averagePerMonth;

  const twelveMonths = calculatePrice(12, MyAmount.value);
  planData.twelveMonths.price = twelveMonths.total;
  planData.twelveMonths.averagePerMonth = twelveMonths.averagePerMonth;

  console.log("方案資料:", planData);

  if (MycarId.value > 0 || MylotId.value > 0) {
    alert("車子與停車場已讀取成功");
  } else {
    alert("無法讀取方案資料，請重新選擇方案。");
  }
});
//-------------------------------------------------------

// 設定選中的方案
const selectedPlanKey = ref("twelveMonths");
const selectedPlan = ref(planData[selectedPlanKey.value]);

const savingsMessage = computed(() =>
  selectedPlan.value.savings ? `此方案 ${selectedPlan.value.savings}` : ""
);

const selectPlan = (planKey) => {
  if (planData[planKey]) {
    selectedPlan.value = planData[planKey];
    selectedPlanKey.value = planKey;
    console.log("已選擇方案:", selectedPlan.value);
  } else {
    console.error("無效的方案 Key:", planKey);
  }
};

// API 基本路徑
const baseUrl = `${import.meta.env.VITE_API_BASEURL}/LinePay/`;

//驗證方案與金錢
async function validatePlan() {
  const payload = {
    lotId: MylotId.value,
    planId: selectedPlan.value.id,
    amount: parseInt(selectedPlan.value.price, 10),
  };

  try {
    const response = await axios.post(`${baseUrl}Validate`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("驗證結果:", response.data);
    alert("方案驗證成功。");
    return response.data.isValid;
  } catch (error) {
    console.error(
      "方案驗證失敗:",
      error.response?.data?.message || error.message
    );
    alert("方案驗證失敗，請確認後再試。");
    return false;
  }
}

//-------------------------------------------------------------------------------------------------

// 將金額與方案資訊儲存到 sessionStorage 的函數
function storePaymentInfo(plan, carId, lotId) {
  const amount = parseInt(plan.price, 10); // 取得選擇方案的金額
  const paymentInfo = {
    amount: amount, // 金額
    planLabel: plan.label, // 方案名稱
    car: carId,
    lot: lotId,
  };

  // 儲存金額與方案資訊於 sessionStorage
  sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
}

//-------------------------------------------------------------------------------------------------

// 建立交易請求---------------------------------------------------------------------------------------------------

async function requestPayment() {
  const isValid = await validatePlan();
  if (!isValid) return; // 若驗證失敗，中止支付流程

  // 儲存選擇方案的金額與方案資訊
  storePaymentInfo(selectedPlan.value, MycarId.value, MylotId.value);

  const payment = {
    amount: parseInt(selectedPlan.value.price, 10), // 總金額
    currency: "TWD", // 貨幣類型
    orderId: Date.now().toString(), // 訂單 ID
    planId: selectedPlan.value.id, // 方案 ID
    carId: MycarId.value,
    lotId: MylotId.value,
    startTime: startTime.value,
    packages: [
      {
        id: `pkg_${Date.now()}_${Math.floor(Math.random() * 10000)}`, // 包裹 ID
        amount: parseInt(selectedPlan.value.price, 10), // 包裹金額
        name: selectedPlan.value.label, // 包裹名稱
        products: [
          {
            name: selectedPlan.value.label, // 產品名稱
            quantity: 1, // 數量
            price: parseInt(selectedPlan.value.price, 10), // 單價
          },
        ],
        userFee: 0, // 可選：使用者費用
      },
    ],
    redirectUrls: {
      confirmUrl: `${window.location.origin}/MonthlyConfirm`, // 確認頁面
      cancelUrl: `${baseUrl}Cancel`, // 取消頁面
    },
    options: null, // 可選：額外選項
  };
  // 使用 console.log 檢查 payment 的內容
  console.log("準備發送的 payment 物件:", JSON.stringify(payment, null, 2));
  alert("前往支付頁面:");
  try {
    const response = await axios.post(`${baseUrl}Create`, payment, {
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

//-----------------------------------------------------------------------------------------------

const ecpayForm = ref(null); // 將表單引用存儲在 ecpayForm 中
const paymentParameters = ref({}); // 初始化空的支付參數物件

async function fetchPaymentData() {
  const isValid = await validatePlan();
  if (!isValid) return; // 若驗證失敗，中止支付流程
  console.log("MylotId:", MylotId.value);

  // 儲存選擇方案的金額與方案資訊
  storePaymentInfo(selectedPlan.value, MycarId.value, MylotId.value);

  try {
    const paymentData = {
      ItemName: "月租停車場",
      TotalAmount: parseInt(selectedPlan.value.price, 10), // 模擬數據
      PlanName: selectedPlan.value.label,
      ClientBackURL: window.location.origin + "/ECPayConfirmView", // 動態設置回調 URL
      planId: selectedPlan.value.id, // 方案 ID
      carId: MycarId.value,
      lotId: MylotId.value,
      startTime: startTime.value,
    };
    console.log("paymentData:", paymentData); // 檢查 paymentData 結構
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASEURL}/ECPay/ECPayForm`,
      paymentData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    paymentParameters.value = response.data; // 將返回的數據分配給 paymentParameters

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
        月租服務
      </template>
    </BreadcrumbsComponent>

    <div class="container py-5">
      <h2 class="text-center mb-3">選擇您的月租停車方案</h2>
      <p class="text-center text-muted">彈性付款方案，滿足您的停車需求</p>

      <ul class="nav justify-content-evenly mb-4">
        <li
          class="nav-item"
          style="width: 23%"
          v-for="(plan, key) in planData"
          :key="key"
        >
          <div
            class="plan-option"
            :class="{ active: selectedPlanKey === key }"
            @click="selectPlan(key)"
          >
            {{ plan.label }}
          </div>
        </li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane show active">
          <div class="text-center p-5 bg-white rounded shadow">
            <h1>{{ selectedPlan.averagePerMonth }}/月</h1>
            <p>總付款{{ selectedPlan.price }}元</p>
            <p class="text-muted">{{ selectedPlan.description }}</p>
            <ul class="list-unstyled">
              <li
                v-for="feature in selectedPlan.features"
                :key="feature"
                class="feature-item"
              >
                {{ feature }}
              </li>
            </ul>
            <p v-if="savingsMessage" class="text-success mt-3">
              {{ savingsMessage }}
            </p>
            <h2 class="mt-5">選擇支付方式</h2>
            <ul class="nav justify-content-evenly mb-4 mt-5">
              <li
                class="nav-item"
                style="width: 40%"
                v-for="(payment, key) in PayData"
                :key="key"
              >
                <div
                  class="plan-option"
                  :class="{ active: selectedPayKey === key }"
                  @click="selectPayment(key)"
                >
                  {{ payment.label }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-warning btn-lg mt-3" @click="handlePayment">
          立即付款
        </button>
      </div>
      <!-- 綠界表單開始 -->
      <div class="text-center mt-4">
        <form
          ref="ecpayForm"
          action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"
          method="post"
          v-show="false"
        >
          <div>
            <label>MerchantID:</label>
            <input
              type="text"
              name="MerchantID"
              :value="paymentParameters.MerchantID"
              readonly
            />
          </div>
          <div>
            <label>MerchantTradeNo:</label>
            <input
              type="text"
              name="MerchantTradeNo"
              :value="paymentParameters.MerchantTradeNo"
              readonly
            />
          </div>
          <div>
            <label>MerchantTradeDate:</label>
            <input
              type="text"
              name="MerchantTradeDate"
              :value="paymentParameters.MerchantTradeDate"
              readonly
            />
          </div>
          <div>
            <label>TotalAmount:</label>
            <input
              type="text"
              name="TotalAmount"
              :value="paymentParameters.TotalAmount"
              readonly
            />
          </div>
          <div>
            <label>TradeDesc:</label>
            <input
              type="text"
              name="TradeDesc"
              :value="paymentParameters.TradeDesc"
              readonly
            />
          </div>
          <div>
            <label>ItemName:</label>
            <input
              type="text"
              name="ItemName"
              :value="paymentParameters.ItemName"
              readonly
            />
          </div>
          <div>
            <label>ReturnURL:</label>
            <input
              type="text"
              name="ReturnURL"
              :value="paymentParameters.ReturnURL"
              readonly
            />
          </div>
          <div>
            <label>ClientBackURL:</label>
            <input
              type="text"
              name="ClientBackURL"
              :value="paymentParameters.ClientBackURL"
              readonly
            />
          </div>
          <div>
            <label>ChoosePayment:</label>
            <input
              type="text"
              name="ChoosePayment"
              :value="paymentParameters.ChoosePayment"
              readonly
            />
          </div>
          <div>
            <label>CheckMacValue:</label>
            <input
              type="text"
              name="CheckMacValue"
              :value="paymentParameters.CheckMacValue"
              readonly
            />
          </div>
          <div>
            <label>PaymentType:</label>
            <input
              type="text"
              name="PaymentType"
              :value="paymentParameters.PaymentType"
              readonly
            />
          </div>
        </form>
      </div>
      <!-- 綠界表單結束 -->
    </div>
  </main>
</template>

<style lang="css" scoped>
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
