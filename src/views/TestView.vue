<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';

const baseUrl = `${import.meta.env.VITE_API_BASEURL}/LinePay/`;

const licensePlate = ref('');
const selectedCoupon = ref(null);
const Mycoupons = ref([]);
const step = ref(1);
const errorMessage = ref(''); // 儲存錯誤訊息

const licensePlatePattern = /^[A-Z]{3}\d{4}$/;

const isFormValid = computed(() => licensePlatePattern.test(licensePlate.value.trim()));

const onLicensePlateInput = (event) => {
    const value = event.target.value.toUpperCase();
    licensePlate.value = value.replace(/[^A-Z0-9]/g, '');
};

const checkCouponsByLicensePlate = async () => {
    try {
        if (licensePlate.value.trim() === '') {
            alert('請輸入車牌號碼');
            return;
        }

        console.log(licensePlate.value);

        const response = await axios.post(`${baseUrl}testddd`, {
            licensePlate: licensePlate.value,
        });

        Mycoupons.value = response.data.couponIds || [];
        console.log('優惠券資料:', Mycoupons.value);

        step.value = 2;
        errorMessage.value = ''; // 請求成功時清除錯誤訊息
    } catch (error) {
        console.error('發生錯誤:', error);
        if (error.response && error.response.status === 404) {
            errorMessage.value = error.response.data.message; // 儲存錯誤訊息
        } else {
            errorMessage.value = '系統錯誤，請稍後再試';
        }
    }
};

const submitForm = () => {
    if (!licensePlate.value) {
        alert('請填寫車牌號碼');
        return;
    }

    console.log('提交的車牌號碼:', licensePlate.value);

    if (selectedCoupon.value && selectedCoupon.value.couponId !== null) {
        console.log('選擇的優惠券ID:', selectedCoupon.value.couponId);
    } else {
        console.log('未使用優惠券');
    }

    licensePlate.value = '';
    selectedCoupon.value = null;
    Mycoupons.value = [];
    step.value = 1;
    errorMessage.value = ''; // 重置錯誤訊息
};
</script>

<template>
    <div>
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
                                    <h2 class="mb-0">輸入車牌及檢查優惠券</h2>
                                </div>
                                <div class="card-body p-5">
                                    <div v-if="errorMessage" class="alert alert-danger" role="alert">
                                        {{ errorMessage }}
                                    </div>

                                    <div class="mb-4">
                                        <label for="plate" class="form-label fs-5">車牌號碼：</label>
                                        <input type="text" id="plate" class="form-control form-control-lg"
                                            v-model="licensePlate" @input="onLicensePlateInput"
                                            placeholder="請輸入車牌號碼 (格式：ABC1234)" required />
                                    </div>

                                    <div class="mb-4" v-if="step === 2">
                                        <label for="coupon" class="form-label fs-5">選擇優惠券：</label>
                                        <select class="form-select form-select-lg" id="coupon" v-model="selectedCoupon">
                                            <option :value="null">不使用優惠券</option>
                                            <option v-for="coupon in Mycoupons" :key="coupon.couponId" :value="coupon">
                                                折價: {{ coupon.amount }} 元，到期日: {{ coupon.endTime }}
                                            </option>
                                        </select>
                                    </div>

                                    <div class="d-grid gap-2">
                                        <button type="button" class="btn btn-warning" :disabled="!isFormValid"
                                            @click="step === 1 ? checkCouponsByLicensePlate() : submitForm()">
                                            {{ step === 1 ? '下一步' : '送出' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
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
