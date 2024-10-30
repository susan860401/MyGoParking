<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';

const baseUrl = `${import.meta.env.VITE_API_BASEURL}/LinePay/`;

const licensePlate = ref('');
const selectedCoupon = ref(null); // 優惠券的初始值設為 null
const Mycoupons = ref([]);
const step = ref(1);
const MycarId = ref(0); // 儲存車子的ID
const errorMessage = ref(''); // 儲存錯誤訊息
const durationHours = ref(0); // 儲存停車時數
const plateAmount = ref(0); // 儲存停車費用
const entryTime = ref(''); // 儲存從 API 回傳的進場時間

// 計算總金額 (plateAmount - selectedCoupon 的折扣金額)
const totalAmount = computed(() => {
    if (!plateAmount.value) return 0;
    const discount = selectedCoupon.value?.couponAmount || 0; // 使用 couponAmount 作為折扣金額
    return plateAmount.value - discount;
});

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

        const response = await axios.post(`${baseUrl}testddd`, {
            licensePlate: licensePlate.value,
        });

        Mycoupons.value = response.data.couponIds || [];
        durationHours.value = response.data.durationHours;
        plateAmount.value = response.data.plateAmount;
        entryTime.value = response.data.entryTime; // 從 API 回傳時間並儲存
        MycarId.value = response.data.carId;

        step.value = 2;
        errorMessage.value = ''; // 清除錯誤訊息
    } catch (error) {
        if (error.response && error.response.status === 404) {
            errorMessage.value = error.response.data.message;
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
    console.log('車子的ID: ' + MycarId.value);
    if (selectedCoupon.value && selectedCoupon.value.couponId !== null) {
        console.log('選擇的優惠券ID: ', selectedCoupon.value.couponId);
    } else {
        console.log('未使用優惠券');
    }

    // 重置狀態
    licensePlate.value = '';
    selectedCoupon.value = null;
    Mycoupons.value = [];
    step.value = 1;
    errorMessage.value = '';
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
                                            v-model="licensePlate" @input="onLicensePlateInput" :readonly="step === 2"
                                            placeholder="請輸入車牌號碼 (格式：ABC1234)" required />
                                    </div>

                                    <div class="mb-4" v-if="step === 2">
                                        <label for="coupon" class="form-label fs-5">選擇優惠券：</label>
                                        <select class="form-select form-select-lg" id="coupon" v-model="selectedCoupon">
                                            <option :value="null">不使用優惠券</option>
                                            <option v-for="coupon in Mycoupons" :key="coupon.couponId" :value="coupon">
                                                折價: {{ coupon.couponAmount }} 元，到期日: {{ coupon.endTime }}
                                            </option>
                                        </select>
                                        <label for="entry-time" class="form-label fs-5 mt-3">進場時間 :</label>
                                        <input type="text" id="entry-time" class="form-control form-control-lg"
                                            :value="entryTime" readonly />
                                        <label for="duration" class="form-label fs-5 mt-3">停車時間 :</label>
                                        <input type="text" id="duration" class="form-control form-control-lg"
                                            :value="`${durationHours} 小時`" readonly />
                                        <label for="amount" class="form-label fs-5 mt-3">原始金額 :</label>
                                        <input type="text" id="total" class="form-control form-control-lg"
                                            :value="`${plateAmount} 元`" readonly />
                                        <label for="total" class="form-label fs-5 mt-3">總金額 :</label>
                                        <input type="text" id="total" class="form-control form-control-lg"
                                            :value="`${totalAmount} 元`" readonly />

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
