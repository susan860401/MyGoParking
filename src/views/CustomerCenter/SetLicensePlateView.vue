<script setup>
import item from "isotope-layout/js/item";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore"; //要取Pinia
import Swal from "sweetalert2";

const API_URL = "https://goparkapi.azurewebsites.net/api";
const userStore = useUserStore();
const userId = userStore.userId;

// 一開始要載入的car
const cars = ref([]);
let originalCars = []; //存放原始資料
const remind = ref("");

const loadLicensePlates = async () => {
  const response = await fetch(`${API_URL}/Cars_?userId=${userId}`);
  const datas = await response.json();
  cars.value = datas.map((item) => ({
    ...item,
    editable: false, //載入的車牌不可編輯
    isNew: false, //標記為舊有資料
  }));

  originalCars = JSON.parse(JSON.stringify(cars.value)); // copy原始資料
};

// 保存原始資料

//點擊新增車牌 新增輸入框
const addCar = () => {
  if (cars.value.length == 5) {
    remind.value = "至多註冊5個車牌號碼";
    return;
  }
  cars.value.push({
    carId: 0, // 給予一個臨時的ID，避免問題
    licensePlate: "",
    isActive: true, // 確保 isActive 屬性存在
    editable: true,
    isNew: true,
  });
};

const hasChange = (origin, update) => {
  console.log(`ORIGIN ${origin.isActive}`);
  console.log(`UPDATE ${update.isActive}`);

  return origin.isActive != update.isActive;
};

// 過濾掉 editable 和 isNew 屬性為了傳回
const sanitizeData = (car) => {
  const { editable, isNew, ...cleanCar } = car;
  return cleanCar;
};

const saveCar = async () => {
  let addResult = true;
  let modifyResult;
  const newCars = cars.value.filter((car) => car.isNew).map(sanitizeData); // 新增的車牌，不含多餘屬性; //抓出新增的車牌
  const updatedCars = cars.value
    .filter((car, index) => {
      if (!car.isNew) {
        return hasChange(originalCars[index], car);
      }
    })
    .map(sanitizeData); // 修改的車牌，不含多餘屬性;

  //處理新增的車牌
  if (newCars.length > 0) {
    const response = await fetch(`${API_URL}/Cars_?userId=${userId}`, {
      method: "POST",
      body: JSON.stringify(newCars),
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json(); // 解析 JSON 響應

    if (result.success) {
      addResult = true;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.message,
      });
      addResult = false;
    }
  }
  if (updatedCars.length > 0) {
    const response = await fetch(`${API_URL}/Cars_`, {
      method: "PUT",
      body: JSON.stringify(updatedCars),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      modifyResult = true;
    } else {
      modifyResult = false;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 修改失敗,
      });
    }
  }
  if (addResult && modifyResult) {
    Swal.fire({
      title: "Good job!",
      text: "車牌登記修改成功",
      icon: "success",
    });
  }
  loadLicensePlates();
};

//
loadLicensePlates();
</script>

<template>
  <div id="outside" class="container p-3 bg-light">
    <h4 class="mb-3">車牌設定</h4>
    <div class="mb-2">
      <p>
        <i class="fa-solid fa-1"></i>
        <strong> 正確性：</strong
        >目前系統不支持車牌的修改或刪除，請確保輸入的車牌號碼正確。
      </p>
      <p>
        <i class="fa-solid fa-2"></i>
        <strong> 登記限制：</strong>每位用戶至多登記 5
        個車牌，以確保系統的穩定性和公平性
      </p>
      <p>
        <i class="fa-solid fa-3"></i>
        <strong> 聯絡客服：</strong>
        如果在登記過程中遇到任何問題，請隨時聯絡客服團隊獲取幫助
      </p>
    </div>
    <!-- 標題 -->
    <button @click="addCar" class="button-55 mb-2" role="button">
      點我新增
    </button>
    <small v-if="remind" class="text-danger"> {{ remind }}</small>

    <div class="row d-flex justify-content-center">
      <div class="col-md-4">
        <label class="form-label">車牌號碼</label>
      </div>
      <div class="col-md-3">
        <label class="form-label">狀態</label>
      </div>
    </div>
    <!-- 車牌資訊區 -->
    <div
      v-for="car in cars"
      :key="car.carId"
      class="row d-flex justify-content-center mb-2"
    >
      <div class="enterPlate col-md-4 mb-1">
        <input
          v-model="car.licensePlate"
          class="form-control"
          type="text"
          :disabled="!car.editable"
        />
      </div>
      <div class="col-md-3">
        <select v-model="car.isActive" class="form-select">
          <option :value="true">可用</option>
          <option :value="false">停用</option>
        </select>
      </div>
    </div>
    <div class="row d-flex justify-content-end mt-4">
      <div class="col-2">
        <button @click="loadLicensePlates" class="button-6" role="button">
          取消
        </button>
      </div>
      <div class="col-2">
        <button @click="saveCar" class="button-6" role="button">儲存</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
#outside {
  box-shadow: -5px 0px 10px lightgrey;
  background: linear-gradient(to bottom right, white 40%, #dfe9f3 100%);
  border-radius: 10px;
}
/* CSS */
/* 新增按鈕樣式 */
.button-55 {
  align-self: center;
  background-color: #fff;
  background-image: none;
  background-position: 0 90%;
  background-repeat: repeat no-repeat;
  background-size: 4px 3px;
  border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
  border-style: solid;
  border-width: 2px;
  box-shadow: rgba(0, 0, 0, 0.2) 15px 28px 25px -18px;
  box-sizing: border-box;
  color: #41403e;
  cursor: pointer;
  display: inline-block;
  font-family: Neucha, sans-serif;
  font-size: 1rem;
  line-height: 23px;
  outline: none;
  padding: 0.5rem;
  text-decoration: none;
  transition: all 235ms ease-in-out;
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-55:hover {
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.button-55:focus {
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 4px -6px;
}

/* CSS */
.button-6 {
  align-items: center;
  background-color: #fbc01c;
  border: 1px solid rgba(247, 151, 25, 0.1);
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1;
  margin: 0;
  min-height: 1rem;
  padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: 85%;
}

.button-6:hover,
.button-6:focus {
  border-color: #fbc01c;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  color: #fbc01c;
  background-color: white;
}

.button-6:hover {
  transform: translateY(-1px);
}
</style>
