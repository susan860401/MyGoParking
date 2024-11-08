<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import router from "@/router";

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const API_URL = `${BASE_URL}/Customers/sign`;
const GET_URL = `${BASE_URL}/Customers/login`;

const userStore = useUserStore();

const autoLogin = async (password) => {
  const email = userStore.email;
  // const password = userStore.password;
  const loginData = {
    email,
    password, // 使用註冊時提供的密碼
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
      //若已登入
      userStore.updateUser(data);
      userStore.login();
      alert(data.message); // 提示成功訊息
      userStore.isRegisterSuccess = true;
      router.push({ name: "search", query: { pwd: userData.value.psw } }); // 跳轉到首頁
    } else if (!data.exit) {
      // 登入失敗處理
      alert(data.message); // 顯示失敗訊息
    }
  } else {
    alert("登入失敗");
  }
};

const userData = ref({
  psw: "",
  salt: "",
  useremail: "",
  license: "",
  message: "",
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
const licenseRule = /^(\d{4}[A-Z]{2}|[A-Z]{3}\d{4})$/;

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
      salt: userData.value.salt, // 如果由伺服器生成，可以留空
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
        const password = userData.value.psw;
        await autoLogin(password); // 確保使用者輸入的密碼
        // await autoLogin(); // 註冊成功後自動登入
      } else {
        alert(result.message);
      }
    }
  }
};
</script>

<template>
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
              <h3>歡迎註冊我們的停車場服務</h3>
              <p>
                在我們的停車場平台，註冊過程簡單快速，只需幾步即可完成。通過註冊，您將能夠輕鬆管理您的停車需求，享受以下便利服務：
              </p>
              <p>
                方便預訂車位：提前預訂，確保無論何時何地都有車位等您。<br />
                -車輛資訊管理：儲存您的車牌資訊，快速進入停車場，免去排隊煩惱。<br />
                -專屬優惠：註冊會員可享有不定期的停車優惠及專屬活動。<br />
                -即時通知：掌握最新的停車場資訊與車位狀況，無需擔心滿位問題。<br /><br />
                立即點擊註冊，輸入您的車牌號碼、聯絡方式及其他基本資料，即可成為我們的尊貴會員，開始享受更輕鬆便捷的停車體驗！
              </p>
            </div>
          </div>

          <div class="col-lg-5" data-aos="fade">
            <form
              name="userData"
              id="registerForm"
              novalidate
              @submit.prevent="validate"
              class="php-email-form"
            >
              <h3>註冊</h3>
              <p>請輸入信箱及密碼</p>
              <div class="row gy-3">
                <div class="col-md-12 input-group">
                  <input
                    type="email"
                    class="form-control"
                    name="useremail"
                    v-model.trim="userData.useremail"
                    placeholder="請輸入Email帳號"
                    id="email"
                    required
                  />
                </div>
                <small
                  v-if="!validity.emailRequired || !validity.emailFormat"
                  class="text-danger"
                  >請輸入正確電子郵件格式</small
                ><br />
                <div class="col-md-12 input-group">
                  <input
                    type="text"
                    class="form-control"
                    name="license"
                    v-model.trim="userData.license"
                    placeholder="請輸入車牌號碼"
                    required
                  />
                </div>
                <small
                  v-if="!validity.licenseRequired || !validity.licenseFormat"
                  class="text-danger"
                  >請輸入(英文三碼 數字四碼/數字四碼 英文兩碼)例:
                  ABC123、1234UK</small
                >

                <div class="col-md-12 input-group">
                  <input
                    type="password"
                    class="form-control"
                    name="psw"
                    v-model.trim="userData.psw"
                    placeholder="請輸入密碼"
                    required
                  />
                </div>
                <small
                  v-if="!validity.pswRequired || !validity.pswFormat"
                  class="text-danger"
                  >請輸入正確密碼格式(8位數，要包含大小寫英文及數字)</small
                >

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
</template>

<style lang="css" scoped></style>
