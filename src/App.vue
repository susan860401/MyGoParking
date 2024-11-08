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
import { useUserStore } from "./stores/userStore";
//import { checkReminder } from "./js/com";

//let intervalId;
const userStore = useUserStore();

//建立Signal連接
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`https://localhost:7077/reservationHub?userId=${userStore.userId}`, {
    withCredentials: true,
  })
  .withAutomaticReconnect() //自動重連
  .build();

const startSignalRConnnection = async () => {
  try {
    await connection
      .start()
      .then(function () {
        console.log("Hub 連線完成");
      })
      .catch(function (err) {
        alert("連線錯誤: " + err.toString());
      });
  } catch (error) {
    console.error("無法建立 SignalR 連接:", error);
  }
};
//接收事件
connection.on("ReceiveNotification", (title, message) => {
  console.log("ReceiveNotification");
  console.log(title, message);
  // 如果通知權限允許，顯示瀏覽器通知
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "/logo.png", // 替換成你的圖示路徑
    });
  }
});
// connection.on("UserConnected", function (msg) {
//   console.log(msg);
// });

onMounted(async () => {
  await startSignalRConnnection();
  //輪洵(polling)很爛
  //intervalId = setInterval(checkReminder, 1 * 60 * 1000);
});
onBeforeUnmount(async () => {
  connection.stop();
  //if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <NavbarComponent></NavbarComponent>
  <RouterView></RouterView>
  <FooterComponent></FooterComponent>
</template>

<style scoped></style>
