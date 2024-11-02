<script setup>
import { ref, onMounted } from 'vue';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';
import axios from 'axios';

// 初始化資料
const amount = ref(0);
const MycouponId = ref(0);
const MycarId = ref(0);
const MylotName = ref('');
const MycouponAmount = ref(0);
const paymentStatus = ref('等待確認...');
const isDisabled = ref(true);
const buttonClass = ref('btn-secondary');

// API 路徑
const baseApiUrl = `${import.meta.env.VITE_API_BASEURL}/LinePay`;

// 取得 sessionStorage 中的付款資料
onMounted(() => {
    const storedInfo = JSON.parse(sessionStorage.getItem('MyInfo'));

    if (storedInfo) {
        amount.value = storedInfo.amount;
        MylotName.value = storedInfo.lotName;
        MycouponId.value = storedInfo.couponsId;
        MycouponAmount.value = storedInfo.componsAmount;
        MycarId.value = storedInfo.car;
    } else {
        alert('無法讀取方案資料，請重新選擇方案。');
        ;
    }

    setTimeout(() => {
        isDisabled.value = false;
        buttonClass.value = 'btn-warning';
    }, 5000);
});

async function confirmPayment() {
    try {
        isDisabled.value = true;
        paymentStatus.value = '確認中...';


        // 如果金額為 0 且有使用優惠券，直接呼叫 `UpdateEntryExitPayment` 並返回
        if (amount.value === 0 && MycouponId.value) {
            const payload = {
                MycarId: MycarId.value,
                Myamount: amount.value,
                MycouponId: MycouponId.value
            };
            console.log('發送的 Payload (金額為0且有優惠券):', JSON.stringify(payload, null, 2));

            const response = await axios.post(
                `${baseApiUrl}/UpdateEntryExitPayment`,
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            paymentStatus.value = '交易狀態: 成功 (0 元優惠交易)';
            alert('付款確認成功 (0 元優惠交易)');
            setTimeout(() => (window.location.href = "/"), 3000);
            return;
        }

        //----------------------------------------------------------------------------------

        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('orderId');
        const transactionId = params.get('transactionId');
        const payment = { amount: amount.value, currency: 'TWD' };

        const confirmUrl = `${baseApiUrl}/Confirm?transactionId=${transactionId}&orderId=${orderId}`;

        const check = await axios.post(confirmUrl, payment, {
            headers: { 'Content-Type': 'application/json' },
        });

        const payload = {
            MycarId: MycarId.value, // 車輛 ID 必傳
            Myamount: amount.value
        };
        // 如果 MycouponId 有值才加入 payload
        if (MycouponId.value !== null) {
            payload.MycouponId = MycouponId.value;
        }
        console.log('發送的 Payload:', JSON.stringify(payload, null, 2));



        if (check.data.returnCode === '0000') {
            alert('付款確認成功');
            const response = await axios.post(
                `${baseApiUrl}/UpdateEntryExitPayment`,
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );
            paymentStatus.value = '交易狀態: 成功';
            setTimeout(() => (window.location.href = "/"), 3000);
        } else if (check.data.returnCode === '1172') {
            alert('重複付款');
            paymentStatus.value = '交易狀態: 已有重複訂單';
            setTimeout(() => (window.location.href = "/"), 3000);
        } else {
            paymentStatus.value = `交易狀態: ${check.data.message}`;
            setTimeout(() => (window.location.href = "/"), 3000);
        }

    } catch (error) {
        console.error('交易確認失敗:', error);
        paymentStatus.value = '交易狀態: 失敗，請稍後再試';

        // 使用 error.response 來檢查錯誤回應
        if (error.response) {
            console.log('錯誤詳細:', error.response.data);
        } else {
            console.log('錯誤詳細:', error.message);
        }
    } finally {
        isDisabled.value = false;
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
                <button class="btn btn-lg mt-3" :class="[buttonClass]" @click.prevent="confirmPayment"
                    :disabled="isDisabled">
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