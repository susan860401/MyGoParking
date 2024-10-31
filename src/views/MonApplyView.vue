<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import { getUserCarPlate, getUserData } from "@/js/com";
import { useUserStore } from "@/stores/userStore";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const lotId = route.query.lotId;
const lotName = route.query.lotName;
const BASE_URL = import.meta.env.VITE_API_BASEURL;

//form submit
const username = ref("");
const email = ref("");
const phone = ref("");
const cars = ref([]);
const selectedCarPlate = ref("");
const user = useUserStore();
const now = new Date();
const localDate = new Date(
  now.getTime() - now.getTimezoneOffset() * 60000
).toISOString();

const newMonApply = async () => {
  try {
    const apply = {
      userId: user.userId,
      lotId: lotId,
      licensePlate: selectedCarPlate?.value,
      lotName: lotName,
      applyDate: localDate,
    };
    console.log(apply);
    const res = await fetch(`${BASE_URL}/MonthlyRentals/newMonApplyList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apply),
    });
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      Swal.fire({
        icon: "success",
        text: data.message,
        showConfirmButton: true,
      });
      router.push("/");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "錯誤",
      text: "資料錯誤!",
    });
  }
};

onMounted(async () => {
  if (user.userId) {
    await getUserData(user.userId, username, email, phone);
  }
  console.log(user.userId);
  await getUserCarPlate(cars);
});
</script>

<template>
  <main id="main">
    <BreadcrumbsComponent
      backgroundImage="/MonApply.jpg"
      :breadcrumbs="[
        { name: 'Home', link: '/' },
        { name: 'GoParkingMap', link: '/search' },
        {
          name: '預約 & 月租',
          link: `/resmon?lotId=${lotId}&lotName=${lotName}`,
        },
      ]"
    >
      <template #title>
        <!-- 插入到 title 插槽 -->
        <h2>Reservation & MonthlyRental</h2>
      </template>
      <template #page>
        <!-- 插入到 page 插槽 -->
        月租申請表
      </template>
    </BreadcrumbsComponent>
  </main>
  <section>
    <div id="container">
      <h1>&bull; MonthlyRental Apply &bull;</h1>
      <h5>月租申請表單</h5>
      <div class="underline"></div>
      <div class="icon_wrapper">
        <svg
          class="icon"
          fill="#000000"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="64px"
          height="64px"
          viewBox="0 0 31.446 31.446"
          xml:space="preserve"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <g>
                <path
                  d="M5.034,8.776c0.149,0.021,0.34,0.032,0.554,0.032c0.959,0,1.78-0.234,2.333-0.757c0.425-0.405,0.66-1.002,0.66-1.705 c0-0.704-0.309-1.3-0.769-1.662C7.334,4.3,6.621,4.109,5.619,4.109c-0.991,0-1.694,0.063-2.193,0.149v7.085h1.608V8.776z M5.034,5.398c0.116-0.032,0.339-0.064,0.67-0.064c0.809,0,1.267,0.395,1.267,1.055c0,0.735-0.532,1.172-1.395,1.172 c-0.234,0-0.404-0.011-0.543-0.043L5.034,5.398L5.034,5.398z"
                ></path>
                <path
                  d="M1.999,13.565h8.008c1.013,0,1.834-0.821,1.834-1.834V3.722c0-1.013-0.821-1.834-1.834-1.834H1.999 c-1.013,0-1.834,0.821-1.834,1.834v8.009C0.165,12.744,0.987,13.565,1.999,13.565z M1.614,3.831c0-0.273,0.222-0.495,0.495-0.495 h7.789c0.273,0,0.495,0.222,0.495,0.495v7.79c0,0.272-0.222,0.495-0.495,0.495H2.109c-0.273,0-0.495-0.222-0.495-0.495V3.831z"
                ></path>
                <path
                  d="M7.592,23.151c-1.77,0-3.203,1.434-3.203,3.203c0,1.771,1.434,3.204,3.203,3.204c1.768,0,3.203-1.434,3.203-3.204 C10.795,24.585,9.36,23.151,7.592,23.151z M7.592,27.321c-0.532,0-0.968-0.434-0.968-0.967s0.436-0.967,0.968-0.967 c0.531,0,0.966,0.434,0.966,0.967S8.123,27.321,7.592,27.321z"
                ></path>
                <path
                  d="M30.914,23.729l-0.525-4.262c-0.102-0.818-0.817-1.418-1.642-1.373L27.6,18.157l-3.565-3.211 c-0.343-0.309-0.787-0.479-1.249-0.479l-7.241-0.001c-1.625,0-3.201,0.555-4.468,1.573l-4.039,3.247l-5.433,1.356 c-0.698,0.175-1.188,0.802-1.188,1.521v1.565C0.187,23.729,0,23.916,0,24.146v2.071c0,0.295,0.239,0.534,0.534,0.534h3.067 c-0.013-0.133-0.04-0.26-0.04-0.396c0-2.226,1.804-4.029,4.03-4.029c2.226,0,4.029,1.804,4.029,4.029 c0,0.137-0.028,0.264-0.041,0.396h8.494c-0.013-0.133-0.04-0.26-0.04-0.396c0-2.226,1.804-4.029,4.029-4.029 c2.227,0,4.029,1.804,4.029,4.029c0,0.137-0.027,0.264-0.041,0.396h2.861c0.295,0,0.534-0.239,0.534-0.534v-1.953 C31.449,23.969,31.209,23.729,30.914,23.729z M20.167,18.491l-10.102,0.512l1.934-1.555c1.051-0.846,2.357-1.306,3.706-1.306 h4.462V18.491z M21.846,18.405v-2.262h0.657c0.228,0,0.447,0.084,0.616,0.237l2.062,1.856L21.846,18.405z"
                ></path>
                <path
                  d="M24.064,23.151c-1.77,0-3.203,1.434-3.203,3.203c0,1.771,1.435,3.204,3.203,3.204s3.203-1.434,3.203-3.204 C27.268,24.585,25.832,23.151,24.064,23.151z M24.064,27.321c-0.532,0-0.967-0.434-0.967-0.967s0.435-0.967,0.967-0.967 c0.531,0,0.967,0.434,0.967,0.967S24.596,27.321,24.064,27.321z"
                ></path>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <form @submit.prevent="newMonApply" id="contact_form">
        <div class="name">
          <label for="name"></label>
          <input
            type="text"
            name="name"
            id="name"
            required
            v-model="username"
          />
        </div>
        <div class="email">
          <label for="email"></label>
          <input
            type="email"
            name="email"
            id="email_input"
            v-model="email"
            required
          />
        </div>
        <div class="telephone">
          <label for="phone"></label>
          <input
            type="text"
            name="telephone"
            id="phone"
            v-model="phone"
            required
          />
        </div>
        <div class="telephone">
          <label for="licensePlate"></label>
          <select
            v-model="selectedCarPlate"
            class="form-control"
            id="licensePlate"
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
        <div class="submit mt-3">
          <input type="submit" value="寄出" id="form_button" />
        </div>
      </form>
      <!-- // End form -->
    </div>
    <p class="d-flex justify-content-center">
      <i class="fa-solid fa-star-of-life"></i
      >寄出後將會在月租空位釋放時進行抽籤決定，本公司保留最終決定權。
    </p>
    <!-- // End #container -->
  </section>
</template>

<style lang="css" scoped>
@import url(https://fonts.googleapis.com/css?family=Montserrat:400,700);

html {
  font-family: "Montserrat", Arial, sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

body {
  background: #f2f3eb;
}

button {
  overflow: visible;
}

button,
select {
  text-transform: none;
}

button,
input,
select,
textarea {
  color: #5a5a5a;
  font: inherit;
  margin: 0;
}

input {
  line-height: normal;
}

textarea {
  overflow: auto;
}

#container {
  border: solid 3px #474544;
  max-width: 768px;
  margin: 60px auto;
  position: relative;
}

form {
  padding: 37.5px;
  margin: 50px 0;
}

h1 {
  color: #474544;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 7px;
  text-align: center;
  text-transform: uppercase;
}
h5 {
  color: #474544;
  font-weight: 700;
  letter-spacing: 7px;
  text-align: center;
  text-transform: uppercase;
}

.underline {
  border-bottom: solid 2px #474544;
  margin: -0.512em auto;
  width: 80px;
}

.icon_wrapper {
  margin: 50px auto 0;
  width: 100%;
}

.icon {
  display: block;
  fill: #474544;
  height: 50px;
  margin: 0 auto;
  width: 50px;
}

.email {
  float: right;
  width: 45%;
}

input[type="text"],
[type="email"],
select,
textarea {
  background: none;
  border: none;
  border-bottom: solid 2px #474544;
  color: #474544;
  font-size: 1em;
  font-weight: 400;
  letter-spacing: 1px;
  margin: 0em 0 1.875em 0;
  padding: 0 0 0.875em 0;
  text-transform: uppercase;
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -ms-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}

input[type="text"]:focus,
[type="email"]:focus,
textarea:focus {
  outline: none;
  padding: 0 0 0.875em 0;
}

.message {
  float: none;
}

.name {
  float: left;
  width: 45%;
}

select {
  background: url("https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-arrow-down-32.png")
    no-repeat right;
  outline: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}

select::-ms-expand {
  display: none;
}

.subject {
  width: 100%;
}

.telephone {
  width: 100%;
}

textarea {
  line-height: 150%;
  height: 150px;
  resize: none;
  width: 100%;
}

::-webkit-input-placeholder {
  color: #474544;
}

:-moz-placeholder {
  color: #474544;
  opacity: 1;
}

::-moz-placeholder {
  color: #474544;
  opacity: 1;
}

:-ms-input-placeholder {
  color: #474544;
}

#form_button {
  background: none;
  border: solid 2px #474544;
  color: #474544;
  cursor: pointer;
  display: inline-block;
  font-family: "Helvetica", Arial, sans-serif;
  font-size: 0.875em;
  font-weight: bold;
  outline: none;
  padding: 20px 35px;
  text-transform: uppercase;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -ms-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}

#form_button:hover {
  background: #474544;
  color: #f2f3eb;
}

@media screen and (max-width: 768px) {
  #container {
    margin: 20px auto;
    width: 95%;
  }
}

@media screen and (max-width: 480px) {
  h1 {
    font-size: 26px;
  }

  .underline {
    width: 68px;
  }

  #form_button {
    padding: 15px 25px;
  }
}

@media screen and (max-width: 420px) {
  h1 {
    font-size: 18px;
  }

  .icon {
    height: 35px;
    width: 35px;
  }

  .underline {
    width: 53px;
  }

  input[type="text"],
  [type="email"],
  select,
  textarea {
    font-size: 0.875em;
  }
}
</style>
