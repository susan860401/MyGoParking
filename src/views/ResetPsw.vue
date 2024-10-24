<script setup>
    import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
    import { useRoute } from 'vue-router';
    import { ref } from "vue";

    const API_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/reset`;

    const removeReadonly = (fieldId) => {
    document.getElementById(fieldId).removeAttribute('readonly');
    };

    const user = ref({
        email: ''
    });

    // 使用 `useRoute` 獲取路由參數中的 token
    const route = useRoute();
    const token = route.query.token; // 從路由 URL 中取得 token

    // 定義狀態
    const newPassword = ref('');

    // 定義方法
    const resetPassword = async () => {
    try {
        // 使用 fetch 發送 POST 請求
        const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            newPassword: newPassword.value
        })
        });

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert('密碼重設成功');
    } catch (error) {
        console.error('密碼重設失敗', error);
        alert('重置密碼過程中出錯');
    }
    };
</script>

<template>
    <div>
    <main id="main">
      <!-- 麵包屑 -->
      <BreadcrumbsComponent>
        <template #title>
          <h2>Reset Password</h2>
        </template>
        <template #page> 重設密碼 </template>
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
                @submit.prevent="resetPassword"
                action="forms/quote.php"
                method="post"
                class="php-email-form"
                autocomplete="off"
              >
                <h3>重設密碼</h3>
                <p>請輸入信箱</p>
                <div class="row gy-3">
                  <div class="col-md-12">
                    <input
                      type="email"
                      class="form-control"
                      name="emailField"
                      placeholder="請輸入Email帳號"
                      required
                      v-model="user.email"
                      id="emailField"
                      readonly
                    @focus="removeReadonly('emailField')"
                    />
                  </div>

                  <div class="col-md-12">
                    <input
                      type="password"
                      class="form-control"
                      name="pswField"
                      placeholder="請輸入新密碼"
                      required
                      v-model="newPassword"
                      id="pswField"
                      autocomplete="new-password"
                      readonly
                    @focus="removeReadonly('pswField')"
                    />
                  </div>

                  <div class="col-md-12 text-center">
                    <div class="loading">Loading</div>
                    <div class="error-message"></div>
                    <div class="sent-message">您已成功設置新密碼!</div>

                    <button type="submit">申請新密碼</button>
                  </div>
                </div>
                <div class="row">
                <div class="col-12">
                  
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