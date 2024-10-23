<script setup>
import { ref, computed } from 'vue';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';
import axios from 'axios';

// 方案資料
const planData = {
    oneMonth: {
        id: "oneMonth",
        label: '1個月方案',
        money: '3500/月',
        price: '3500',
        description: '適合短期停車需求，彈性靈活，無需長期綁約。',
        features: ['無綁約，可隨時取消', '方便的自動續約功能', '支援多種付款方式'],
        savings: '',
    },
    threeMonths: {
        id: "threeMonths",
        label: '3個月方案',
        money: '3400/月',
        price: '10200',
        description: '享有優惠價格，適合中期停車需求。',
        features: ['比單月更划算', '推薦方案，特別優惠', '可提前續約，保障車位'],
        savings: '比1個月方案每月省100元',
    },
    sixMonths: {
        id: "sixMonths",
        label: '6個月方案',
        money: '3200/月',
        price: '19200',
        description: '適合長期停車需求，節省更多費用。',
        features: ['半年合約，享有長期優惠', '固定車位保障', '免費升級停車服務'],
        savings: '比1個月方案每月省300元',
    },
    twelveMonths: {
        id: "twelveMonths",
        label: '12個月方案',
        money: '3000/月',
        price: '36000',
        description: '最划算的年度合約方案，省下更多。',
        features: ['年度最低價格', '專屬客戶服務', '參加會員活動資格'],
        savings: '比1個月方案每月省500元',
    },
};

// 設定選中的方案
const selectedPlanKey = ref('twelveMonths');
const selectedPlan = ref(planData[selectedPlanKey.value]);

const savingsMessage = computed(() =>
    selectedPlan.value.savings ? `此方案 ${selectedPlan.value.savings}` : ''
);

const selectPlan = (planKey) => {
    if (planData[planKey]) {
        selectedPlan.value = planData[planKey];
        selectedPlanKey.value = planKey;
        console.log('已選擇方案:', selectedPlan.value);
    } else {
        console.error('無效的方案 Key:', planKey);
    }
};

// API 基本路徑
const baseLoginPayUrl = `${import.meta.env.VITE_API_BASEURL}/LinePay/`;

async function validatePlan() {
    const payload = {
        planId: selectedPlan.value.id,
        amount: parseInt(selectedPlan.value.price, 10),
    };

    try {
        const response = await axios.post(`${baseLoginPayUrl}Validate`, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('驗證結果:', response.data);
        alert('方案驗證成功。');
        return response.data.isValid;
    } catch (error) {
        console.error('方案驗證失敗:', error.response?.data?.message || error.message);
        alert('方案驗證失敗，請確認後再試。');
        return false;
    }
}


// 建立交易請求
async function requestPayment() {
    const isValid = await validatePlan();
    if (!isValid) return; // 若驗證失敗，中止支付流程


    const amount = parseInt(selectedPlan.value.price, 10); // 取得選擇方案的金額
    const paymentInfo = {
        amount: amount,  // 金額
        planLabel: selectedPlan.value.label,  // 方案名稱
    };

    // 儲存金額與方案資訊於 sessionStorage
    sessionStorage.setItem('paymentInfo', JSON.stringify(paymentInfo))



    const payment = {
        amount: amount,  // 總金額
        currency: "TWD",  // 貨幣類型
        orderId: Date.now().toString(),  // 訂單 ID
        planId: selectedPlan.value.id,  // 方案 ID
        packages: [
            {
                id: `pkg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,  // 包裹 ID
                amount: parseInt(selectedPlan.value.price, 10),  // 包裹金額
                name: selectedPlan.value.label,  // 包裹名稱
                products: [
                    {
                        name: selectedPlan.value.label,  // 產品名稱
                        quantity: 1,  // 數量
                        price: parseInt(selectedPlan.value.price, 10),  // 單價
                    },
                ],
                userFee: 0,  // 可選：使用者費用
            },
        ],
        redirectUrls: {
            confirmUrl: `${window.location.origin}/MonthlyConfirm`,  // 確認頁面
            cancelUrl: `${baseLoginPayUrl}Cancel`,  // 取消頁面
        },
        options: null,  // 可選：額外選項
    };

    try {
        const response = await axios.post(`${baseLoginPayUrl}Create`, payment, {
            headers: { 'Content-Type': 'application/json' },
        });

        const paymentUrl = response.data.info.paymentUrl.web;

        console.log('前往支付頁面:', paymentUrl);
        window.location.href = paymentUrl;
    } catch (error) {
        console.error('交易失敗:', error);
        alert('交易失敗，請稍後再試。');
    }
}
</script>


<template>
    <div>
        <main id="main">
            <BreadcrumbsComponent>
                <template #title>
                    <h2>月租付款</h2>
                </template>
                <template #page>月租付款</template>
            </BreadcrumbsComponent>

            <div class="container py-5">
                <h2 class="text-center mb-3">選擇您的月租停車方案</h2>
                <p class="text-center text-muted">彈性付款方案，滿足您的停車需求</p>

                <ul class="nav justify-content-evenly mb-4" id="planTabs">
                    <li class="nav-item" style="width: 23%;" v-for="(plan, key) in planData" :key="key">
                        <div class="plan-option" :class="{ active: selectedPlanKey === key }" @click="selectPlan(key)">
                            {{ plan.label }}
                        </div>
                    </li>
                </ul>

                <div class="tab-content">
                    <div class="tab-pane show active" id="planContent">
                        <div class="text-center p-5 bg-white rounded shadow">
                            <h1>{{ selectedPlan.money }}</h1>
                            <p>總付款{{ selectedPlan.price }}元</p>
                            <p class="text-muted">{{ selectedPlan.description }}</p>
                            <ul class="list-unstyled">
                                <li v-for="feature in selectedPlan.features" :key="feature" class="feature-item">
                                    {{ feature }}
                                </li>
                            </ul>
                            <p v-if="savingsMessage" class="text-success mt-3">
                                {{ savingsMessage }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-4">
                    <button class="btn btn-warning btn-lg" @click="requestPayment()">
                        立即付款
                    </button>
                </div>
            </div>
        </main>
        <div id="paymentFormContainer"></div>
    </div>
</template>

<style lang="css" scoped>
.plan-option {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 12px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    position: relative;
}

.plan-option::before {
    content: '○';
    font-size: 20px;
    color: #ddd;
    margin-right: 10px;
    transition: color 0.3s;
}

.plan-option.active::before {
    content: '✔' !important;
    color: #007bff !important;
}

.plan-option.active {
    border-color: #007bff !important;
    background: #e7f1ff !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.tab-content h1 {
    font-size: 3rem;
}

.feature-item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
}

.feature-item::before {
    content: '✔';
    color: #28a745;
    margin-right: 8px;
    font-size: 18px;
}

.btn-lg:hover {
    background-color: #ffc107;
}
</style>
