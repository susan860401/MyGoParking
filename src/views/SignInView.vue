<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import router from "@/router";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";

const API_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/login`;
const API_FURL = `${import.meta.env.VITE_API_BASEURL}/Customers/forgot`;
const userStore = useUserStore();

const user = {
  email: "",
  password: "",
};

const send = async () => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const datas = await response.json(); // 取得會員資訊
    if (datas.message === "登入成功") {
      // 成功登入時，儲存資料並更新 Pinia 狀態
      userStore.updateUser(datas);
      userStore.login(); // 更新登入狀態
      alert("登入成功!!");
      router.push("/search");
    } else if (datas.message === "無此帳號") {
      alert("無此帳號,請重新登入!!");
    } else {
      console.log("非登入狀態");
      //alert("登入失敗,請重新登入!!");
    }
  }
};

//忘記密碼
const message = ref('');
const error = ref('');

const sendResetLink = async ()=>{
      message.value = '';
      error.value = '';

      try {
        const response = await fetch(API_FURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (!response.ok) {
          throw new Error('發送失敗，請稍後再試。');
        }

        const result = await response.json();
        message.value = result.message || '重設密碼的連結已發送至您的 Email';
      } catch (err) {
        error.value = err.message || '發送過程中出錯';
      }
    };

</script>

<template>
  <div>
    <main id="main">
      <!-- 麵包屑 -->
      <BreadcrumbsComponent>
        <template #title>
          <h2>Sign In</h2>
        </template>
        <template #page> 登入 </template>
      </BreadcrumbsComponent>

      <!-- ======= Get Started Section ======= -->
      <section id="get-started" class="get-started section-bg">
        <div class="container">
          <div class="row justify-content-between gy-4">
            <div class="col-lg-6 d-flex align-items-center" data-aos="fade-up">
              <div class="content">
                <h3>歡迎回到我們的停車場平台</h3>
                <p>
                  透過登入帳戶，您可以快速存取個人停車資訊，管理車位預訂，並享受專屬會員優惠。只需輸入您的電子郵件和密碼，即可隨時隨地輕鬆掌握您的停車動態。
                </p>

                <p>
                  登入後，您將能夠：<br>
                  查看與管理預訂：隨時查看您已預訂的車位，或進行修改與取消。<br>
                  -即時通知：接收車位可用性提醒，確保您不會錯過任何機會。<br>
                  -更新個人資料：輕鬆管理車輛資訊與聯絡方式，確保停車場快速識別您的車輛。<br>
                  -專屬會員優惠：登入後可查看最新的停車優惠與促銷活動，節省更多停車費用。<br><br>
                  如果您還沒有帳戶，歡迎先前往註冊頁面創建帳戶，開始享受便捷的停車服務！
                </p>
              </div>
            </div>

            <div class="col-lg-5" data-aos="fade">
              <form
                @submit.prevent="send"
                action="forms/quote.php"
                method="post"
                class="php-email-form"
              >
                <h3>登入</h3>
                <p>請輸入信箱及密碼</p>
                <div class="row gy-3">
                  <div class="col-md-12">
                    <input
                      type="email"
                      class="form-control"
                      name="email"
                      placeholder="請輸入Email帳號"
                      required
                      v-model="user.email"
                      id="email"
                    />
                  </div>

                  <div class="col-md-12">
                    <input
                      type="password"
                      class="form-control"
                      name="psw"
                      placeholder="請輸入密碼"
                      v-model="user.password"
                      id="password"
                    />
                  </div>

                  <div class="col-md-12 text-center">
                    <div class="loading">Loading</div>
                    <div class="error-message"></div>
                    <div class="sent-message">您已成功登入!</div>

                    <button type="submit">登入</button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <hr class="mt-5 mb-4 border-secondary-subtle" />
                    <div
                      class="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center"
                    >
                      <RouterLink
                        :to="{ name: 'signUp' }"
                        class="link-secondary text-decoration-none">註冊新帳號
                      </RouterLink>
                      <button class="btn-none" :disabled="isLoading" @click="sendResetLink">忘記密碼</button>
                    </div>                 
                  </div>            
                </div>
              </form>
                  <p v-if="message">{{ message }}</p>
                  <p v-if="error">{{ error }}</p>
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
.btn-none{
  border: 0;
  background-color: #fff;
  color: #4f4f4f;
}
</style>
