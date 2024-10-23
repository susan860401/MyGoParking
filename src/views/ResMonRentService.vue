<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import "vue3-carousel/dist/carousel.css";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";

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
      selectedCarPlate.value =
        cars.value.length > 0 ? cars.value[0].licensePlate : "";
      console.log(selectedCarPlate.value);
    } else {
      throw new Error("無法取得車輛資料");
    }
  } catch (error) {
    console.error("Error：", error);
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
        <div class="container">
          <div class="row">
            <div class="col-lg-5">
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
                    <h5 class="card-title">{{ lotsInfo?.lotName }}</h5>
                    <p class="card-text">
                      <i class="fa-solid fa-map-location-dot me-2"></i
                      >{{ lotsInfo?.location }}
                    </p>
                    <p class="card-text">收費標準：{{ lotsInfo?.rateRules }}</p>
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
            <div class="col-lg-7">
              <div class="">
                <div class="ticket-form p-5">
                  <h2 class="text-dark text-uppercase mb-4">預約</h2>
                  <form method="post">
                    <div class="row g-4">
                      <div class="col-12">
                        <label for="licensePlate">選擇車牌：</label>
                        <select
                          v-model="selectedCarPlate"
                          class="form-control border-0 py-2"
                        >
                          <option
                            v-for="(car, index) in cars"
                            :key="index"
                            :value="car.licensePlate"
                          >
                            {{ car }}
                          </option>
                        </select>
                      </div>
                      <div class="col-12">
                        <!-- 使用 VueDatePicker 並綁定 v-model -->
                        <VueDatePicker
                          v-model="date"
                          class="form-control border-0"
                        />
                      </div>
                      <div class="col-12">
                        <button
                          type="button"
                          class="btn btn-primary w-100 py-2 px-5"
                          @click="submitRes"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </form>
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
.ticket-form {
  background: rgba(137, 177, 189, 0.979);
  border-radius: 10px;
}
</style>
