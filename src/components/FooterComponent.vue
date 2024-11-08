<script setup>
import router from "@/router";
import Swal from "sweetalert2";
import { useUserStore } from "@/stores/userStore";
import { nextTick, onMounted } from "vue";
import { RouterLink } from "vue-router";

// API 基本路徑
const baseUrl = `${import.meta.env.VITE_API_BASEURL}`;
const userStore = useUserStore();

const reply = async () => {
  const userId = userStore.userId;
  let shouldScrollTop = false;
  try {
    // console.log(userStore.userId);
    if (userId === null || userId === "" || userId === 0) {
      await Swal.fire({
        title: "請先登入系統",
        icon: "error",
        showConfirmButton: true,
        showCancelButton: true,
        didDestroy: () => {
          if (shouldScrollTop) {
            window.scrollTo(0, 0);
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          shouldScrollTop = true;
          router.push("/signIn");
        }
      });
    } else {
      /* 舊版本, 我不知道有沒有要允許訪客回復 */
      /*
      const { value: formValues } = await Swal.fire({
      title: '意見回復',
      html:
        '<div class="row">' +
        '<div class="d-flex justify-content-evenly align-items-center align-content-center mb-3 row">' +
        '<div class="col-12 col-md-2"><label>姓名: </label></div><input id="name" class="swal2-input" style="width:70%;margin:0" placeholder="請輸入你的名字"></div>' +
        '<div class="d-flex justify-content-evenly align-items-center align-content-center mb-3 row">' +
        '<div class="col-12 col-md-2"><label>Email: </label></div><input id="email" class="swal2-input" style="width:70%;margin:0" placeholder="請輸入你的Email"></div>' +
        '<textarea id="reply_text" class="swal2-input form-control" style="height:300px;" placeholder="輸入你的意見"></textarea>' + // 修正 style 錯誤
        '</div>',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const input1 = document.getElementById('name').value;
        const input2 = document.getElementById('email').value;
        const input3 = document.getElementById('reply_text').value;
        if (!input1 || !input2 || !input3) {
          Swal.showValidationMessage('所有欄位都必須填寫');
          return null;
        }
        return [input1, input2, input3]; // 返回多個輸入值
      }
      });
      if (formValues) {
        const question_object = ({
          "Name":formValues[0],
          "Email":formValues[1],
          "question":formValues[2]
        })
        console.log(JSON.stringify(question_object));
        // Swal.fire(JSON.stringify(formValues));
      }
      */
      const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "意見回復",
        inputPlaceholder: "請輸入您的意見",
        inputAttributes: {
          "aria-label": "請在這輸入您的意見",
        },
        showCancelButton: true,
        preConfirm: () => {
          const inputValue = Swal.getInput().value; // 獲取當前的輸入值
          if (inputValue === null || inputValue === "") {
            Swal.showValidationMessage("請輸入您的意見");
            return null;
          }
        },
      });
      if (text) {
        const question = {
          UserId: userId,
          question: text,
        };
        try {
          const response = await fetch(`${baseUrl}/Survey`, {
            method: "POST",
            body: JSON.stringify(question),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            // console.log(data)
            if (data.status === "success") {
              Swal.fire({
                title: "感謝您的意見回覆",
                icon: "success",
                showConfirmButton: true,
              });
            }
          } else {
            Swal.fire({
              title: "傳送失敗",
              icon: "error",
              showConfirmButton: true,
            });
          }
        } catch (error) {
          Swal.fire({
            title: "傳送失敗",
            icon: "error",
            showConfirmButton: true,
          });
          // console.log(error)
        }
        //console.log(JSON.stringify(question));
      }
    }
  } catch {
    await Swal.fire({
      title: "請先登入系統",
      icon: "error",
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/signIn");
        window.scrollTo(0, 0);
      }
    });
  }
};

