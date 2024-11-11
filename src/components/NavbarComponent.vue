<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useCouponStore } from "@/stores/couponStore";

const router = useRouter();
const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 分鐘
let timeout;

//優惠視窗更新用

const userStore = useUserStore();
const route = useRoute();
const couponStore = useCouponStore();
const BASE_URL = import.meta.env.VITE_API_BASEURL;
const GET_TURL = `${BASE_URL}/Customers/id`;
//end

//pinia
const logout = () => {
  userStore.logout();
  sessionStorage.removeItem("hasVisited"); // 登出時清除 sessionStorage 中的標記
};

const resetTimeout = () => {
  clearTimeout(timeout);
  timeout = setTimeout(logout, TIMEOUT_DURATION);
};

onMounted(async () => {
  userStore.checkLoginStatus(); // 初始化時檢查登入狀態
  window.addEventListener("mousemove", resetTimeout);
  window.addEventListener("keypress", resetTimeout);
  resetTimeout(); // 初始化計時器
});

const searchQuery = ref("");
const searchInput = ref(null);
const SearchHandler = (searchQuery) => {
  if (searchQuery) {
    router.push({
      name: "search",
      query: { searchQuery: searchQuery },
    });
  }
};

const isSearch_barOpen = ref(false);

const handleBlur = (event) => {
  // 檢查當前失去焦點的元素是否為按鈕
  const relatedTarget = event.relatedTarget;
  // console.log(relatedTarget)
  if (!relatedTarget) {
    // console.log("blur", isSearch_barOpen.value);
    isSearch_barOpen.value = false;
  }
};

const enable_Search_bar = () => {
  if (isSearch_barOpen.value) {
    // console.log(searchQuery.value)
    SearchHandler(searchQuery.value);
    // 在猶豫按下去跳轉後這邊要關起來還是保持開著
    isSearch_barOpen.value = false;
  } else {
    // console.log("Focus", isSearch_barOpen.value);
    searchInput.value.focus();
    isSearch_barOpen.value = true;
  }
};

//優惠券視窗

// 監聽 userStore 中的 isRegisterSuccess 狀態變化
watch(
  () => userStore.isRegisterSuccess, // 監聽 store 中的變量
  (newValue) => {
    if (newValue) {
      // 當 isRegisterSuccess 變為 true 時，觸發按鈕點擊
      hiddenButton.value.click();
    }
  }
);

//隱藏按鈕
const hiddenButton = ref(null);
const closeForm = ref(null);

//modal form
const name = ref("");
const phone = ref("");

const autoClose = () => {
  if (closeForm.value) {
    closeForm.value.click();
  }
};

