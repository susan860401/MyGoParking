import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLogin: false, // 初始狀態
  }),
  actions: {
    login() {
      this.isLogin = true;
    },
    logout() {
      this.isLogin = false;
      localStorage.removeItem("user");
    },
    checkLoginStatus() {
      const user = localStorage.getItem("user");
      this.isLogin = !!user; // 如果有 user，則設置為 true，否則為 false
    },
  },
});