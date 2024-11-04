<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import "vue3-carousel/dist/carousel.css";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import Swal from "sweetalert2";
import { getUserCarPlate } from "@/js/com";
import { useUserStore } from "@/stores/userStore";

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const route = useRoute();
const router = useRouter();
const lotId = route.query.lotId;
const lotsInfo = ref(null);
const date = ref();
const dateMon = ref();
const cars = ref([]);
const carsForMon = ref([]);
const selectedCarPlate = ref("");
const selectedCarPlateforMon = ref("");
const userStore = useUserStore();

const getLotsInfo = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/Reservations/GetLotsInfo?lotId=${lotId}`
    );
    if (res.ok) {
      let data = await res.json();
      //console.log(data);
      lotsInfo.value = data;
    } else {
      throw new Error("無法取得停車場資料");
    }
  } catch (error) {
    console.error("Error：", error);
  }
};

const GotoRes = async () => {
  router.push({
    name: "resPayment",
    query: lotId,
  });
};

const submitRes = async () => {
  if (
    !selectedCarPlate.value ||
    !date.value ||
    selectedCarPlate.value === "--請選擇車牌--"
  ) {
    Swal.fire({
      icon: "warning",
      title: "錯誤",
      text: "請輸入資料後再進行預約",
    });
    return;
  }

  //const userId = JSON.parse(localStorage.getItem("user")).userId;
  //console.log(userId);
  const formattedDate = new Date(date.value);
  const utcFormattedDate = new Date(
    formattedDate.getTime() - formattedDate.getTimezoneOffset() * 60000
  ).toISOString();
  const payload = {
    startTime: utcFormattedDate,
    lotName: lotsInfo.value.lotName,
    licensePlate: selectedCarPlate.value,
  };
  //console.log(payload);
  try {
    let res = await fetch(
      `${BASE_URL}/Reservations/newReservation?userId=${userStore.userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      if (res.status === 400) {
        const errorData = await res.json();
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: errorData.message,
        });
      }
    } else {
      let fetchRes = await res.json();
      //console.log(fetchRes);
      if (fetchRes.message == "該停車場不提供預約服務") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: fetchRes.message,
        });
      } else if (fetchRes.message == "車位已滿, 無法進行預約") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: fetchRes.message,
        });
      } else if (fetchRes.message == "無效的停車場") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: fetchRes.message,
        });
      } else if (fetchRes.message == "該車牌不屬於當前用戶") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: fetchRes.message,
        });
      } else {
        await getLotsInfo();
        sessionStorage.setItem("carId", fetchRes.newRes.carId);
        sessionStorage.setItem("lotId", fetchRes.newRes.lotId);
        sessionStorage.setItem("resDeposit", lotsInfo?.value.resDeposit);
        sessionStorage.setItem("startTime", fetchRes.newRes.startTime);
        date.value = null;
        GotoRes();
      }
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.Message,
    });
  }
};

const GoToMonPay = async () => {
  if (!lotsInfo.value) {
    await getLotsInfo(); // 確保此時已經獲取了 lotId 和 lotName
  }
  const formattedDate = new Date(dateMon.value);
  const utcFormattedDate = new Date(
    formattedDate.getTime() - formattedDate.getTimezoneOffset() * 60000
  ).toISOString();
  const selectCar = carsForMon.value.find(
    (car) => car.licensePlate === selectedCarPlateforMon.value
  );
  // console.log(selectCar);
  // console.log(cars.value); //抓不到
  if (!selectedCarPlateforMon.value) {
    Swal.fire({
      icon: "warning",
      title: "錯誤",
      text: "請選擇車牌再申請月租!",
    });
    return;
  }
  try {
    const res = await fetch(
      `${BASE_URL}/MonthlyRentals/CheckMonRentalSpace?lotId=${lotId}`
    );
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      throw new Error(data.message || "檢查月租車位狀態時發生錯誤");
    }
    if (data.message === "月租車位可用" && data.success === true) {
      sessionStorage.setItem("carId", selectCar.carId);
      sessionStorage.setItem("lotId", lotId);
      sessionStorage.setItem("startTime", utcFormattedDate);
      sessionStorage.setItem("amount", lotsInfo?.value.monRentalRate);
      router.push({
        name: "MonthlyRent",
        query: {
          lotId: lotsInfo.value.lotId,
          lotName: lotsInfo.value.lotName,
        },
      });
    } else if (
      data.message === "月租車位已滿, 您可以填寫申請表單等待抽籤" &&
      data.success === false
    ) {
      //沒空位跳去填寫表單
      Swal.fire({
        icon: "info",
        title: "月租車位已滿",
        text: "月租車位已滿, 您可以填寫申請表單等待抽籤",
        showCancelButton: true,
        confirmButtonText: "去申請排隊",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push({
            name: "monRentApply",
            query: {
              lotId: lotsInfo.value.lotId,
              lotName: lotsInfo.value.lotName,
            },
          });
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "注意!",
        text: "該停車場不支援月租服務",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "錯誤",
      text: error.message || "檢查月租車位狀態時發生錯誤",
    });
  }
};

onMounted(async () => {
  await getLotsInfo();
  await getUserCarPlate(cars);
  await getUserCarPlate(carsForMon);
});
</script>

