<script setup>
import { ref, computed } from "vue";
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

const totalAmount = computed(() => {
  if (!plateAmount.value) return 0;
  const discount = selectedCoupon.value?.couponAmount || 0; // 使用 couponAmount 作為折扣金額
  const amount = plateAmount.value - discount;
  return amount > 0 ? amount : 0; // 如果小於或等於 0，則返回 0
});
const licensePlatePattern = /^[A-Z]{3}\d{4}$/;

const isFormValid = computed(() =>
  licensePlatePattern.test(licensePlate.value.trim())
);

const onLicensePlateInput = (event) => {
  const value = event.target.value.toUpperCase();
  licensePlate.value = value.replace(/[^A-Z0-9]/g, "");
};

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
    entryTime.value = response.data.entryTime; // 從 API 回傳時間並儲存
    MycarId.value = response.data.carId;
    MylotName.value = response.data.lotName;
    MylotId.value = response.data.lotId;

    step.value = 2;
    errorMessage.value = ""; // 清除錯誤訊息
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "系統錯誤，請稍後再試";
    }
  }
};

async function validatePlan() {
  // 安全取得資料
  const couponId = selectedCoupon.value ? selectedCoupon.value.couponId : null;
  const lotId = MylotId.value;
  const carId = MycarId.value;
  const amount = totalAmount.value;

  // 確認所有必要的欄位都有值
  if (!lotId || !carId) {
    alert("缺少必要的資訊，請檢查資料是否完整。");
    return false;
  }

  const payload = {
    lotId: lotId,
    carId: carId,
    amount: amount,
    couponsId: couponId,
  };

  console.log("發送的 payload:", payload); // 調試用，檢查 payload 是否正確

  try {
    const response = await axios.post(`${baseUrl}ValidateDay`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("驗證結果:", response.data);

    if (amount === 0) {
      alert("金額為 0，已記錄並提交成功。");
    } else {
      alert("方案驗證成功。");
    }

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
// 建立交易請求
async function requestPayment() {
  const isValid = await validatePlan();
  if (!isValid) return; // 若驗證失敗，中止支付流程

  const couponId = selectedCoupon.value ? selectedCoupon.value.couponId : null;
  const couponAmount = selectedCoupon.value
    ? selectedCoupon.value.couponAmount
    : null;
  const MyInfo = {
    amount: totalAmount.value, // 金額
    car: MycarId.value,
    lot: MylotId.value,
    couponsId: couponId,
    lotName: MylotName.value,
    componsAmount: couponAmount,
  };

  // 儲存金額與方案資訊於 sessionStorage
  sessionStorage.setItem("MyInfo", JSON.stringify(MyInfo));

  // 如果金額為 0，直接跳轉到 /ChargeConfirmView 頁面
  console.log("總金額:", totalAmount.value);
  if (totalAmount.value === 0) {
    window.location.href = "/ChargeConfirmView";
    return;
  }

  const payment = {
    amount: totalAmount.value, // 總金額
    currency: "TWD", // 貨幣類型
    orderId: Date.now().toString(), // 訂單 ID
    carId: MycarId.value,
    lotId: MylotId.value,
    packages: [
      {
        id: `pkg_${Date.now()}_${Math.floor(Math.random() * 10000)}`, // 包裹 ID
        amount: totalAmount.value, // 包裹金額
        name: `${MylotName.value}繳費`, // 包裹名稱
        products: [
          {
            name: `${MylotName.value}繳費`, // 產品名稱
            quantity: 1, // 數量
            price: totalAmount.value, // 單價
          },
        ],
      },
    ],
    redirectUrls: {
      confirmUrl: `${window.location.origin}/ChargeConfirmView`, // 確認頁面
      cancelUrl: `${baseUrl}Cancel`, // 取消頁面
    },
  };

  console.log("準備發送的 payment 物件:", JSON.stringify(payment, null, 2));
  alert("前往支付頁面:");
  try {
    const response = await axios.post(`${baseUrl}CreateRes`, payment, {
      headers: { "Content-Type": "application/json" },
    });

    const paymentUrl = response.data.info.paymentUrl.web;
    console.log("前往支付頁面:", paymentUrl);

    window.location.href = paymentUrl;
  } catch (error) {
    console.error("交易失敗:", error.response?.data?.message || error.message);
    alert("交易失敗，請稍後再試。");
  }
  重置狀態;
  licensePlate.value = "";
  selectedCoupon.value = null;
  Mycoupons.value = [];
  step.value = 1;
  errorMessage.value = "";
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
              <div
                class="card-header bg-gradient-primary text-white text-center py-4"
              >
                <h2 class="mb-0">
                  {{ step === 2 ? MylotName : "請輸入車牌查詢" }}
                </h2>
              </div>
              <div class="card-body p-5">
                <div
                  v-if="errorMessage"
                  class="alert alert-danger"
                  role="alert"
                >
                  {{ errorMessage }}
                </div>
                <div class="mb-4">
                  <label for="plate" class="form-label fs-5">車牌號碼：</label>
                  <input
                    type="text"
                    id="plate"
                    class="form-control form-control-lg"
                    v-model="licensePlate"
                    @input="onLicensePlateInput"
                    :readonly="step === 2"
                    placeholder="請輸入車牌號碼 (格式：ABC1234)"
                    required
                  />
                </div>

                <div class="mb-4" v-if="step === 2">
                  <label for="coupon" class="form-label fs-5"
                    >選擇優惠券：</label
                  >
                  <select
                    class="form-select form-select-lg"
                    id="coupon"
                    v-model="selectedCoupon"
                  >
                    <option :value="null">不使用優惠券</option>
                    <option
                      v-for="coupon in Mycoupons"
                      :key="coupon.couponId"
                      :value="coupon"
                    >
                      折價: {{ coupon.couponAmount }} 元，到期日:
                      {{ coupon.endTime }}
                    </option>
                  </select>
                  <label for="entry-time" class="form-label fs-5 mt-3"
                    >進場時間 :</label
                  >
                  <input
                    type="text"
                    id="entry-time"
                    class="form-control form-control-lg"
                    :value="entryTime"
                    readonly
                  />
                  <label for="duration" class="form-label fs-5 mt-3"
                    >停車時間 :</label
                  >
                  <input
                    type="text"
                    id="duration"
                    class="form-control form-control-lg"
                    :value="`${durationHours} 小時`"
                    readonly
                  />
                  <label for="amount" class="form-label fs-5 mt-3"
                    >原始金額 :</label
                  >
                  <input
                    type="text"
                    id="total"
                    class="form-control form-control-lg"
                    :value="`${plateAmount} 元`"
                    readonly
                  />
                  <label for="total" class="form-label fs-5 mt-3"
                    >總金額 :</label
                  >
                  <input
                    type="text"
                    id="total"
                    class="form-control form-control-lg"
                    :value="`${totalAmount} 元`"
                    readonly
                  />
                </div>

                <div class="d-grid gap-2">
                  <button
                    type="button"
                    class="btn btn-warning"
                    :disabled="!isFormValid"
                    @click="
                      step === 1
                        ? checkCouponsByLicensePlate()
                        : requestPayment()
                    "
                  >
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
