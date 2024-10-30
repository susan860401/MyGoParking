import Swal from "sweetalert2";
const BASE_URL = import.meta.env.VITE_API_BASEURL;

export const getUserCarPlate = async (cars) => {
  try {
    const userId = JSON.parse(localStorage.getItem("user")).userId;
    const res = await fetch(
      `https://localhost:7077/api/Reservations/GetUserCarPlate?userId=${userId}`
    );
    if (res.ok) {
      const data = await res.json();
      cars.value = data.carId.map((id, index) => ({
        carId: id,
        licensePlate: data.userCarPlate[index],
      }));
      console.log(cars.value);
    } else {
      throw new Error("無法取得車輛資料");
    }
  } catch (error) {
    console.error("Error：", error);
  }
};

//抓用戶資料帶入表單
export const getUserData = async (userId, username, email, phone) => {
  try {
    const res = await fetch(
      `https://localhost:7077/api/Customers/info${userId}`
    );
    if (res.ok) {
      const data = await res.json();
      //console.log(data);
      username.value = data.username;
      email.value = data.email;
      phone.value = data.phone;
    } else {
      console.error("無法獲取用戶資料");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "錯誤",
      text: "資料錯誤",
    });
  }
};

export const checkReminder = async () => {
  const user = JSON.parse(localStorage.getItem("user")).userId;
  //console.log(user);
  const res = await fetch(
    `${BASE_URL}/Notification/CheckAndSendOverdueReminder?userId=${user}`
  );
  if (res.status === 204) {
    console.log("沒有新通知");
  }
  if (res.ok) {
    const data = await res.json();
    //console.log("Data received:", data);
    console.log("通知發送成功");
    // 定義顯示通知的函數
    data.forEach(async (n) => {
      const showNotification = () => {
        new Notification(n.title, {
          body: n.message,
          icon: "/logo.png", // 確保此路徑正確
        });
      };
      // 使用 Notification API 顯示推播通知
      if (Notification.permission === "granted") {
        showNotification();
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          showNotification();
        }
      }
    });
  } else {
    console.error("通知請求失敗", response.statusText);
  }
};
