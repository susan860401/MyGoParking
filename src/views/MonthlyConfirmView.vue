<script setup>
import { ref, onMounted } from 'vue';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';
import axios from 'axios';

// 初始化資料
const amount = ref(0); // 方案金額
const planLabel = ref(''); // 方案名稱
const paymentStatus = ref('等待確認...');

// API 基本路徑
const baseLoginPayUrl = `${import.meta.env.VITE_API_BASEURL}/LinePay/`;


// 從 sessionStorage 讀取金額與方案資料
onMounted(() => {
    const storedInfo = JSON.parse(sessionStorage.getItem('paymentInfo'));

    if (storedInfo) {
        amount.value = storedInfo.amount;
        planLabel.value = storedInfo.planLabel;

    } else {
        alert('無法讀取方案資料，請重新選擇方案。');
        window.location.href = '/'; // 導回首頁或選擇頁
    }
});

// 確認支付函數
async function confirmPayment() {
    try {
        const params = new URLSearchParams(window.location.search);
        const transactionId = params.get('transactionId');
        const orderId = params.get('orderId');

        const payment = { amount: amount.value, currency: 'TWD' };
        const url = `${baseLoginPayUrl}Confirm?transactionId=${transactionId}&orderId=${orderId}`;

        const response = await axios.post(url, payment, {
            headers: { 'Content-Type': 'application/json' },
        });

        paymentStatus.value = '交易狀態: 成功';
        console.log('確認成功:', response.data);
    } catch (error) {
        console.error('交易確認失敗:', error);
        paymentStatus.value = '交易狀態: 失敗，請稍後再試';
    }
}
</script>


<template>
    <BreadcrumbsComponent>
        <template #title>
            <h2>月租付款</h2>
        </template>
        <template #page>月租付款</template>
    </BreadcrumbsComponent>
    <div class="payment-form-container">
        <h1 class="text-center mb-4">支付確認頁面</h1>
        <form class="payment-form shadow-lg p-5 rounded">
            <div class="form-group mb-4">
                <h2>{{ planLabel }}</h2>
            </div>
            <div class="form-group mb-4">
                <label for="amount" class="form-label">方案金額</label>
                <input type="text" id="amount" class="form-control form-control-lg" :value="`${amount} TWD`" readonly />
            </div>
            <div class="form-group mb-4">
                <label for="paymentStatus" class="form-label">交易狀態</label>
                <input type="text" id="paymentStatus" class="form-control form-control-lg" :value="paymentStatus"
                    readonly />
            </div>
            <div class="text-center">
                <button class="btn btn-primary btn-lg w-100 mt-3" @click.prevent="confirmPayment">
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