import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.min.js";
import "aos/dist/aos.css";
import "glightbox/dist/css/glightbox.min.css";
import "../node_modules/swiper/swiper-bundle.min.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// import "./assets/libs/purecounter/purecounter_vanilla.js";
// import "./assets/libs/php-email-form/validate.js";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.mount("#app");

export default pinia;
//serviceWorker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );
      console.log("Service Worker registered with scope:", registration.scope);

      // 確保 service worker 已經準備好
      const swRegistration = await navigator.serviceWorker.ready;
      console.log("Service Worker is ready:", swRegistration);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}
