import Swal from "sweetalert2";

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