const redirected = async (viewName) => {
  const userId = userStore.userId;
  let shouldScrollTop = false;
  try {
    if (viewName === "/search") {
      await router.push("/search");
      window.scrollTo(0, 0); // 確保頁面跳轉後滾動
      return;
    } else if (userId === null || userId === "" || userId === 0) {
      await Swal.fire({
        title: "請先登入系統",
        icon: "error",
        showConfirmButton: true,
        showCancelButton: true,
        didDestroy: () => {
          if (shouldScrollTop) {
            window.scrollTo(0, 0);
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          shouldScrollTop = true;
          router.push("/signIn");
        }
      });
      return;
    } else if (viewName === "reservation" || viewName === "monthly") {
      Swal.fire({
        title: "使用提醒",
        icon: "info",
        text: "請先選擇您想申請該服務的停車場",
        didDestroy: () => {
          router.push("/search");
          nextTick();
          window.scrollTo(0, 0);
        },
      });
      return;
    } else {
      router.push(viewName);
      window.scrollTo(0, 0);
    }
  } catch (error) {
    console.log(error);
  }
};

const guide = () => {
  router
    .push("/guide")
    .then(() => {
      window.scrollTo(0, 0);
    })
    .catch((err) => {
      // console.log(err)
    });
};

onMounted(() => {
  const menu = document.querySelector(".menu");
  document.addEventListener("DOMContentLoaded", () => {
    // console.log(menu)
    togglescrollTop(menu);
  });
  window.addEventListener("scroll", () => {
    togglescrollTop(menu);
  });
  function togglescrollTop(menu) {
    // console.log('test')
    if (menu) {
      window.scrollY > 100
        ? (menu.style.opacity = "1")
        : (menu.style.opacity = "0");
    }
  }
});
</script>

<template>
  <!-- 可以互動的選單, 如果不喜歡可以不要 -->
  <nav class="menu" v-if="userStore.isLogin">
    <input
      type="checkbox"
      href="#"
      class="menu-open"
      name="menu-open"
      id="menu-open"
    />
    <label class="menu-open-button" for="menu-open">
      <span class="hamburger hamburger-1"></span>
      <span class="hamburger hamburger-2"></span>
      <span class="hamburger hamburger-3"></span>
    </label>
    <!-- <a title="搜尋停車場"  class="menu-item"> <i class="fa-solid fa-location-dot"></i> </a> -->
    <RouterLink
      :to="{ name: 'search' }"
      activeClass="active"
      title="搜尋停車場"
      class="menu-item"
    >
      <i class="fa-solid fa-location-dot"></i>
    </RouterLink>
    <RouterLink :to="{ name: 'customer' }" title="使用者中心" class="menu-item">
      <i class="fa-solid fa-user"></i>
    </RouterLink>
    <RouterLink :to="{ name: 'ChargeView' }" title="繳費" class="menu-item">
      <i class="fa-solid fa-dollar-sign"></i>
    </RouterLink>
    <a title="意見回覆" href="#" @click.prevent="reply" class="menu-item">
      <i class="fa fa-envelope"></i>
    </a>
  </nav>
  <!-- filters -->
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
      <filter id="shadowed-goo">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          result="goo"
        />
        <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
        <feColorMatrix
          in="shadow"
          mode="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2"
          result="shadow"
        />
        <feOffset in="shadow" dx="1" dy="1" result="shadow" />
        <feComposite in2="shadow" in="goo" result="goo" />
        <feComposite in2="goo" in="SourceGraphic" result="mix" />
      </filter>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          result="goo"
        />
        <feComposite in2="goo" in="SourceGraphic" result="mix" />
      </filter>
    </defs>
  </svg>
  <!-- scroll-top button 頁面往上的button-->
  <a
    :style="{
      opacity: userStore.isLogin ? 0 : 1,
      pointerEvents: userStore.isLogin ? 'none' : 'auto',
    }"
    href="#"
    class="scroll-top d-flex align-items-center justify-content-center"
    ><i class="bi bi-arrow-up-short"></i
  ></a>

  <!-- ======= Footer ======= -->
  <footer id="footer" class="footer">
    <div class="footer-content position-relative">
      <div class="container">
        <div class="row">
          <div class="col-lg-1"></div>
          <div class="col-lg-2">
            <img src="/logo.png" alt="" style="width: 150px" />
          </div>
          <div class="col-lg-3 col-md-12">
            <div class="footer-info">
              <h3>MyGO Parking</h3>
              <p>
                801高雄市前金區中正四路211號8號樓之1<br /><br />
                <strong>Phone:</strong> 07 969 9885<br />
                <strong>Email:</strong> example@example.com<br />
              </p>
              <div class="social-links d-flex mt-3">
                <a
                  href="#"
                  class="d-flex align-items-center justify-content-center"
                  ><i class="bi bi-twitter"></i
                ></a>
                <a
                  href="#"
                  class="d-flex align-items-center justify-content-center"
                  ><i class="bi bi-facebook"></i
                ></a>
                <a
                  href="#"
                  class="d-flex align-items-center justify-content-center"
                  ><i class="bi bi-instagram"></i
                ></a>
                <a
                  href="#"
                  class="d-flex align-items-center justify-content-center"
                  ><i class="bi bi-linkedin"></i
                ></a>
              </div>
            </div>
          </div>
          <!-- End footer info column-->

          <div class="col-lg-2 col-md-4 footer-links">
            <h4>服務項目</h4>
            <ul>
              <li>
                <a
                  href="#"
                  @click.prevent="redirected('/search')"
                  title="停車場搜尋"
                  >停車場搜尋</a
                >
              </li>
              <li>
                <a
                  href="#"
                  @click.prevent="redirected('reservation')"
                  title="預定車位"
                  >預定車位</a
                >
              </li>
              <li>
                <a
                  href="#"
                  @click.prevent="redirected('monthly')"
                  title="月租車位"
                  >月租車位</a
                >
              </li>
            </ul>
          </div>
          <!-- End footer links column-->

          <div class="col-lg-2 col-md-4 footer-links">
            <h4>其他功能</h4>
            <ul>
              <li>
                <a
                  href="#"
                  @click.prevent="redirected('/CustomerCenter')"
                  title="用戶中心"
                  >用戶中心</a
                >
              </li>
              <li>
                <a href="#" @click.prevent="guide()" title="使用教學"
                  >使用教學</a
                >
              </li>
            </ul>
          </div>
          <!-- End footer links column-->

          <div class="col-lg-2 col-md-4 footer-links">
            <h4>聯絡我們</h4>
            <ul>
              <li><a href="#" @click.prevent="reply">意見回復</a></li>
              <li><a href="#">客服功能</a></li>
            </ul>
          </div>
          <!-- End footer links column-->
        </div>
      </div>
    </div>

    <div class="footer-legal text-center position-relative">
      <div class="container">
        <!-- <div class="copyright">
            &copy; Copyright <strong><span>UpConstruction</span></strong
            >. All Rights Reserved
          </div> -->
        <div class="copyright">
          &copy; Copyright <strong><span>MyGoParking</span></strong
          >. All Rights Reserved
        </div>
        <div class="credits">
          <!-- All the links in the footer should remain intact. -->
          <!-- You can delete the links only if you purchased the pro version. -->
          <!-- Licensing information: https://bootstrapmade.com/license/ -->
          <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/upconstruction-bootstrap-construction-website-template/ -->
          <!-- Designed by
            <a href="https://bootstrapmade.com/">BootstrapMade</a> Distributed
            by <a href="https://themewagon.com">ThemeWagon</a> -->
        </div>
        <div class="credits">網頁最佳體驗大小:1920x1080px</div>
      </div>
    </div>
  </footer>
  <!-- End Footer -->

  <!-- 意見回復 -->
