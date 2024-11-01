<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import router from "@/router";

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const API_URL = `${BASE_URL}/Customers/sign`;
const GET_URL = `${BASE_URL}/Customers/login`;


const userStore = useUserStore();



const autoLogin = async () => {
  const email = userStore.email;
  const password = userStore.password;
  const loginData = {
    email,
    password
  }
  const response = await fetch(GET_URL, {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: {
      "Content-Type": "application/json",
    },

  });

  if (response.ok) {
    const data = await response.json();
    if (data.exit) {//若已登入
      userStore.updateUser(data);
      userStore.login();
      alert(data.message); // 提示成功訊息
      userStore.isRegisterSuccess = true;
      router.push("/");
    } 
    else if (!data.exit)
    {
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
    const data = {
      userId: 0, // 預設值，如果是自動生成的，可以忽略或設為 null
      username: "Null",
      password: userData.value.psw,
      salt: "Null", // 如果由伺服器生成，可以留空
      email: userData.value.useremail,
      phone: "Null", // 如果不需要電話號碼，可以保持空值
      licensePlate: userData.value.license,
    };
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json", // 確保發送的是 JSON 格式
      },

    });
    if (response.ok) {
      const result = await response.json();
      if (result.message === "註冊成功!") {
        alert(result.message);
        userStore.updateUser(data);
        await autoLogin(); // 註冊成功後自動登入
      }
      else {
        alert(result.message);
      }
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
                  <small v-if="!validity.licenseRequired || !validity.licenseFormat" class="text-danger">請輸入(英文三碼
                    數字四碼)例:
                    ABC123</small>

                  <div class="col-md-12 input-group">
                    <input type="password" class="form-control" name="psw" v-model.trim="userData.psw"
                      placeholder="請輸入密碼" required />
                  </div>
                  <small v-if="!validity.pswRequired || !validity.pswFormat" class="text-danger">請輸入正確密碼格式</small>

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
    
  </div>
</template>

<style lang="css" scoped>

</style>
