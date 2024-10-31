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

//let intervalId;
const notifications = ref([]); // 保存收到的通知

//建立Signal連接
const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7077/reservationHub", {
    withCredentials: true,
  })
  .withAutomaticReconnect() //自動重連
  .build();

const startSignalRConnnection = async () => {
  try {
    await connection.start();
    console.log("SignalR Connected");

    //接收事件
    connection.on("ReceiveNotification", (title, message) => {
      notifications.value.push({ title, message });

      // 如果通知權限允許，顯示瀏覽器通知
      if (Notification.permission === "granted") {
        new Notification(title, {
          body: message,
          icon: "/logo.png", // 替換成你的圖示路徑
        });
      }
    });
  } catch (error) {
    console.error("無法建立 SignalR 連接:", error);
  }
};

onMounted(async () => {
  startSignalRConnnection();
  //輪洵(polling)很爛
  //intervalId = setInterval(checkReminder, 10 * 60 * 1000);
});
onBeforeUnmount(async () => {
  connection.stop();
  //if (intervalId) clearInterval(intervalId);
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
