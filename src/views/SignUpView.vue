<template>
  <div>
    <main id="main">
      <!-- 麵包屑 -->
      <BreadcrumbsComponent>
        <template #title>
          <h2>Sign Up</h2>
        </template>
        <template #page>
          註冊
        </template>
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
                <p>
                  請輸入信箱及密碼
                </p>
              <form
                name="userData"
                id="registerForm"
                novalidate @submit.prevent="validate"
                class="php-email-form"
              >
              <div class="row gy-3">
                <div class="col-md-12 input-group" >
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
                <small v-if="!validity.emailRequired || !validity.emailFormat" class="text-danger">請輸入正確電子郵件格式</small><br>
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
                  <small v-if="validity.submitted && (!validity.licenseRequired || !validity.licenseFormat)" class="text-danger">請輸入正確車牌號碼格式<br>(英文三碼 數字四碼)例: ABC123</small>

                  <div class="col-md-12 input-group">
                    <input
                      type="password"
                      class="form-control"
                      name="psw"
                      v-model.trim="userData.psw"
                      placeholder="請輸入密碼"
                      required
                    />
                    <small v-if="validity.submitted && (!validity.pswRequired || !validity.pswFormat)" class="text-danger">請輸入正確密碼格式</small>
                  </div>
                  
                  <div class="col-md-12 text-center">
                    <div class="loading">Loading</div>
                    <div class="error-message"></div>
                    <div class="sent-message">
                      您已註冊成功!!
                    </div>

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

<style lang="css" scoped></style>

<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import { ref } from 'vue';

const BASE_URL = import.meta.env.VITE_API_BASEURL;
const API_URL = `${BASE_URL}/Customers`; 

//讀取Categories資料
const loadCategories = async()=>{
         const response = await fetch(API_URL)
         const datas = await response.json()
         console.log(datas)
                  
}
loadCategories();

const userData = ref({
    "psw": "",
    "useremail": "",
    "license": "",
    
});

const validity = ref({
    "emailRequired": true,
    "pswRequired": true,
    "licenseRequired": true,
    "pswFormat": true,
    "emailFormat": true,
    "licenseFormat": true,
    "submitted": false,
});

const emailRule = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const pswRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+]{8,}$/;
const licenseRule = /^[A-Z]{3}\d{4}$/;

const validate = async () => {
    //validity.value.submitted = true; // 設置提交狀態為真
    const { useremail, license, psw } = userData.value;

    validity.value.licenseRequired = license.length > 0;
    validity.value.pswRequired = psw.length > 0;
    validity.value.emailRequired = useremail.length > 0;

    validity.value.pswFormat = pswRule.test(psw);
    validity.value.emailFormat = emailRule.test(useremail);
    validity.value.licenseFormat = licenseRule.test(license);

    validity.value.isValid = validity.value.pswRequired && 
                             validity.value.emailRequired && 
                             validity.value.emailFormat && 
                             validity.value.pswFormat && 
                             validity.value.licenseRequired && 
                             validity.value.licenseFormat;

    if (validity.value.isValid) {
        // const formData = new FormData(document.userData);
        const data = {
            UserId: 0,  // 預設值，如果是自動生成的，可以忽略或設為 null
            Username: "Null",
            Password: userData.value.psw,
            Salt: "Null",  // 如果由伺服器生成，可以留空
            Email: userData.value.useremail,
            Phone: "Null",  // 如果不需要電話號碼，可以保持空值
            LicensePlate: userData.value.license
        };
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // 確保發送的是 JSON 格式
            },
            body: JSON.stringify(data) 
        });
        if (response.ok) {
            alert('註冊成功!!');
            window.location.href = '/';
        }
    }
};
</script>
