<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import "vue3-carousel/dist/carousel.css";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const route = useRoute();
const lotId = route.query.lotId;
const lotsInfo = ref(null);
const date = ref();
const cars = ref([]);
const selectedCarPlate = ref("");

const getLotsInfo = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/Reservations/GetLotsInfo?lotId=${lotId}`
    );
    if (res.ok) {
      let data = await res.json();
      lotsInfo.value = data;
    } else {
      throw new Error("無法取得停車場資料");
    }
  } catch (error) {
    console.error("Error：", error);
  }
};

const getUserCarPlate = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("user")).user;
    console.log(userId);
    const res = await fetch(
      `${BASE_URL}/Reservations/GetUserCarPlate?userId=${userId}`
    );
    if (res.ok) {
      cars.value = await res.json();
      console.log(cars.value);
      //selectedCarPlate.value = "";
      //cars.value.length > 0 ? cars.value[0].licensePlate : "";
    } else {
      throw new Error("無法取得車輛資料");
    }
  } catch (error) {
    console.error("Error：", error);
  }
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

  const userId = JSON.parse(localStorage.getItem("user")).user;
  const formattedDate = new Date(date.value).toISOString();
  const payload = {
    resTime: formattedDate,
    lotName: lotsInfo.value.lotName,
    licensePlate: selectedCarPlate.value,
  };
  let res = await fetch(
    `${BASE_URL}/Reservations/newReservation?userId=${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  try {
    let fetchRes = await res.json();
    console.log(fetchRes);
    if (res.ok) {
      await getLotsInfo();
      sessionStorage.setItem("carId", fetchRes.newRes.carId);
      sessionStorage.setItem("lotId", fetchRes.newRes.lotId);
      sessionStorage.setItem("resTime", fetchRes.newRes.resTime);
      sessionStorage.setItem("amount", fetchRes.newRes.amount);
      date.value = null;
      Swal.fire({
        icon: "info",
        title: "預約成功",
        text: "訂金 : 新台幣3000元 , 將為您轉跳付款頁面!",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: fetchRes.message,
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.Message,
    });
  }
};

onMounted(async () => {
  await getLotsInfo();
  await getUserCarPlate();
});
</script>

<template>
  <div>
    <main id="main">
      <BreadcrumbsComponent backgroundImage="/03.jpg">
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
                        class="card-img-top"
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
                      {{ lotsInfo?.lotName }}
                    </h5>
                    <p class="card-text">
                      <a
                        :href="`https://www.google.com/maps/search/?api=1&query=${lotsInfo?.latitude},${lotsInfo?.longitude}`"
                        target="_blank"
                        ><i class="fa-solid fa-map-location-dot fa-bounce"></i
                      ></a>
                      {{ lotsInfo?.location }}
                    </p>
                    <p class="card-text">
                      收費標準：{{ lotsInfo?.rateRules }}預約服務訂金：3000元
                    </p>
                    <p class="card-text">
                      總車位數：{{ lotsInfo?.smallCarSpace }}
                    </p>
                    <p class="card-text">
                      電動車位數：{{ lotsInfo?.etcSpace }}
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
                    <a class="nav-link" data-bs-toggle="pill" href="#Mon"
                      >月租</a
                    >
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
                            :value="car"
                          >
                            {{ car }}
                          </option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="exampleInputPassword1">預約時間</label>
                        <!-- 使用 VueDatePicker 並綁定 v-model -->
                        <VueDatePicker
                          v-model="date"
                          class="form-control"
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
                          v-model="selectedCarPlate"
                          class="form-control"
                          id="InputName"
                        >
                          <option :value="selectedCarPlate">
                            --請選擇車牌--
                          </option>
                          <option
                            v-for="(car, index) in cars"
                            :key="index"
                            :value="car"
                          >
                            {{ car }}
                          </option>
                        </select>
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
  </div>
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
