<template>
    <div>
        <main id="main">
            <BreadcrumbsComponent>
                <template #title>
                    <h2>預約付款</h2>
                </template>
                <template #page>預約付款</template>
            </BreadcrumbsComponent>

            <div class="form-wrapper">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8 col-lg-6">
                            <div class="card shadow-lg">
                                <div class="card-header bg-gradient-primary text-white text-center py-4">
                                    <h2 class="mb-0">車牌號碼及優惠券選擇</h2>
                                </div>
                                <div class="card-body p-5">
                                    <form @submit.prevent="submitForm">
                                        <!-- 車牌號碼輸入 -->
                                        <div class="mb-4">
                                            <label for="plate" class="form-label fs-5">車牌號碼：</label>
                                            <input type="text" id="plate" class="form-control form-control-lg"
                                                placeholder="請輸入您的車牌號碼" v-model="plateNumber" required />
                                        </div>

                                        <!-- 優惠券選擇 -->
                                        <div class="mb-4">
                                            <label for="coupon" class="form-label fs-5">選擇優惠券：</label>
                                            <select class="form-select form-select-lg" id="coupon"
                                                v-model="selectedCoupon" required>
                                                <option v-for="coupon in coupons" :key="coupon.id" :value="coupon.code">
                                                    {{ coupon.name }}
                                                </option>
                                            </select>
                                        </div>

                                        <!-- 提交按鈕 -->
                                        <div class="d-grid gap-2">
                                            <button type="submit" class="btn btn-warning">提交</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';

// 響應式變數
const plateNumber = ref('');
const selectedCoupon = ref('');
const coupons = ref([
    { id: 1, name: '10% 折扣', code: 'DISCOUNT10' },
    { id: 2, name: '20% 折扣', code: 'DISCOUNT20' },
    { id: 3, name: '免費停車 1 小時', code: 'FREE1HR' },
]);

// 提交表單
const submitForm = () => {
    console.log('車牌號碼:', plateNumber.value);
    console.log('選擇的優惠券:', selectedCoupon.value);

    alert(`已提交：車牌號碼 - ${plateNumber.value}，優惠券 - ${selectedCoupon.value}`);
};
</script>

<style scoped>
/* 讓頁面背景為透明或純白 */
.form-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

/* 卡片設計 */
.card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    background-color: white;
}

/* 漸層標題背景 */
.bg-gradient-primary {
    background: linear-gradient(45deg, #6d6c1dbb, #fa9119);
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* 表單輸入框 */
.form-control-lg,
.form-select-lg {
    border-radius: 12px;
    padding: 15px;
    font-size: 18px;
}
</style>