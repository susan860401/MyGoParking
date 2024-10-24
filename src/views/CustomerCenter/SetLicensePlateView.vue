<script setup>
import { ref } from "vue";

const API_URL = "https://localhost:7077/api";

// 一開始要載入的car
const cars = ref([]);
//要新增的car
const car = ref({});

const inputs = ref([{ lincense: "", status: "", editable: true }]);

const loadLicensePlates = async () => {};

//點擊新增車牌 新增輸入框
const addLicensePlate = () => {
  inputs.value.push({ text: "", selected: "" });
};

const updateLicensePlate = async () => {
  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    body: JSON.stringify(car.Value),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    loadLicensePlates();
  } else {
    alert("新增失敗");
  }
};
</script>

<template>
  <div>
    <div class="container bg-light p-2">
      <h4>車牌設定</h4>
      <div class="mb-2">這編寫注意事項</div>
      <!-- 標題 -->
      <button @click="addLicensePlate">點我新增</button>
      <div class="row d-flex justify-content-center">
        <div class="col-md-4">
          <label class="form-label">車牌號碼</label>
        </div>
        <div class="col-md-3">
          <label class="form-label">狀態</label>
        </div>
      </div>
      <div v-for="data in inputs" class="row d-flex justify-content-center">
        <div class="col-md-4">
          <input v-model="data.lincense" type="text" :disabled="!canEdit" />
        </div>
        <div class="col-md-3">
          <select v-model="data.status">
            <option selected value="available">可用</option>
            <option value="deactivate">停用</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
