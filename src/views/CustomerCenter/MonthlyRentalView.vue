<script setup>
import { ref } from "vue";

const API_URL = "https://localhost:7077/api";
const activeButton = ref("current"); //目前在哪個頁面(當前合約還是歷史)
const monthlyRentals = ref([]);
const currentRental = ref([]);

const loadMonthlyRental = async () => {
  const response = await fetch(`${API_URL}/MonthlyRentals?userId=1`);
  const datas = await response.json();
  monthlyRentals.value = datas;
  const today = new Date();
  currentRental.value = monthlyRentals.value.filter((rental) => {
    return new Date(rental.endDate) > today;
  });
  console.log(currentRental.value.length);
};

const loadCurrent = async () => {
  activeButton.value = "current";
  console.log("current");
};

const loadHistory = async () => {
  activeButton.value = "history";
  console.log("history");
};

const formatDate = (date) => {
  const convertDate = new Date(date);
  return `${convertDate.getFullYear()}-${
    convertDate.getMonth() + 1
  }-${convertDate.getDate()}`;
};

loadMonthlyRental();
</script>

<template>
  <div>
    <div id="outside" class="container" data-aos="fade-up">
      <div class="d-flex justify-content-between">
        <div>
          <button
            class="list me-2"
            @click="loadCurrent"
            :class="{ active: activeButton == 'current' }"
          >
            <i class="fa-solid fa-paste"></i> 當前合約
          </button>
          <button
            class="list"
            @click="loadHistory"
            :class="{ active: activeButton == 'history' }"
          >
            <i class="fa-solid fa-clock-rotate-left"></i> 歷史合約
          </button>
        </div>
        <div>
          <select
            width="300px"
            class="form-select form-select-sm mb-2"
            aria-label=".form-select-sm example"
          >
            <option selected>車牌1</option>
            <option value="">車牌2</option>
          </select>
        </div>
      </div>

      <!-- <img id="noDataImg" src="/src/assets/images/Nodatas.webp" alt="No Data" /> -->

      <div class="accordion mt-2" id="accordionPanelsStayOpenExample">
        <!-- 至少要顯示一個 -->
        <div class="accordion-item">
          <h2
            v-if="currentRental.length"
            class="accordion-header"
            id="panelsStayOpen-headingOne"
          >
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              #{{ currentRental[0].renId }}
              {{ currentRental[0].lotName }}
              <span style="font-size: 14px">
                &nbsp (合約將於
                {{ formatDate(currentRental[0].endDate) }} 終止)</span
              >
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            class="accordion-collapse collapse show"
            aria-labelledby="panelsStayOpen-headingOne"
          >
            <div class="accordion-body">
              <div class="row">
                <div class="col-md-8"></div>
                <div class="col-md-4">
                  <img
                    class="rounded img-fluid"
                    :src="`https://maps.googleapis.com/maps/api/staticmap?center=${currentRental[0].latitude},${currentRental[0].longitude}&zoom=18&size=600x300&markers=color:red%7Clabel:P%7C${currentRental[0].latitude},${currentRental[0].longitude}&key=AIzaSyALBHIW2HQWkmhCK-VXqGIoTVttRvMTtXo`"
                    alt="Map of {{ currentRental[0].lotName }}"
                    style="width: 100%; height: 100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="(current, index) in currentRental"
          v-if="index !== 0"
          class="accordion-item"
        >
          <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo"
            >
              #{{ current.renId }}
              {{ current.lotName }}
              <span style="font-size: 14px">
                &nbsp (合約將於
                {{ formatDate(current.endDate) }} 終止)</span
              >
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            class="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingTwo"
          >
            <div class="accordion-body">
              <strong>This is the second item's accordion body.</strong> It is
              hidden by default, until the collapse plugin adds the appropriate
              classes that we use to style each element. These classes control
              the overall appearance, as well as the showing and hiding via CSS
              transitions. You can modify any of this with custom CSS or
              overriding our default variables. It's also worth noting that just
              about any HTML can go within the <code>.accordion-body</code>,
              though the transition does limit overflow.
            </div>
          </div>
        </div>
      </div>
      <div v-if="current in currentRental"></div>
    </div>
  </div>
</template>

<style lang="css" scoped>
#outside {
  box-shadow: -5px 0px 10px lightgrey;
  padding: 15px;
}

/* 當前合約&歷史合約按鈕 */
.list {
  background-color: #f8f9fa;
  color: gray;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 5px 10px;
}

/* 點擊按鈕時的狀態 */
.active {
  background-color: #f5c34e;
  color: rgb(255, 255, 255);
  border: none;
  box-shadow: 3px 3px 10px lightgray;
}

#noDataImg {
  width: 80%;
  height: 250px;
}
</style>
