import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
    const isLogin = ref(false); // 初始登錄狀態
    const email = ref("");
    const token = ref("");

    // 用戶資訊
    const userId = ref(0);
    const username = ref("");
    const password = ref("");
    const salt = ref("");
    const phone = ref("");
    const licensePlate = ref("");

    const exit = ref(false);
    const message = ref("");

    // 登錄方法
    const login = () => {
        isLogin.value = true;
    };

    // 登出方法，清除所有資料
    const logout = () => {
        isLogin.value = false;
        userId.value = 0;
        username.value = "";
        password.value = "";
        salt.value = "";
        email.value = "";
        phone.value = "";
        licensePlate.value = "";
    };

    // 檢查是否已登錄
    const checkLoginStatus = () => {
        isLogin.value = !!true; // 如果本地存儲有用戶資料，設置為 true
    };

    // 更新用戶資料
    const updateUser = (data) => {
        userId.value = data.userId ?? userId.value;
        username.value = data.username ?? username.value;
        password.value = data.password ?? password.value;
        salt.value = data.salt ?? salt.value;
        email.value = data.email ?? email.value;
        phone.value = data.phone ?? phone.value;
        licensePlate.value = data.licensePlate ?? licensePlate.value;
        exit.value = data.exit ?? exit.value;
        message.value = data.message ?? message.value;
    };

    // 設定 Email
    const setEmail = (newEmail) => {
        email.value = newEmail;
    };

    // 設定 Token
    const setToken = (newToken) => {
        token.value = newToken;
    };

    // 清空 Email 和 Token
    const clear = () => {
        email.value = "";
        token.value = "";
    };

    return {
        isLogin,
        email,
        token,
        userId,
        username,
        password,
        salt,
        phone,
        licensePlate,
        exit,
        message,
        login,
        logout,
        checkLoginStatus,
        updateUser,
        setEmail,
        setToken,
        clear,
    };
},
    {
        persist: {
            enabled: true,
            storage: sessionStorage, // 使用 sessionStorage 來持久化數據
        },
    });
