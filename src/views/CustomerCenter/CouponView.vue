<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore"; //要取Pinia

const API_URL = "https://goparkapi.azurewebsites.net/api";
const userStore = useUserStore();
const userId = userStore.userId;
const coupons = ref([]); //傳回的優惠券放此
const couponFilter = ref("全部");

const loadCoupons = async () => {
  const response = await fetch(`${API_URL}/Coupons?userId=${userId}`);
  const datas = await response.json();
  coupons.value = datas;
};

const filterCoupon = async () => {
  if (couponFilter.value == "全部") {
    loadCoupons();
    return;
  }
  const response = await fetch(
    `${API_URL}/Coupons/filter?userId=${userId}&filter=${couponFilter.value}`
  );

  const datas = await response.json();
  coupons.value = datas;
};

//設定日期格式
const formatDate = (convertedDate) => {
  const date = new Date(convertedDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 確保月份是兩位數
  const day = String(date.getDate()).padStart(2, "0"); // 確保日期是兩位數
  return `${year}-${month}-${day}`;
};
//驗證優惠券是否到期
const isExpired = (validUntil) => {
  // 今日日期
  const today = new Date();
  const valid = new Date(validUntil);

  // 只比較日期部分 (忽略時間)
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const convertedDateOnly = new Date(
    valid.getFullYear(),
    valid.getMonth(),
    valid.getDate()
  );
  if (todayDateOnly > convertedDateOnly) {
    return true;
  }
  return false;
};

loadCoupons();
</script>

<template>
  <section class="p-0">
    <div class="container mt-0" data-aos="fade-up">
      <div class="col-md-3">
        <select
          v-model="couponFilter"
          @change="filterCoupon"
          class="form-select form-select-sm mb-2"
          aria-label=".form-select-sm example"
        >
          <option selected>全部</option>
          <option value="available">可使用</option>
          <option value="isUsed">已使用</option>
          <option value="expired">已失效</option>
        </select>
      </div>
      <div class="row">
        <!-- 這裡的 col-md-6 確保在 md 屏幕時佔 50%，col-12 確保在小屏幕時佔 100% -->
        <div
          v-for="coupon in coupons"
          :key="coupon.couponId"
          class="col-md-6 col-12 mb-2"
        >
          <!-- 優惠券本體 -->
          <div id="coupon" class="card d-flex flex-row mb-3">
            <!-- 照片保持在左邊，文字保持在右邊 -->
            <div class="col-md-5 col-4 p-1 img-container">
              <img
                src="/src/assets/images/coupon_2.webp"
                class="img-fluid rounded-start"
                alt="..."
                style="width: 100%; height: 100%; object-fit: cover"
              />
            </div>
            <div class="col-md-7 col-8">
              <div class="card-body">
                <p class="fw-bold mb-1" style="font-size: 14px">
                  新用戶專屬停車券
                </p>
                <div class="mt-0 mb-2">
                  <span
                    class="text-muted rounded-pill"
                    style="
                      border: 1px solid gray;
                      padding: 5px;
                      font-size: 10px;
                    "
                    >{{ formatDate(coupon.validFrom) }} ~
                    {{ formatDate(coupon.validUntil) }}</span
                  >
                </div>
                <p class="mb-1">${{ coupon.discountAmount }} 抵用券</p>

                <p class="card-text mb-1">
                  <small
                    v-if="!coupon.isUsed && !isExpired(coupon.validUntil)"
                    class="bg-warning"
                    style="color: white; padding: 2px"
                    >可使用</small
                  >
                  <small v-if="coupon.isUsed" class="txt-muted">已使用</small>
                  <small
                    v-if="!coupon.isUsed && isExpired(coupon.validUntil)"
                    class="txt-light"
                    >已失效</small
                  >
                </p>
                <p class="mb-0" style="text-align: end; font-size: 10px">
                  <span class="rounded-pill bg-light p-2"
                    ># {{ coupon.couponCode }}</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- End About Section -->
</template>

<style lang="css" scoped>
#coupon:hover {
  cursor: pointer;
  border: 3px solid lightgray;
}
</style>
