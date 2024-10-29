<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';

const baseUrl = `${import.meta.env.VITE_API_BASEURL}/LinePay/`;

// 響應式變數
const licensePlate = ref(''); // 選中的車牌號碼
const selectedCoupon = ref(0); // 選中的優惠券
const Mycoupons = ref([]);// 儲存 API 回傳的優惠劵資料
const plates = ref([]); // 儲存 API 回傳的車牌資料
const MyuserId = ref(0); // 使用者 ID

// 從 localStorage 取得使用者資料
const userData = localStorage.getItem('user');

// 調用 API 獲取車輛資料
const fetchCarInfo = async () => {
    try {
        const response = await axios.post(`${baseUrl}ListenUserId`, {
            userId: MyuserId.value,
        });
        const cars = response.data.cars;

        if (cars && cars.length > 0) {
            plates.value = cars.map(car => ({
                carid: car.carId,
                carName: car.licensePlate
            }));
            licensePlate.value = plates.value[0]; // 預設選第一個車牌
            console.log('取得的車牌資料:', plates.value);
        } else {
            console.log('找不到車輛資料');
        }

        const coupons = response.data.coupons;
        if (coupons && coupons.length > 0) {
            Mycoupons.value = coupons.map(coup => ({
                id: coup.couponId,
                amount: coup.amount
            }));
            selectedCoupon.value = Mycoupons.value[0];
            console.log('取得的優惠資料:', Mycoupons.value);
        } else {
            console.log('找不到優惠資料');
        }
    } catch (error) {
        console.error('調用 API 時發生錯誤:', error);
        alert('你未有停車');
    }
};

// 在 Vue 組件掛載時調用 API
onMounted(async () => {
    try {
        if (userData) {
            const user = JSON.parse(userData);
            MyuserId.value = user.userId;
            console.log('我的 UserID:', MyuserId.value);

            await fetchCarInfo(); // 調用 API 獲取資料
        } else {
            console.log('找不到使用者資料');
        }
    } catch (error) {
        console.error('解析使用者資料時發生錯誤:', error);
    }
});

// 表單提交處理
const submitForm = () => {
    console.log('提交的車牌號碼ID:', licensePlate.value.carid);
    console.log('選擇的優惠券ID:', selectedCoupon.value.id);
};
</script>

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
                                        <div class="mb-4">
                                            <label for="plate" class="form-label fs-5">車牌號碼：</label>
                                            <select class="form-select form-select-lg" id="plate" v-model="licensePlate"
                                                required>
                                                <option v-for="plate in plates" :key="plate" :value="plate">
                                                    {{ plate.carName }}
                                                </option>
                                            </select>
                                        </div>

                                        <div class="mb-4">
                                            <label for="coupon" class="form-label fs-5">選擇優惠券：</label>
                                            <select class="form-select form-select-lg" id="coupon"
                                                v-model="selectedCoupon" required>
                                                <option v-for="coupon in Mycoupons" :key="coupon" :value="coupon">
                                                    折價 : {{ coupon.amount }} 元
                                                </option>
                                            </select>
                                        </div>
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
