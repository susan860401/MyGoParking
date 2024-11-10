<script setup>
import { ref, computed, nextTick } from "vue";
import axios from "axios";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";

const baseUrl = `${import.meta.env.VITE_API_BASEURL}/LinePay/`;

const licensePlate = ref("");
const selectedCoupon = ref(null); // 優惠券的初始值設為 null
const Mycoupons = ref([]);
const step = ref(1);
const MycarId = ref(0); // 儲存車子的ID
const errorMessage = ref(""); // 儲存錯誤訊息
const durationHours = ref(0); // 儲存停車時數
const plateAmount = ref(0); // 儲存停車費用
const entryTime = ref(""); // 儲存從 API 回傳的進場時間
const MylotName = ref("");
const MylotId = ref(0);
const selectedPaymentMethod = ref("LinePay");
const ecpayForm = ref(null); // 用於 ECPay 表單引用
const paymentParameters = ref({}); // 用於儲存 ECPay 支付參數

// 計算總金額，應用優惠券折扣
const totalAmount = computed(() => {
  if (!plateAmount.value) return 0;
  const discount = selectedCoupon.value?.couponAmount || 0;
  const amount = plateAmount.value - discount;
  return amount > 0 ? amount : 0;
});

// 車牌格式驗證
const licensePlatePattern = /^[A-Z]{3}\d{4}$/;
const isFormValid = computed(() => licensePlatePattern.test(licensePlate.value.trim()));

// 車牌輸入時轉換為大寫
const onLicensePlateInput = (event) => {
  const value = event.target.value.toUpperCase();
  licensePlate.value = value.replace(/[^A-Z0-9]/g, "");
};

// 請求車牌號碼以查詢優惠券和停車資訊
const checkCouponsByLicensePlate = async () => {
  try {
    if (licensePlate.value.trim() === "") {
      alert("請輸入車牌號碼");
      return;
    }

    const response = await axios.post(`${baseUrl}FindMyParking`, {
      licensePlate: licensePlate.value,
    });

    Mycoupons.value = response.data.couponIds || [];
    durationHours.value = response.data.durationHours;
    plateAmount.value = response.data.plateAmount;
    entryTime.value = response.data.entryTime;
    MycarId.value = response.data.carId;
    MylotName.value = response.data.lotName;
    MylotId.value = response.data.lotId;

    step.value = 2; // 設置為步驟 2
    errorMessage.value = ""; // 清除錯誤訊息
  } catch (error) {
    errorMessage.value = error.response?.status === 404
      ? error.response.data.message
      : "系統錯誤，請稍後再試";
  }
};

