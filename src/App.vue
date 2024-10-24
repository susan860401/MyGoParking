<script setup>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "sweetalert2/dist/sweetalert2.min.js";
import "jquery/dist/jquery.min.js";

//模板css js檔
import "@/assets/main.css";
import "@/assets/theme.js";

import NavbarComponent from "./components/NavbarComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
</script>

<template>
  <div>
    <NavbarComponent></NavbarComponent>
    <RouterView></RouterView>
    <FooterComponent></FooterComponent>
  </div>
</template>

<style scoped></style>
