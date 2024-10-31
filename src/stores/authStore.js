import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    email: '',
    token: '',
    isLogin: false, // 初始登錄狀態
    user: {
      userId: 0,
      username: "",
      password: "",
      salt: "",
      email: "",
      phone: "",
      licensePlate: ""
    },
  }),
  actions: {
    login() {
      this.isLogin = true;
      localStorage.getItem("user");
      localStorage.getItem("info");
    },
    logout() {
      this.isLogin = false;
      this.user = { userId: null, username: "", phone: "", email: "", licensePlate: "", password: "" }; // 重置用戶資料
      localStorage.removeItem("user"); // 刪除本地用戶資料
      localStorage.removeItem("info");
    },
    checkLoginStatus() {
      const user = localStorage.getItem("user");
      this.isLogin = !!user; // 如果有用戶資料，設置為 true
    },
    // 更新用戶資料的方法
    updateUser(data) {
      this.user = { ...this.user, ...data }; // 更新用戶資料
      console.log(this.user);
      localStorage.setItem("user", JSON.stringify(this.user)); // 更新本地存儲中的用戶資料
      localStorage.setItem("info", JSON.stringify(this.user)); 
    },
    setEmail(email) {
      this.email = email;
    },
    setToken(token) {
      this.token = token;
    },
    clear() {
      this.email = '';
      this.token = '';
    },
    persist: {
      enabled: true,
      storage: localStorage, // 使用localStorage來存儲資料
    },
  }
});