// 驗證方案的有效性
async function validatePlan() {
  const couponId = selectedCoupon.value ? selectedCoupon.value.couponId : null;
  const lotId = MylotId.value;
  const carId = MycarId.value;
  const amount = totalAmount.value;

  if (!lotId || !carId) {
    alert("缺少必要的資訊，請檢查資料是否完整。");
    return false;
  }

  const payload = {
    lotId,
    carId,
    amount,
    couponsId: couponId,
  };

  try {
    const response = await axios.post(`${baseUrl}ValidateDay`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    alert(amount === 0 ? "金額為 0，已記錄並提交成功。" : "方案驗證成功。");
    return response.data.isValid;
  } catch (error) {
    alert("方案驗證失敗，請確認後再試。");
    return false;
  }
}

// 儲存 MyInfo 到 sessionStorage
function saveMyInfoToSession() {
  const couponId = selectedCoupon.value ? selectedCoupon.value.couponId : null;
  const couponAmount = selectedCoupon.value ? selectedCoupon.value.couponAmount : null;

  const MyInfo = {
    amount: totalAmount.value,
    car: MycarId.value,
    lot: MylotId.value,
    couponsId: couponId,
    lotName: MylotName.value,
    componsAmount: couponAmount,
    paymentMethod: selectedPaymentMethod.value,
  };

  sessionStorage.setItem("MyInfo", JSON.stringify(MyInfo));
  console.log("MyInfo 已儲存至 sessionStorage:", MyInfo);
}

// LinePay 支付流程
async function requestPayment() {
  const isValid = await validatePlan();
  if (!isValid) return;

  saveMyInfoToSession();

  if (totalAmount.value === 0) {
    window.location.href = "/ChargeConfirmView";
    return;
  }

  const payment = {
    amount: totalAmount.value,
    currency: "TWD",
    orderId: Date.now().toString(),
    carId: MycarId.value,
    lotId: MylotId.value,
    packages: [
      {
        id: `pkg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        amount: totalAmount.value,
        name: `${MylotName.value}繳費`,
        products: [
          {
            name: `${MylotName.value}繳費`,
            quantity: 1,
            price: totalAmount.value,
          },
        ],
      },
    ],
    redirectUrls: {
      confirmUrl: `${window.location.origin}/ChargeConfirmView`,
      cancelUrl: `${baseUrl}Cancel`,
    },
  };

  try {
    const response = await axios.post(`${baseUrl}CreateRes`, payment, {
      headers: { "Content-Type": "application/json" },
    });

    const paymentUrl = response.data.info.paymentUrl.web;
    window.location.href = paymentUrl;
  } catch (error) {
    alert("交易失敗，請稍後再試。");
  }
}

// ECPay 支付流程
async function fetchPaymentData() {
  const isValid = await validatePlan();
  if (!isValid) return;
  saveMyInfoToSession();

  if (totalAmount.value === 0) {
    window.location.href = "/ChargeConfirmView";
    return;
  }
  try {
    const paymentData = {
      ItemName: "停車繳費",
      TotalAmount: totalAmount.value,
      planId: "停車繳費",
      PlanName: "停車繳費",
      ClientBackURL: window.location.origin + "/ECPayCharge",
      carId: MycarId.value,
      lotId: MylotId.value,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASEURL}/ECPay/ChargeCreate`,
      paymentData,
      { headers: { "Content-Type": "application/json" } }
    );

    paymentParameters.value = response.data;

    await nextTick();
    submitForm();
  } catch (error) {
    console.error("ECPay 交易失敗:", error.response?.data || error.message);
    alert("ECPay交易失敗，請稍後再試。");
  }
}

// 提交 ECPay 表單
function submitForm() {
  if (ecpayForm.value) {
    ecpayForm.value.submit();
  }
}

// 根據付款方式執行相應流程
async function initiatePayment() {
  if (selectedPaymentMethod.value === "LinePay") {
    await requestPayment();
  } else if (selectedPaymentMethod.value === "ECPay") {
    await fetchPaymentData();
  } else {
    alert("請選擇有效的付款方式。");
  }
}
</script>

<template>
  <main id="main">
    <BreadcrumbsComponent>
      <template #title>
        <h2>繳費</h2>
      </template>
      <template #page>繳費</template>
    </BreadcrumbsComponent>

    <div class="form-wrapper">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="card shadow-lg">
              <div class="card-header bg-gradient-primary text-white text-center py-4">
                <h2 class="mb-0">{{ step === 2 ? MylotName : "請輸入車牌查詢" }}</h2>
              </div>
              <div class="card-body p-5">
                <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                <div class="mb-4">
                  <label for="plate" class="form-label fs-5">車牌號碼：</label>
                  <input type="text" id="plate" class="form-control form-control-lg" v-model="licensePlate"
                    @input="onLicensePlateInput" :readonly="step === 2" placeholder="請輸入車牌號碼 (格式：ABC1234)" required />
                </div>

                <div v-if="step === 2">
                  <label for="coupon" class="form-label fs-5">選擇優惠券：</label>
                  <select class="form-select form-select-lg" id="coupon" v-model="selectedCoupon">
                    <option :value="null">不使用優惠券</option>
                    <option v-for="coupon in Mycoupons" :key="coupon.couponId" :value="coupon">
                      折價: {{ coupon.couponAmount }} 元，到期日: {{ coupon.endTime }}
                    </option>
                  </select>

                  <label for="entry-time" class="form-label fs-5 mt-3">進場時間 :</label>
                  <input type="text" id="entry-time" class="form-control form-control-lg" :value="entryTime" readonly />

                  <label for="duration" class="form-label fs-5 mt-3">停車時間 :</label>
                  <input type="text" id="duration" class="form-control form-control-lg" :value="`${durationHours} 小時`"
                    readonly />

                  <label for="amount" class="form-label fs-5 mt-3">原始金額 :</label>
                  <input type="text" id="total" class="form-control form-control-lg" :value="`${plateAmount} 元`"
                    readonly />

                  <label for="total" class="form-label fs-5 mt-3">總金額 :</label>
                  <input type="text" id="total" class="form-control form-control-lg" :value="`${totalAmount} 元`"
                    readonly />

                  <label for="payment-method" class="form-label fs-5 mt-3">付款方式 :</label>
                  <select id="payment-method" class="form-select form-select-lg" v-model="selectedPaymentMethod">
                    <option value="LinePay">Line Pay</option>
                    <option value="ECPay">綠界金流</option>
                  </select>

                  <form ref="ecpayForm" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post"
                    v-show="false">
                    <input v-for="(value, key) in paymentParameters" :key="key" :name="key" :value="value"
                      type="hidden" />
                  </form>
                </div>

                <div class="d-grid gap-2 mt-5">
                  <button type="button" class="btn btn-warning" :disabled="!isFormValid"
                    @click="step === 1 ? checkCouponsByLicensePlate() : initiatePayment()">
                    {{ step === 1 ? "下一步" : "送出" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.form-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.bg-gradient-primary {
  background: linear-gradient(45deg, #6d6c1dbb, #fa9119);
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.form-control-lg,
.form-select-lg {
  border-radius: 12px;
  padding: 15px;
  font-size: 18px;
}
</style>
