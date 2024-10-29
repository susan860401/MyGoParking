<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import router from "@/router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore"; // 引入 store

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const API_URL = `${BASE_URL}/Customers/sign`;
const GET_URL = `${BASE_URL}/Customers/login`;
const authStore = useAuthStore();


//讀取資料
// const loadUsers = async () => {
//   const response = await fetch(API_URL);
//   const datas = await response.json();
//   console.log(datas);
// };
// loadUsers();

const autoLogin = async () => {
  const getting = localStorage.getItem("user")
  const user = JSON.parse(getting);
  const email = user.Email;
  const password = user.Password;
  const loginData = {
    Email: email,
    Password: password
  };

  const response = await fetch(GET_URL, {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: {
      "Content-Type": "application/json",
    },

  });

  if (response.ok) {
    const data = await response.json();
    if (data.exit) {
      // 成功登入時更新 Pinia 狀態
      localStorage.setItem("user", JSON.stringify(data)); // 儲存用戶資訊
      authStore.login(); // 更新登入狀態
      alert(data.message); // 提示成功訊息
      router.push("/"); // 導向主頁
    } else {
      // 登入失敗處理
      alert(data.message); // 顯示失敗訊息
    }
  } else {
    alert("登入失敗");
  }
};



const userData = ref({
  psw: "",
  useremail: "",
  license: "",
  message: ""
});

const validity = ref({
  emailRequired: true,
  pswRequired: true,
  licenseRequired: true,
  pswFormat: true,
  emailFormat: true,
  licenseFormat: true,
  submitted: false,
});

const emailRule = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const pswRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+]{8,}$/;
const licenseRule = /^[A-Z]{3}\d{4}$/;

const validate = async () => {
  console.log("GOOOO");
  //validity.value.submitted = true; // 設置提交狀態為真
  const { useremail, license, psw } = userData.value;

  validity.value.licenseRequired = license.length > 0;
  validity.value.pswRequired = psw.length > 0;
  validity.value.emailRequired = useremail.length > 0;

  validity.value.pswFormat = pswRule.test(psw);
  validity.value.emailFormat = emailRule.test(useremail);
  validity.value.licenseFormat = licenseRule.test(license);

  validity.value.isValid =
    validity.value.pswRequired &&
    validity.value.emailRequired &&
    validity.value.emailFormat &&
    validity.value.pswFormat &&
    validity.value.licenseRequired &&
    validity.value.licenseFormat;

  if (validity.value.isValid) {
    console.log("OKKKKKK");
    // const formData = new FormData(document.userData);
    const data = {
      UserId: 0, // 預設值，如果是自動生成的，可以忽略或設為 null
      Username: "Null",
      Password: userData.value.psw,
      Salt: "Null", // 如果由伺服器生成，可以留空
      Email: userData.value.useremail,
      Phone: "Null", // 如果不需要電話號碼，可以保持空值
      LicensePlate: userData.value.license,
    };
    console.log(data);
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json", // 確保發送的是 JSON 格式
      },

    });
    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      alert(result.message);
      await autoLogin(); // 註冊成功後自動登入
    }
    else {
      alert("此帳號已註冊!");
    }
  }
};
</script>

<template>
  <div>
    <main id="main">
      <!-- 麵包屑 -->
      <BreadcrumbsComponent>
        <template #title>
          <h2>Sign Up</h2>
        </template>
        <template #page> 註冊 </template>
      </BreadcrumbsComponent>

      <!-- ======= Get Started Section ======= -->
      <section id="get-started" class="get-started section-bg">
        <div class="container">
          <div class="row justify-content-between gy-4">
            <div class="col-lg-6 d-flex align-items-center" data-aos="fade-up">
              <div class="content">
                <h3>Minus hic non reiciendis ea possimus at quia.</h3>
                <p>
                  Rem id rerum. Debitis deserunt quidem delectus expedita
                  ducimus dolor. Aut iusto ipsa. Eos ipsum nobis ipsa soluta
                  itaque perspiciatis fuga ipsum perspiciatis. Eum amet fugiat
                  totam nisi possimus ut delectus dicta.
                </p>
                <p>
                  Aliquam velit deserunt autem. Inventore et saepe. Tenetur
                  suscipit eligendi labore culpa eos. Deserunt porro magni qui
                  necessitatibus dolorem at animi cupiditate.
                </p>
              </div>
            </div>

            <div class="col-lg-5" data-aos="fade">
              <h3>註冊</h3>
              <p>請輸入信箱及密碼</p>
              <form name="userData" id="registerForm" novalidate @submit.prevent="validate" class="php-email-form">
                <div class="row gy-3">
                  <div class="col-md-12 input-group">
                    <input type="email" class="form-control" name="useremail" v-model.trim="userData.useremail"
                      placeholder="請輸入Email帳號" id="email" required />
                  </div>
                  <small v-if="!validity.emailRequired || !validity.emailFormat"
                    class="text-danger">請輸入正確電子郵件格式</small><br />
                  <div class="col-md-12 input-group">
                    <input type="text" class="form-control" name="license" v-model.trim="userData.license"
                      placeholder="請輸入車牌號碼" required />
                  </div>
                  <small v-if="
                    validity.submitted &&
                    (!validity.licenseRequired || !validity.licenseFormat)
                  " class="text-danger">請輸入正確車牌號碼格式<br />(英文三碼 數字四碼)例:
                    ABC123</small>

                  <div class="col-md-12 input-group">
                    <input type="password" class="form-control" name="psw" v-model.trim="userData.psw"
                      placeholder="請輸入密碼" required />
                    <small v-if="
                      validity.submitted &&
                      (!validity.pswRequired || !validity.pswFormat)
                    " class="text-danger">請輸入正確密碼格式</small>
                  </div>

                  <div class="col-md-12 text-center">
                    <div class="loading">Loading</div>
                    <div class="error-message"></div>
                    <div class="sent-message">您已註冊成功!!</div>

                    <button type="submit">註冊</button>
                  </div>
                </div>
              </form>
            </div>
            <!-- End Quote Form -->
          </div>
        </div>
      </section>
      <!-- End Get Started Section -->
    </main>
    <!-- Vertically centered modal -->
    <!-- <div class="modal-dialog modal-dialog-centered"> -->
    <!-- 感謝註冊會員! 到用戶中心填寫詳細資料即可獲取3張優惠券~ -->
    <!-- </div> -->
  </div>
</template>

<style lang="css" scoped></style>
