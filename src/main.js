import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.min.js";
import "aos/dist/aos.css";
import "glightbox/dist/css/glightbox.min.css";
import "../node_modules/swiper/swiper-bundle.min.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// import "./assets/libs/purecounter/purecounter_vanilla.js";
// import "./assets/libs/php-email-form/validate.js";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();
import { createPinia } from "pinia";
app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.mount("#app");
