import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import SearchParkingSpaceView from "./views/SearchParkingSpaceView.vue";
import GuideView from "./views/GuideView.vue";
import CustomerServiceView from "./views/CustomerServiceView.vue";
import CustomerCenterView from "./views/CustomerCenter/CustomerCenterView.vue";
import EditProfileView from "./views/CustomerCenter/EditProfileView.vue";
import ParkingOrderView from "./views/CustomerCenter/ParkingOrderView.vue";
import ParkingRecordView from "./views/CustomerCenter/ParkingRecordView.vue";
import CouponView from "./views/CustomerCenter/CouponView.vue";
import SignUpView from "./views/signUpView.vue";
import SignInView from "./views/SignInView.vue";
import NotFound from "./views/NotFound.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
    alias: "/home", //別名
  },
  {
    path: "/search",
    component: SearchParkingSpaceView,
    name: "search",
  },
  {
    path: "/guide",
    component: GuideView,
    name: "guide",
  },
  {
    path: "/Customer-Service",
    component: CustomerServiceView,
    name: "service",
  },
  {
    path: "/CustomerCenter",
    component: CustomerCenterView,
    name: "customer",
    children: [
      {
        path: "", // 空路徑表默認子路由
        component: EditProfileView, // 默認顯示資料修改畫面
        name: "edit-profile",
        alias: "/edit-profile", //別名
      },
      {
        path: "parking-order",
        component: ParkingOrderView,
        name: "parking-order",
      },
      {
        path: "parking-record",
        component: ParkingRecordView,
        name: "parking-record",
      },
      {
        path: "coupon",
        component: CouponView,
        name: "coupon",
      },

      // 其他子路由...
    ],
  },
  {
    path: "/signUp",
    component: SignUpView,
    name: "signUp",
  },
  {
    path: "/signIn",
    component: SignInView,
    name: "signIn",
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes, //名字一樣可以寫routes就好
});

export default router;
