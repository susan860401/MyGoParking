import router from "@/router";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    const isLogin = ref(false); // 初始登錄狀態
    const isRegisterSuccess = ref(false);
    const email = ref("");
    // 用戶資訊
    const userId = ref(0);
    const username = ref("");
    const phone = ref("");
    const licensePlate = ref("");

    const exit = ref(false);
    const message = ref("");

    // const isCouponClaimed = ref(false);// 是否已領取優惠券
    // const isProfileComplete = computed(() => {
    //   username.value !== null && phone.value !== null;
    // });

    // 登錄方法
    const login = () => {
      isLogin.value = true;
      localStorage.setItem("isLogin", true);
    };

    // 登出方法，清除所有資料
    const logout = () => {
      isLogin.value = false;
      userId.value = 0;
      username.value = "";
      email.value = "";
      phone.value = "";
      licensePlate.value = "";
      exit.value = false;
      message.value = "";
      isRegisterSuccess.value = false;
      localStorage.removeItem("isLogin");
      alert("已登出");
      router.push("/");
    };

    const checkLoginStatus = () => {
      // 從 localStorage 中檢查是否有登入狀態
      const storedIsLogin = localStorage.getItem("isLogin");
      if (storedIsLogin !== null) {
        isLogin.value = true;
      } else {
        isLogin.value = false;
      }
    };

    // 更新用戶資料
    const updateUser = (data) => {
      userId.value = data.userId ?? userId.value;
      username.value = data.username ?? username.value;
      email.value = data.email ?? email.value;
      phone.value = data.phone ?? phone.value;
      licensePlate.value = data.licensePlate ?? licensePlate.value;
      exit.value = data.exit ?? exit.value;
      message.value = data.message ?? message.value;
    };


    return {
      isLogin,
      email,
      userId,
      username,
      phone,
      licensePlate,
      exit,
      message,
      isRegisterSuccess,
      // isCouponClaimed,
      // isProfileComplete,
      login,
      logout,
      checkLoginStatus,
      updateUser,
    };
  },
  {
    persist: {
      enabled: true,
      storage: localStorage,
    },
    strategies: [
      {
        key: "user",
        storage: localStorage,
        paths: ["isLogin", "isRegisterSuccess", "userId"], // 僅持久化這些非敏感資料
      },
    ],
  }
);
