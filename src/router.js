import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import SearchParkingSpaceView from "./views/SearchParkingSpaceView.vue";
import GuideView from "./views/GuideView.vue";
import CustomerServiceView from "./views/CustomerServiceView.vue";
import CustomerCenterView from "./views/CustomerCenter/CustomerCenterView.vue";
import EditProfileView from "./views/CustomerCenter/EditProfileView.vue";
import SetLicensePlateView from "./views/CustomerCenter/SetLicensePlateView.vue";
import ParkingOrderView from "./views/CustomerCenter/ParkingOrderView.vue";
import ParkingRecordView from "./views/CustomerCenter/ParkingRecordView.vue";
import CouponView from "./views/CustomerCenter/CouponView.vue";
import SignInView from "./views/SignInView.vue";
import NotFound from "./views/NotFound.vue";
import MonthlyRentView from "./views/MonthlyRentView.vue";
import SignUpView from "./views/SignUpView.vue";
import ParkingDetailView from "./views/CustomerCenter/ParkingDetailView.vue";
import MonthlyConfirmView from "./views/MonthlyConfirmView.vue";
import ResetPsw from "./views/ResetPsw.vue";
import ResMonRentService from "./views/ResMonRentService.vue";

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
    path: "/MonthlyRent",
    component: MonthlyRentView,
    name: "MonthlyRent",
  },
  {
    path: "/MonthlyConfirm",
    component: MonthlyConfirmView,
    name: "MonthlyConfirm",
  },
  {
    path: "/CustomerCenter",
    redirect: { name: "edit-profile" }, // 進入 /customer 時自動跳轉到 /customer/edit-profile
    component: CustomerCenterView,
    name: "customer",
    children: [
      {
        path: "edit-profile", // 空路徑表默認子路由
        component: EditProfileView, // 默認顯示資料修改畫面
        name: "edit-profile",
      },
      {
        path: "set-licensePlate", // 空路徑表默認子路由
        component: SetLicensePlateView, // 默認顯示資料修改畫面
        name: "set-plate",
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
        path: "parking-record/:id", //動態路由
        component: ParkingDetailView,
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
    path: "/reset",
    component: ResetPsw,
    name: "reset",
    props: (route) => ({ token: route.query.token }), // 取得 token
  },
  {
    path: "/resmon",
    component: ResMonRentService,
    name: "resmon",
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
