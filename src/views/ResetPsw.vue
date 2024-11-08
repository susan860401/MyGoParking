<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
// import { useUserStore } from "@/stores/userStore";

const API_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/reset`;

// const userStore = useUserStore();

const route = useRoute();
const router = useRouter();
const token = route.query.token; // 從 URL 取得 JWT token

// 定義本地變數來存放密碼資料
const newPassword = ref("");
const confirmPassword = ref("");
const message = ref("");
const error = ref("");
const isLoading = ref(false);
// 密碼格式驗證正則表達式
const passwordRule =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+]{8,}$/;

// 提交重設密碼表單的函式
const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = "密碼與確認密碼不一致";
    return;
  }

  if (!passwordRule.test(newPassword.value)) {
    error.value = "密碼格式不符合要求，需包含大小寫字母及數字，且至少8位";
    return;
  }

  isLoading.value = true;
  error.value = "";
  message.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token, // 使用者的重設密碼 token
        newPassword: newPassword.value, // 使用者輸入的新密碼
      }),
    });

    if (!response.ok) {
      throw new Error("重設密碼失敗，請稍後再試。");
    }

    const result = await response.json();
    message.value = result.message || "密碼已成功重設！";
    setTimeout(() => {
      router.push("/signIn"); // 重設密碼成功後跳轉到登入頁面
    }, 2000); // 等待2秒後自動跳轉
  } catch (err) {
    error.value = err.message || "重設密碼過程中出錯";
  } finally {
    isLoading.value = false;
  }
};

// const user = {
//   email: "",
//   password: "",
// };

// const resetPassword = async () => {
//   const response = await fetch(API_URL, {
//     method: "POST",
//     body: JSON.stringify(user),
//     headers: { "Content-Type": "application/json" },
//   });
//   if (response.ok) {
//     const datas = await response.json(); // 取得會員資訊
//     if (datas.message === "登入成功") {
//       // 成功登入時，儲存資料並更新 Pinia 狀態
//       userStore.updateUser(datas);
//       userStore.login(); // 更新登入狀態
//       alert("登入成功!!");
//       router.push("/search");
//     } else if (datas.message === "無此帳號") {
//       alert("無此帳號,請重新登入!!");
//     } else {
//       alert("登入失敗,請重新登入!!");
//     }
//   }
// };
</script>

<template>
  <main id="main">
    <!-- 麵包屑 -->
    <BreadcrumbsComponent>
      <template #title>
        <h2>Sign In</h2>
      </template>
      <template #page> 忘記密碼 </template>
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
                登入後，您將能夠：<br />
                查看與管理預訂：隨時查看您已預訂的車位，或進行修改與取消。<br />
                -即時通知：接收車位可用性提醒，確保您不會錯過任何機會。<br />
                -更新個人資料：輕鬆管理車輛資訊與聯絡方式，確保停車場快速識別您的車輛。<br />
                -專屬會員優惠：登入後可查看最新的停車優惠與促銷活動，節省更多停車費用。<br /><br />
              </p>
            </div>
          </div>

          <div class="col-lg-5" data-aos="fade">
            <form
              @submit.prevent="resetPassword"
              action="forms/quote.php"
              method="post"
              class="php-email-form"
            >
              <h3>設置新密碼</h3>
              <p>輸入新密碼並確認</p>
              <div class="row gy-3">
                <div class="col-md-12">
                  <input
                    class="form-control"
                    type="password"
                    id="new-password"
                    v-model="newPassword"
                    placeholder="輸入新密碼"
                    required
                  />
                </div>

                <div class="col-md-12">
                  <input
                    class="form-control"
                    type="password"
                    id="confirm-password"
                    v-model="confirmPassword"
                    placeholder="再次輸入新密碼"
                    required
                  />
                </div>

                <div class="col-md-12 text-center">
                  <div class="loading">Loading</div>
                  <div class="error-message"></div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <hr class="mt-5 mb-4 border-secondary-subtle" />
                  <div
                    class="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center"
                  >
                    <button type="submit" :disabled="isLoading">
                      重設密碼
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <p v-if="message" class="message">{{ message }}</p>
            <p v-if="error" class="error">{{ error }}</p>
          </div>
          <!-- End Quote Form -->
        </div>
      </div>
    </section>
    <!-- End Get Started Section -->
  </main>
</template>

<style lang="css" scoped></style>
