<script setup>
import { ref } from "vue";

const API_URL = "https://localhost:7077/api";
const reservations = ref([]); //傳回的預訂資料放此
const search = ref("");

const loadReservations = async () => {
  const response = await fetch(`${API_URL}/Reservations?userId=1`);
  const datas = await response.json();
  reservations.value = datas;
  console.log(reservations.value);
};

const filterByLotName = async () => {
  if (search.value == "") {
    loadReservations();
  } else {
    const response = await fetch(
      `${API_URL}/Reservations/search/${search.value}?userId=1`
    );
    const datas = await response.json();
    reservations.value = datas;
    console.log(reservations.value);
  }
};

loadReservations();
</script>

<template>
  <div>
    <!-- ======= Features Section ======= -->
    <section id="features" class="features section-bg p-2">
      <div class="container" data-aos="fade-up">
        <!-- 導覽列 -->
        <ul class="nav nav-tabs row g-2 d-flex">
          <li class="nav-item col-3">
            <a
              class="nav-link active show"
              data-bs-toggle="tab"
              data-bs-target="#tab-1"
            >
              <h4>全部</h4>
            </a>
          </li>
          <!-- End tab nav item -->

          <li class="nav-item col-3">
            <a class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-2">
              <h4>已完成</h4>
            </a>
          </li>
          <!-- End tab nav item -->

          <li class="nav-item col-3">
            <a class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-3">
              <h4>已取消/逾時</h4>
            </a>
          </li>
          <!-- End tab nav item -->

          <li class="nav-item col-3">
            <a class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-4">
              <h4>Nostrum</h4>
            </a>
          </li>
          <!-- End tab nav item -->
        </ul>

        <div class="tab-content">
          <div class="tab-pane active show" id="tab-1">
            <div class="row">
              <div class="row">
                <!-- 選擇預訂期間 -->
                <div class="col-md-3">
                  <select
                    class="form-select form-select-sm mb-2"
                    aria-label=".form-select-sm example"
                  >
                    <option selected>所有預訂</option>
                    <option value="1">過去30天</option>
                    <option value="2">過去3個月</option>
                    <option value="3">過去1年</option>
                  </select>
                </div>
                <!-- 搜尋特定停車場 -->
                <div class="col-md-3 ms-auto">
                  <div class="input-group input-group-sm mb-3">
                    <input
                      v-model="search"
                      @keyup="filterByLotName"
                      type="text"
                      class="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder="查詢停車場"
                    />
                  </div>
                </div>
              </div>

              <div
                class="order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div
                  v-for="res in reservations"
                  :key="res.resId"
                  class="card mb-3"
                >
                  <div class="row g-0">
                    <div class="col-md-6 p-2">
                      <img
                        class="rounded"
                        width="100%"
                        :src="`https://maps.googleapis.com/maps/api/staticmap?center=${res.latitude},${res.longitude}&zoom=18&size=600x300&markers=color:red%7Clabel:P%7C${res.latitude},${res.longitude}&key=AIzaSyALBHIW2HQWkmhCK-VXqGIoTVttRvMTtXo`"
                        alt="Map of {{ res.lotName }}"
                      />

                      <!-- <img src="..." class="img-fluid rounded-start" alt="..." /> -->
                    </div>
                    <div class="col-md-6">
                      <div class="card-body">
                        <p style="text-align: right">{{ res.licensePlate }}</p>
                        <h5 class="card-title">{{ res.lotName }}</h5>

                        <p class="card-text">預訂時間：{{ res.resTime }}</p>
                        <p class="card-text">
                          <small v-if="res.isFinish" class="text-success"
                            ><i class="fa-regular fa-circle-check"></i>
                            已完成</small
                          >
                          <small
                            v-else-if="res.isCanceled"
                            class="text-secondary"
                            ><i class="fa-solid fa-xmark"></i> 已取消</small
                          >
                          <small v-else-if="res.isOverdue" class="text-danger"
                            ><i class="fa-solid fa-triangle-exclamation"></i>
                            逾時未進場</small
                          >
                        </p>
                        <div style="text-align: right">
                          <button type="button" class="btn btn-light">
                            <i class="fa-regular fa-calendar"></i> 重新預訂
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End tab content item -->

          <div class="tab-pane" id="tab-2">
            <div class="row">
              <div
                class="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center"
              >
                <h3>Neque exercitationem debitis</h3>
                <p class="fst-italic">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <ul>
                  <li>
                    <i class="bi bi-check2-all"></i> Ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </li>
                  <li>
                    <i class="bi bi-check2-all"></i> Duis aute irure dolor in
                    reprehenderit in voluptate velit.
                  </li>
                  <li>
                    <i class="bi bi-check2-all"></i> Provident mollitia neque
                    rerum asperiores dolores quos qui a. Ipsum neque dolor
                    voluptate nisi sed.
                  </li>
                  <li>
                    <i class="bi bi-check2-all"></i> Ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate trideta storacalaperda mastiro
                    dolore eu fugiat nulla pariatur.
                  </li>
                </ul>
              </div>
              <div class="col-lg-6 order-1 order-lg-2 text-center">
                <img
                  src="/src/assets/images/features-2.jpg"
                  alt=""
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
          <!-- End tab content item -->

          <div class="tab-pane" id="tab-3">
            <div class="row">
              <div
                class="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center"
              >
                <h3>Voluptatibus commodi accusamu</h3>

                <p class="fst-italic">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div class="col-lg-6 order-1 order-lg-2 text-center">
                <img
                  src="/src/assets/images/features-3.jpg"
                  alt=""
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
          <!-- End tab content item -->

          <div class="tab-pane" id="tab-4">
            <div class="row">
              <div
                class="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0 d-flex flex-column justify-content-center"
              >
                <h3>Omnis fugiat ea explicabo sunt</h3>
                <p class="fst-italic">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <ul>
                  <li>
                    <i class="bi bi-check2-all"></i> Ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </li>
                  <li>
                    <i class="bi bi-check2-all"></i> Duis aute irure dolor in
                    reprehenderit in voluptate velit.
                  </li>
                  <li>
                    <i class="bi bi-check2-all"></i> Ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate trideta storacalaperda mastiro
                    dolore eu fugiat nulla pariatur.
                  </li>
                </ul>
              </div>
              <div class="col-lg-6 order-1 order-lg-2 text-center">
                <img
                  src="/src/assets/images/features-4.jpg"
                  alt=""
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
          <!-- End tab content item -->
        </div>
      </div>
    </section>
    <!-- End Features Section -->
  </div>
</template>

<style lang="css" scoped></style>
