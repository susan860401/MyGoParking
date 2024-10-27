<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import router from "@/router";
import { ref } from "vue";

const API_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/login`;

const user = ref({
  email: "",
  password: "",
});

const send = async () => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(user.value),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const datas = await response.json(); //取得會員資訊
    localStorage.setItem("user", JSON.stringify(datas));
    console.log(datas);
    if (datas.message === "登入成功") {
      alert("登入成功!!");
      router.push("/");
    } else if (datas.message === "無此帳號") {
      alert("無此帳號,請重新登入!!");
    } else {
      alert("登入失敗,請重新登入!!");
    }
  }
};
const testSendNotification = async () => {
  try {
    const res = await fetch("https://localhost:7077/api/Notification/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Title: "測試通知標題",
        Message: "這是測試通知內容",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log("通知發送成功");
      // 使用 Notification API 顯示推播通知
      if (Notification.permission === "granted") {
        new Notification(data.title, {
          body: data.body,
          icon: "/logo.png", // 請確認此路徑是否正確
        });
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification(data.title, {
            body: data.body,
            icon: "/logo.png",
          });
        }
      }
    } else {
      console.error("通知發送失敗", response.statusText);
    }
  } catch (error) {
    console.error("發送通知時出錯", error);
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
                      required
                      v-model="user.password"
                      id="password"
                    />
                  </div>

                  <div class="col-md-12 text-center">
                    <div class="loading">Loading</div>
                    <div class="error-message"></div>
                    <div class="sent-message">您已成功登入!</div>

                    <button type="submit" @click="exitUser">登入</button>
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
                        class="link-secondary text-decoration-none"
                        >註冊新帳號</RouterLink
                      >
                      <RouterLink
                        :to="{ name: 'reset' }"
                        class="link-secondary text-decoration-none"
                        >忘記密碼</RouterLink
                      >
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <!-- End Quote Form -->
          </div>
          <button @click="testSendNotification">測試推播通知</button>
        </div>
      </section>
      <!-- End Get Started Section -->
    </main>
  </div>
</template>

<style lang="css" scoped></style>