const updateMemberInfo = async () => {
  const userId = userStore.userId;
  const PUTT_TURL = `${GET_TURL}${userId}`;
  const pwd = route.query.pwd;

  const renew = {
    userId: userStore.userId,
    username: name.value,
    password: pwd,
    email: userStore.email,
    phone: phone.value,
    salt: "",
    licensePlate: userStore.licensePlate,
  };
  console.log(renew);
  const response = await fetch(PUTT_TURL, {
    method: "PUT",
    body: JSON.stringify(renew),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response);
  if (response.ok) {
    userStore.updateUser(renew);
    alert("會員資料已成功更新");
    await couponStore.addCoupon();
    //alert(couponStore.couponMessage);
    // console.log('mess');
    autoClose();
  } else {
    throw new Error("會員資料更新失敗");
  }
};

const submitMemberInfo = async () => {
  await updateMemberInfo();
};
</script>

<template>
  <!-- ======= Header ======= -->
  <header id="header" class="header d-flex align-items-center">
    <div
      id="test"
      class="container-fluid container-xl d-flex align-items-center justify-content-between"
    >
      <div style="display: inline-flex">
        <RouterLink
          class="nav-link logo d-flex align-items-center"
          activeClass="active"
          to="/"
        >
          <!-- Uncomment the line below if you also wish to use an image logo -->
          <!-- <img src="assets/img/logo.png" alt=""> -->
          <h1><img src="../images/logo_mygo.png" alt="" /><span></span></h1>
        </RouterLink>
        <div
          class="nav_search_bar"
          :class="{
            nav_search_bar_animation_forwards: isSearch_barOpen,
            nav_search_bar_animation_reverse: !isSearch_barOpen,
          }"
        >
          <a
            id="nav_search_bar_icon"
            href=""
            @click.prevent="enable_Search_bar"
            :class="{ nav_search_bar_icon_animation: isSearch_barOpen }"
            ><i
              id="nav_search_bar_icon_size"
              class="fa-solid fa-magnifying-glass fa-beat"
            ></i
          ></a>
          <input
            v-model="searchQuery"
            @blur="handleBlur"
            @keydown.enter.prevent="enable_Search_bar"
            type="text"
            ref="searchInput"
            class="nav_search_bar_input"
            :class="{
              nav_search_bar_input_animation_forwards: isSearch_barOpen,
              nav_search_bar_animation_reverse: !isSearch_barOpen,
            }"
            placeholder="搜尋停車場"
          />
        </div>
      </div>
      <i class="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
      <i class="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>
      <nav id="navbar" class="navbar">
        <ul>
          <li v-if="userStore.isLogin">
            <RouterLink class="nav-link" activeClass="active" to="/"
              >Home</RouterLink
            >
          </li>
          <!-- <li>
              <RouterLink
                class="nav-link"
                activeClass="active"
                :to="{ name: 'search' }"
                >查找停車位</RouterLink
              >
            </li> -->
          <li v-if="userStore.isLogin">
            <RouterLink
              class="nav-link"
              activeClass="active"
              :to="{ name: 'guide' }"
              >使用者教學及規範</RouterLink
            >
          </li>
          <li v-if="userStore.isLogin">
            <RouterLink
              class="nav-link"
              activeClass="active"
              :to="{ name: 'service' }"
              >客服中心</RouterLink
            >
          </li>
          <!-- 用戶中心選單 -->
          <li v-if="userStore.isLogin" class="dropdown">
            <RouterLink
              class="nav-link"
              activeClass="active"
              to="/CustomerCenter"
              ><span
                ><i class="fa-solid fa-bell fa-beat"></i><i> </i>用戶中心</span
              >
              <i class="bi bi-chevron-down dropdown-indicator"></i
            ></RouterLink>
            <ul>
              <li>
                <RouterLink
                  class="nav-link"
                  activeClass="active"
                  :to="{ name: 'edit-profile' }"
                  >用戶基本資訊</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  class="nav-link"
                  activeClass="active"
                  :to="{ name: 'parking-order' }"
                  >停車訂單查詢</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  class="nav-link"
                  activeClass="active"
                  :to="{ name: 'parking-record' }"
                  >停車紀錄查詢</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  class="nav-link"
                  activeClass="active"
                  :to="{ name: 'coupon' }"
                  >優惠券專區</RouterLink
                >
              </li>
            </ul>
          </li>
          <li>
            <RouterLink
              class="nav-link"
              activeClass="active"
              :to="{ name: 'ChargeView' }"
              >繳費</RouterLink
            >
          </li>
          <li v-if="!userStore.isLogin">
            <RouterLink
              class="nav-link"
              activeClass="active"
              :to="{ name: 'signUp' }"
              >註冊</RouterLink
            >
          </li>
          <li v-if="!userStore.isLogin">
            <RouterLink
              class="nav-link"
              activeClass="active"
              :to="{ name: 'signIn' }"
              >登入</RouterLink
            >
          </li>
          <li v-if="userStore.isLogin">
            <button class="button-17 ms-3 my-3" @click="logout">登出</button>
          </li>
        </ul>
      </nav>
      <!-- .navbar -->
    </div>
  </header>
  <!-- End Header -->
  <!-- modal -->
  <!-- 隱藏的按鈕，點擊後顯示 Modal -->
  <button
    ref="hiddenButton"
    type="button"
    style="display: none"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    data-bs-whatever="@mdo"
  >
    Open Modal
  </button>

  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            註冊成功!
            <p>填寫完整會員資訊即可取得三張優惠券!</p>
          </h5>
          <button
            ref="closeForm"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="recipient-name" class="col-form-label">姓名:</label>
              <input
                name="name"
                type="text"
                class="form-control"
                id="recipient-name"
                v-model="name"
                placeholder="請輸入姓名"
              />
            </div>
            <div class="mb-3">
              <label for="message-text" class="col-form-label">電話:</label>
              <input
                name="phone"
                type="text"
                class="form-control"
                id="recipient-phone"
                v-model="phone"
                placeholder="請輸入電話"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="button-17" data-bs-dismiss="modal">
            稍後再填
          </button>
          <button type="button" class="button-17" @click="submitMemberInfo">
            <i class="fa-solid fa-gift me-2" style="color: #f3c212"></i
            >送出並領取優惠券
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- modal end -->
</template>

<style lang="css" scoped>
.nav_search_bar {
  margin-left: 3px;
  align-content: center;
  width: 0;
  /* background-color: aqua; */
  transition: width 3s;
}

.nav_search_bar_input {
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  width: 0;
  border: 1px;
  outline: none;
  transition: width 3s;
}

.nav_search_bar_animation_forwards,
.nav_search_bar_input_animation_forwards {
  width: 20vmin;
  transition: width 0.3s ease;
}

.nav_search_bar_animation_reverse,
.nav_search_bar_input_animation_reverse {
  width: 0;
  transition: width 0.3s ease;
  overflow: hidden;
}

#nav_search_bar_icon {
  position: absolute;
  display: inline-block;
  transition: 0.3s ease-in-out;
}

.nav_search_bar_icon_animation {
  transform: translateX(21vmin);
}

#nav_search_bar_icon_size {
  font-size: 3vmin;
  color: rgb(226, 183, 43);
}

@keyframes searchbar {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(15vmin);
  }
}

/* modal button */
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