<template>
  <main id="main">
    <BreadcrumbsComponent
      backgroundImage="/03.jpg"
      :breadcrumbs="[
        { name: 'Home', link: '/' },
        { name: 'GoParkingMap', link: '/search' },
      ]"
    >
      <template #title>
        <!-- 插入到 title 插槽 -->
        <h2>Reservation & MonthlyRental</h2>
      </template>
      <template #page>
        <!-- 插入到 page 插槽 -->
        預約、月租服務
      </template>
    </BreadcrumbsComponent>
    <section>
      <div class="container mt-3">
        <div class="row">
          <div class="col-lg-6">
            <div
              class="row"
              style="border: 1px solid gray; border-radius: 10px"
            >
              <div class="col-lg-12">
                <Carousel :autoplay="2000" :wrapAround="true" class="p-0">
                  <Slide
                    v-for="(img, index) in lotsInfo?.lotImages"
                    :key="index"
                  >
                    <img
                      :src="img"
                      class="card-img-top p-2"
                      style="width: 550px; height: 300px"
                      :alt="lotsInfo?.lotName"
                    />
                  </Slide>
                  <template #addons>
                    <Navigation />
                    <Pagination />
                  </template>
                </Carousel>
              </div>
              <div class="col-lg-12">
                <div class="card-body mb-3">
                  <h5 class="card-title mb-2" style="font-weight: 700">
                    {{ lotsInfo?.lotName
                    }}<span
                      style="color: #ff00ff"
                      v-show="lotsInfo?.resDeposit > 0"
                      ><i class="fa-solid fa-star"></i
                    ></span>
                    <span
                      style="color: #d9b300"
                      v-show="lotsInfo?.monRentalRate > 0"
                      ><i class="fa-solid fa-circle"></i
                    ></span>
                  </h5>
                  <p class="card-text">
                    <a
                      :href="`https://www.google.com/maps/search/?api=1&query=${lotsInfo?.latitude},${lotsInfo?.longitude}`"
                      target="_blank"
                      ><i class="fa-solid fa-map-location-dot fa-bounce"></i
                    ></a>
                    {{ lotsInfo?.location }}
                  </p>
                  <p class="card-text">收費標準：{{ lotsInfo?.rateRules }}</p>
                  <p class="card-text">
                    預約服務訂金:{{ lotsInfo?.resDeposit }}元
                  </p>
                  <p class="card-text">
                    月租費: {{ lotsInfo?.monRentalRate }}元/月
                  </p>
                  <p class="card-text">
                    總車位數：{{ lotsInfo?.smallCarSpace }}
                  </p>
                  <p class="card-text">電動車位數：{{ lotsInfo?.etcSpace }}</p>
                  <p class="card-text">
                    月租剩餘車位: {{ lotsInfo?.monRentalSpace }}
                  </p>
                  <p class="card-text">電話：{{ lotsInfo?.tel }}</p>
                  <p class="card-text">
                    <small class="text-muted"
                      >剩餘車位：{{ lotsInfo?.validSpace }}</small
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="content pt-0">
              <!-- Nav pills -->
              <ul class="nav nav-pills" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active" data-bs-toggle="pill" href="#Res"
                    >預約</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-bs-toggle="pill" href="#Mon">月租</a>
                </li>
              </ul>

              <!-- Tab panes -->
              <div class="tab-content">
                <div id="Res" class="container tab-pane active">
                  <form>
                    <div class="form-group">
                      <label for="exampleFormControlInput1">車牌號碼</label>
                      <select
                        v-model="selectedCarPlate"
                        class="form-control mb-2"
                        id="exampleFormControlInput1"
                      >
                        <option value="">--請選擇車牌--</option>
                        <option
                          v-for="(car, index) in cars"
                          :key="index"
                          :value="car.licensePlate"
                        >
                          {{ car.licensePlate }}
                        </option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="exampleInputPassword1">預約時間</label>
                      <!-- 使用 VueDatePicker 並綁定 v-model -->
                      <VueDatePicker
                        v-model="date"
                        id="exampleInputPassword1"
                      />
                    </div>
                    <button
                      type="button"
                      @click="submitRes"
                      class="btn btn-primary mt-3"
                    >
                      送出
                    </button>
                  </form>
                </div>
                <div id="Mon" class="container tab-pane fade">
                  <form>
                    <div class="form-group">
                      <label for="InputName">車牌號碼</label>
                      <select
                        v-model="selectedCarPlateforMon"
                        class="form-control mb-2"
                        id="InputName"
                      >
                        <option value="">--請選擇車牌--</option>
                        <option
                          v-for="(car, index) in carsForMon"
                          :key="index"
                          :value="car.licensePlate"
                        >
                          {{ car.licensePlate }}
                        </option>
                      </select>
                      <div class="form-group">
                        <label for="MonTime">預約時間</label>
                        <!-- 使用 VueDatePicker 並綁定 v-model -->
                        <VueDatePicker v-model="dateMon" id="MonTime" />
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary mt-3"
                      @click="GoToMonPay"
                    >
                      送出
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="css" scoped>
.datepicker {
  position: relative;
  z-index: 9999;
}
label {
  color: #fff;
}
.content {
  width: 450px;
  height: auto;
  margin: 0 auto;
  padding: 30px;
}
.nav-pills {
  width: 450px;
}
.nav-item {
  width: 50%;
}
.nav-pills .nav-link {
  font-weight: bold;
  padding-top: 13px;
  text-align: center;
  background: #939399;
  color: #fff;
  border-radius: 30px;
  height: 100px;
}
.nav-pills .nav-link.active {
  background: #000;
  color: #fff;
}
.tab-content {
  position: absolute;
  width: 450px;
  height: auto;
  margin-top: -50px;
  background: #000;
  color: #000;
  border-radius: 30px;
  z-index: 1000;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.4);
  padding: 30px;
  margin-bottom: 50px;
}
.tab-content button {
  border-radius: 15px;
  width: 100px;
  margin: 0 auto;
  float: right;
}
</style>
