<script setup>
const props = defineProps({
  lot: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div v-if="lot" class="card" style="width: 18rem">
    <div class="card-body">
      <h5 class="card-title">{{ lot.lotName }}</h5>
      <h6 class="card-subtitle mb-2 text-body-secondary">{{ lot.location }}</h6>
      <p class="card-text">
        可用車位：{{ lot.validSpace }} / {{ lot.smallCarSpace }}<br />
        平日每小時費用：{{ lot.weekdayRate }} 元<br />
        假日每小時費用：{{ lot.holidayRate }} 元<br />
        月租費用：{{ lot.monRate }} 元<br />
        營業時間：{{ lot.opendoorTime }}<br />
        電話：{{ lot.tel }}
      </p>
      <a href="#" class="card-link">聯繫我們</a>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