</template>

<style lang="css" scoped>
/* :root{
  --i:3;
} */

.menu-open {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  pointer-events: auto;
}

.menu-item {
  background: #feb900;
  border-radius: 100%;
  width: 50px;
  height: 50px;
  position: absolute;
  /* top: 20px; */
  bottom: 20px;
  right: 20px;
  color: white;
  text-align: center;
  line-height: 50px;
  transform: translate3d(0, 0, 0);
  transition: transform ease-out 200ms;
  pointer-events: auto;
}

@media (hover: none) and (pointer: coarse) {
  .menu-item:active {
    background: white;
    color: #333;
    touch-action: manipulation;
  }
}

/* 只在支援 hover 的設備上啟用懸停效果 */
@media (hover: hover) {
  .menu-item:hover {
    background: white;
    color: #333;
    touch-action: manipulation;
  }
}

.menu-item:nth-child(3) {
  transition-duration: 180ms;
}
.menu-item:nth-child(4) {
  transition-duration: 180ms;
}
.menu-item:nth-child(5) {
  transition-duration: 180ms;
}
.menu-item:nth-child(6) {
  transition-duration: 180ms;
}

.hamburger {
  width: 25px;
  height: 3px;
  background: white;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -12.5px;
  margin-top: -1.5px;
  transition: transform 200ms;
}

.hamburger-1 {
  transform: translate3d(0, -8px, 0);
}

.hamburger-2 {
  transform: translate3d(0, 0, 0);
}

.hamburger-3 {
  transform: translate3d(0, 8px, 0);
}

.menu-open:checked + .menu-open-button .hamburger-1 {
  transform: translate3d(0, 0, 0) rotate(45deg);
}

.menu-open:checked + .menu-open-button .hamburger-2 {
  transform: translate3d(0, 0, 0) scale(0.1, 1);
}

.menu-open:checked + .menu-open-button .hamburger-3 {
  transform: translate3d(0, 0, 0) rotate(-45deg);
}

.menu {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100px;
  height: 400px;
  box-sizing: border-box;
  font-size: 20px;
  text-align: left;
  filter: url("#shadowed-goo");
  z-index: 99999;
  pointer-events: none;
  transition: 0.3s;
}

.menu-open-button {
  background: #feb900;
  border-radius: 100%;
  width: 60px;
  height: 60px;
  position: absolute;
  bottom: 20px;
  right: 15px;
  color: white;
  text-align: center;
  line-height: 80px;
  transform: scale(1.1, 1.1) translate3d(0, 0, 0);
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-duration: 400ms;
  cursor: pointer;
  z-index: 2;
  pointer-events: auto;
}

.menu-open-button:hover {
  transform: scale(1.2, 1.2) translate3d(0, 0, 0);
}

.menu-open:checked + .menu-open-button {
  transition-timing-function: linear;
  transition-duration: 200ms;
  transform: scale(0.8, 0.8) translate3d(0, 0, 0);
}

.menu-open:checked ~ .menu-item:nth-child(3) {
  transition-duration: 190ms;
  transform: translate3d(0, -80px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(4) {
  transition-duration: 290ms;
  transform: translate3d(0, -160px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(5) {
  transition-duration: 390ms;
  transform: translate3d(0, -240px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(6) {
  transition-duration: 490ms;
  transform: translate3d(0, -320px, 0);
}

svg{
  position: fixed;
}
</style>
