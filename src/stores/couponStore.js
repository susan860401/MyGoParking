import { defineStore } from "pinia";
import { useUserStore } from "./userStore";

export const useCouponStore = defineStore("couponStore", {
  state: () => ({
    coupons: [], // 儲存領取到的優惠券
  }),
  actions: {
    async addCoupon() {
      const userStore = useUserStore();
      try {
        const BASE_URL = import.meta.env.VITE_API_BASEURL;
        const ADD_URL = `${BASE_URL}/Customers/coupon`;
        const couponData = {
          couponId: 0,
          couponCode: "787878",
          discountAmount: 50,
          validFrom: "2024-01-01T00:00:00",
          validUntil: "2024-12-01T00:00:00",
          isUsed: false,
          userId: userStore.userId,
        };

        const response = await fetch(ADD_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(couponData),
        });
        const result = await response.json();
        console.log(result);
        if (response.ok) {
          if (result.success === true) {
            alert(result.message);
            // userStore.isCouponClaimed = true;
          } else if (
            result.success === false &&
            result.message === "領取失敗,您尚未註冊或登入"
          ) {
            alert(result.message);
          } else if (
            result.success === false &&
            result.message === "領取失敗, 請洽客服人員"
          ) {
            alert(result.message);
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    },
  },
});
