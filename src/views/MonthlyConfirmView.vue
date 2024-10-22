<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// 取得路由中的查詢參數
const route = useRoute();
const planKey = ref(route.query.plan || '');
const purchasedPlan = ref(null);

// 定義方案資料
const planData = {
    oneMonth: { label: '1個月', price: '3500', description: '短期彈性方案' },
    threeMonths: { label: '3個月', price: '3400', description: '中期優惠方案' },
    sixMonths: { label: '6個月', price: '3200', description: '半年長期方案' },
    twelveMonths: { label: '12個月', price: '3000', description: '年度合約方案' },
};

// 根據查詢參數顯示對應的方案資訊
onMounted(() => {
    if (planKey.value && planData[planKey.value]) {
        purchasedPlan.value = planData[planKey.value];
    }
});
</script>

<template>
    <div class="container text-center py-5">
        <h2>感謝您的購買！</h2>
        <div v-if="purchasedPlan" class="mt-4">
            <h3>{{ purchasedPlan.label }} 方案</h3>
            <p>價格：{{ purchasedPlan.price }} 元</p>
            <p>{{ purchasedPlan.description }}</p>
        </div>
        <p v-else class="text-muted">無法取得方案資訊，請聯絡客服。</p>
    </div>
</template>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
}
</style>
