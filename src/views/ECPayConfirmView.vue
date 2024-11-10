<!-- <script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// 初始化資料
const amount = ref(0);
const planLabel = ref('');
const paymentStatus = ref('等待確認...');
const isDisabled = ref(true);
const buttonClass = ref('btn-secondary');
const startTime = ref('');
const merchantTradeNo = ref(null);

// API 路徑
const baseApiUrl = `${import.meta.env.VITE_API_BASEURL}/ECPay`;

// 從 URL 查詢參數獲取 MerchantTradeNo
onMounted(() => {
    const route = useRoute();
    merchantTradeNo.value = route.query.MerchantTradeNo; // 從 URL 中提取 MerchantTradeNo

    if (!merchantTradeNo.value) {
        alert("無法取得交易編號，請重新操作。");
        window.location.href = '/';
        return;
    }

    // 取得 sessionStorage 中的付款資料
    const storedInfo = JSON.parse(sessionStorage.getItem('paymentInfo'));
    startTime.value = dayjs.utc(sessionStorage.getItem("startTime")).format('YYYY-MM-DD HH:mm');

    if (storedInfo) {
        amount.value = storedInfo.amount;
        planLabel.value = storedInfo.planLabel;
    } else {
        alert('無法讀取方案資料，請重新選擇方案。');
        window.location.href = '/';
        return;
    }

    // 自動確認付款狀態
    confirmPayment();

    // 設置按鈕延遲啟用
    setTimeout(() => {
        isDisabled.value = false;
        buttonClass.value = 'btn-warning';
    }, 5000);
});

// 查詢支付狀態
async function confirmPayment() {
    isDisabled.value = true;
    paymentStatus.value = '確認中...';

    try {
        // 使用 MerchantTradeNo 發送請求查詢支付狀態
        const response = await axios.get(`${baseApiUrl}/CheckPaymentStatus`, {
            params: { MerchantTradeNo: merchantTradeNo.value }
        });

        // 根據後端返回的支付狀態更新顯示
        if (response.data.status === "已支付") {
            paymentStatus.value = '交易狀態: 成功';
            buttonClass.value = 'btn-success';
            setTimeout(() => window.location.href = '/', 4000);
        } else if (response.data.status === "未支付") {
            paymentStatus.value = '交易狀態: 未支付';
            buttonClass.value = 'btn-danger';
            isDisabled.value = false; // 允許再次確認
        } else {
            paymentStatus.value = '交易狀態: 交易不存在';
            setTimeout(() => window.location.href = '/', 2000);
        }
    } catch (error) {
        console.error("確認支付狀態失敗:", error);
        paymentStatus.value = '交易狀態: 確認失敗，請稍後再試';
        buttonClass.value = 'btn-warning';
        isDisabled.value = false;
    }
}
</script> -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'vue-router';
dayjs.extend(utc);

// 初始化資料
const amount = ref(0);
const planLabel = ref('');
const paymentStatus = ref('等待確認...');
const isDisabled = ref(true);
const buttonClass = ref('btn-secondary');
const startTime = ref('');
const merchantTradeNo = ref(null);
const payType = ref(null); // 定義 payType 為 ref
const router = useRouter();  // 初始化 Vue Router
// API 路徑
const baseApiUrl = `${import.meta.env.VITE_API_BASEURL}/ECPay`;

// 從 URL 查詢參數獲取 MerchantTradeNo 和 Pay
onMounted(() => {
    const route = useRoute();
    payType.value = route.query.Pay; // 獲取 Pay 的查詢參數
    merchantTradeNo.value = route.query.MerchantTradeNo; // 從 URL 中提取 MerchantTradeNo

    if (!merchantTradeNo.value) {
        alert("無法取得交易編號，請重新操作。");
        return;
    }

    // 根據 Pay 類型執行不同的操作
    if (payType.value === 'Monthly') {
        handleMonthlyPayment();
    } else if (payType.value === 'Res') {
        handleResPayment();
    } else {
        alert("無效的支付類型。");
    }
});

// 處理 Monthly 支付的邏輯
function handleMonthlyPayment() {
    const storedInfo = JSON.parse(sessionStorage.getItem('paymentInfo'));
    startTime.value = dayjs.utc(sessionStorage.getItem("startTime")).format('YYYY-MM-DD HH:mm');

    if (storedInfo) {
        amount.value = storedInfo.amount;
        planLabel.value = storedInfo.planLabel;
    } else {
        alert('無法讀取方案資料，請重新選擇方案。');
        return;
    }

    // 自動確認付款狀態
    confirmPayment();

    // 等待 5 秒後自動調用 goToHomePage 函數
    setTimeout(goToHomePage, 5000);

}

// 處理 Res 支付的邏輯
function handleResPayment() {
    paymentStatus.value = 'Res 方案支付中...';
    const storedInfo = JSON.parse(sessionStorage.getItem('paymentInfo'));
    startTime.value = dayjs.utc(sessionStorage.getItem("startTime")).format('YYYY-MM-DD HH:mm');

    if (storedInfo) {
        amount.value = storedInfo.amount;
        planLabel.value = storedInfo.lot + "-預約金";
    } else {
        alert('無法讀取方案資料，請重新選擇方案。');
        return;
    }

    confirmPayment();

    // 等待 5 秒後自動調用 goToHomePage 函數
    setTimeout(goToHomePage, 5000);
}

// 查詢支付狀態
async function confirmPayment() {
    isDisabled.value = true;
    paymentStatus.value = '確認中...';

    try {
        // 使用 MerchantTradeNo 和 Pay 發送請求查詢支付狀態
        const response = await axios.get(`${baseApiUrl}/CheckPaymentStatus`, {
            params: { MerchantTradeNo: merchantTradeNo.value, Pay: payType.value }
        });

        if (response.data.status === "已支付") {
            paymentStatus.value = '交易狀態: 成功';
            buttonClass.value = 'btn-success';
        } else if (response.data.status === "未支付") {
            paymentStatus.value = '交易狀態: 未支付';
            buttonClass.value = 'btn-danger';
            isDisabled.value = false;
        } else {
            paymentStatus.value = '交易狀態: 交易不存在';
        }
    } catch (error) {
        console.error("確認支付狀態失敗:", error);
        paymentStatus.value = '交易狀態: 確認失敗，請稍後再試';
        buttonClass.value = 'btn-warning';
        isDisabled.value = false;
    }
}

// 返回首頁
function goToHomePage() {
    paymentStatus.value = '支付成功，正在返回首頁...';
    router.push("/"); // 使用 router.push 返回首頁
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
            <div class="form-group mb-4 text-center">
                <h2>{{ planLabel }}</h2>
            </div>
            <div class="form-group mb-4">
                <label for="amount" class="form-label">金額</label>
                <input type="text" id="amount" class="form-control form-control-lg" :value="`${amount} TWD`" readonly />
            </div>
            <div class="form-group mb-4">
                <label for="paymentStatus" class="form-label">入場時間</label>
                <input type="text" id="paymentStatus" class="form-control form-control-lg" readonly
                    :value="startTime" />
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
