<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import router from "@/router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore"; // 引入 store

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const API_URL = `${BASE_URL}/Customers/sign`;
const GET_URL = `${BASE_URL}/Customers/login`;
const authStore = useAuthStore();




//modal form
const name = ref('');
const phone = ref('');

const submitMemberInfo = async () => {
  await authStore.updateMemberInfo(name.value, phone.value);
};


//隱藏按鈕
const hiddenButton = ref(null);

// 自動點擊的功能
const autoClick = () => {
  // 自動觸發隱藏按鈕的點擊事件
  if (hiddenButton.value) {
    hiddenButton.value.click();
  }
};


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
      autoClick();
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
  //console.log("GOOOO");
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
    // console.log("OKKKKKK");
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
    // if (data.Email != )
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
      if(result.message === "註冊成功!"){
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
    <!-- modal -->
      <!-- 隱藏的按鈕，點擊後顯示 Modal -->
      <button ref="hiddenButton" type="button" style="display: none;" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Open Modal</button>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">註冊成功! <P>填寫完整會員資訊即可取得三張優惠券!</P></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitMemberInfo">
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">姓名:</label>
                <input type="text" class="form-control" id="recipient-name">
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label">電話:</label>
                <input type="text" class="form-control" id="recipient-phone">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-17" data-bs-dismiss="modal">稍後在填</button>
            <button type="button" class="button-17"><i class="fa-solid fa-gift me-2" style="color: #f3c212;"></i>送出並領取優惠券</button>
          </div>
        </div>
      </div>  
    </div> 
    <!-- modal end -->
      </div>
</template>

<style lang="css" scoped>
      .button-17 {
        align-items: center;
        appearance: none;
        background-color: #fff;
        border-radius: 24px;
        border-style: none;
        box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px,
          rgba(0, 0, 0, 0.14) 0 6px 10px 0, rgba(0, 0, 0, 0.12) 0 1px 18px 0;
        box-sizing: border-box;
        color: #3c4043;
        cursor: pointer;
        display: inline-flex;
        fill: currentcolor;
        font-family: "Google Sans", Roboto, Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        height: 48px;
        justify-content: center;
        letter-spacing: 0.25px;
        line-height: normal;
        max-width: 100%;
        overflow: visible;
        padding: 2px 24px;
        position: relative;
        text-align: center;
        text-transform: none;
        transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),
          opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, 0.2, 1) 0ms;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        width: auto;
        will-change: transform, opacity;
        z-index: 0;
      }

      .button-17:hover {
        background: #f1f1f1;
        color: #4f4f4f;
      }

      .button-17:active {
        box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%),
          0 8px 12px 6px rgb(60 64 67 / 15%);
        outline: none;
      }

      .button-17:focus {
        outline: none;
      }

      .button-17:not(:disabled) {
        box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
          rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
      }

      .button-17:not(:disabled):hover {
        box-shadow: rgba(60, 64, 67, 0.3) 0 2px 3px 0,
          rgba(60, 64, 67, 0.15) 0 6px 10px 4px;
      }

      .button-17:not(:disabled):focus {
        box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
          rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
      }

      .button-17:not(:disabled):active {
        box-shadow: rgba(60, 64, 67, 0.3) 0 4px 4px 0,
          rgba(60, 64, 67, 0.15) 0 8px 12px 6px;
      }

      .button-17:disabled {
        box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
          rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
      }
</style>
