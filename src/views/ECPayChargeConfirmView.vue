<script setup>
import { ref, onMounted } from 'vue';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// 初始化資料
const amount = ref(0);
const MycouponId = ref(0);
const MycarId = ref(0);
const MylotName = ref('');
const MycouponAmount = ref(0);
const paymentStatus = ref('綠界付款已成功');
const router = useRouter();  // 初始化 Vue Router

// API 路徑
const baseApiUrl = `${import.meta.env.VITE_API_BASEURL}/ECPay`;

// 取得 sessionStorage 中的付款資料並發送請求更新資料庫
onMounted(async () => {
    const storedInfo = JSON.parse(sessionStorage.getItem('MyInfo'));

    if (storedInfo) {
        amount.value = storedInfo.amount;
        MylotName.value = storedInfo.lotName;
        MycouponId.value = storedInfo.couponsId;
        MycouponAmount.value = storedInfo.componsAmount;
        MycarId.value = storedInfo.car;

        // 發送 POST 請求到控制器，確認付款並更新優惠券及交易記錄
        try {
            const payload = {
                MycarId: MycarId.value,
                Myamount: amount.value,
                MycouponId: MycouponId.value || null // 如果 MycouponId 有值就傳遞，否則為 null
            };

            await axios.post(`${baseApiUrl}/ConfirmPayment`, payload);
            console.log('付款確認完成，交易記錄已更新');
        } catch (error) {
            console.error('付款確認或更新記錄失敗:', error);
        }
    } else {
        alert('無法讀取方案資料，請重新選擇方案。');
    }
    // 等待 5 秒後自動調用 goToHomePage 函數
    setTimeout(goToHomePage, 5000);
});

// 返回首頁
function goToHomePage() {
    paymentStatus.value = '支付成功，正在返回首頁...';
    router.push("/"); // 使用 router.push 返回首頁
}

</script>



<template>
    <BreadcrumbsComponent>
        <template #title>
            <h2>停車繳費</h2>
        </template>
        <template #page>停車繳費</template>
    </BreadcrumbsComponent>
    <div class="payment-form-container">
        <h1 class="text-center mb-4">支付確認頁面</h1>
        <form class="payment-form shadow-lg p-5 rounded">
            <div class="form-group mb-4">
                <h2>{{ MylotName }}</h2>
            </div>
            <div class="form-group mb-4">
                <label for="amount" class="form-label">停車金額</label>
                <input type="text" id="amount" class="form-control form-control-lg" :value="`${amount} TWD`" readonly />
            </div>
            <div class="form-group mb-4">
                <label for="coupon" class="form-label">優惠券</label>
                <input type="text" id="coupon" class="form-control form-control-lg"
                    :value="MycouponId ? `折抵 ${MycouponAmount} TWD` : '沒有使用優惠券'" readonly />
            </div>
            <div class="form-group mb-4">
                <label for="paymentStatus" class="form-label">交易狀態</label>
                <input type="text" id="paymentStatus" class="form-control form-control-lg" :value="paymentStatus"
                    readonly />
            </div>
            <div class="text-center">
                <button class="btn btn-lg mt-3 btn-success" @click.prevent="goToHomePage">
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