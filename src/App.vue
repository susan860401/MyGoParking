<script setup>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "sweetalert2/dist/sweetalert2.min.js";
import "jquery/dist/jquery.min.js";
import * as signalR from "@microsoft/signalr";

//模板css js檔
import "@/assets/main.css";
import "@/assets/theme.js";

import NavbarComponent from "./components/NavbarComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { checkReminder, requestNotificationPermission } from "./js/com";
import { useUserStore } from "./stores/userStore";
let intervalId;
const connection = ref(null); // 保存 SignalR 連接
const notifications = ref([]); // 保存收到的通知

//慢慢測試
const startSignalRConnection = async () => {
  connection.value = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:7077/reservationHub")
    .withAutomaticReconnect() //自動連線
    .build();

  //處裡來自後端訊息
  connection.value.on("ReceiveNotification", (title, message) => {
    notifications.value.push({ title, message });

    // 如果通知權限已經授予，則顯示通知
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/logo.png",
      });
    }
  });

  try {
    await connection.value.start();
    console.log("SignalR 已連接");
  } catch (err) {
    console.error("SignalR 連接失敗:", error);
  }
};

onMounted(async () => {
  const user = useUserStore();
  console.log(user.userId);
  //輪洵(polling)很爛
  intervalId = setInterval(checkReminder, 10 * 60 * 1000);
  // startSignalRConnection();
  // requestNotificationPermission();
});
onBeforeUnmount(async () => {
  if (intervalId) clearInterval(intervalId);
  // if (connection.value) {
  //   await connection.value.stop();
  //   console.log("SignalR 連接已停止");
  // }
});
</script>

<template>
  <div>
    <NavbarComponent></NavbarComponent>
    <RouterView></RouterView>
    <FooterComponent></FooterComponent>
  </div>
</template>

<style scoped></style>
