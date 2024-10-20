import "@fortawesome/fontawesome-free/css/all.min.css";
import "aos/dist/aos.css";
import "glightbox/dist/css/glightbox.min.css";
import "../node_modules/swiper/swiper-bundle.min.css";

// import "./assets/libs/purecounter/purecounter_vanilla.js";
// import "./assets/libs/php-email-form/validate.js";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
