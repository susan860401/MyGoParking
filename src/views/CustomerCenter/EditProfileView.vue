<script setup>
import { ref, onMounted } from "vue";
// import { useAuthStore } from "@/stores/authStore"; // 引入 pinia store
import { useUserStore } from "@/stores/userStore";

// const authStore = useAuthStore();
const userStore = useUserStore();

const GET_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/info`;
const PUT_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/id`;

// Pinia store
const user = {
 userId : userStore.userId,
 username : userStore.username,
 email : userStore.email,
 password : userStore.password,
 salt : userStore.salt,
 phone : userStore.phone,
 licensePlate : userStore.licensePlate,
}
 

// 定義編輯模式狀態
const isEditing = ref(false);
const isEditingPsw = ref(false);

// 加載用戶信息的函數
const loadUserInfo = async () => {
  // 檢查用戶是否已登入
  if (!userStore.isLogin) {
    alert("請先登入以便看用戶資訊");
    return;
  }

  const storedUser = userStore.userId;
  if (storedUser === 0) {
    alert("無此用戶");
    return;
  }

 
  const userId = userStore.userId;
  const GET_TURL = `${GET_URL}${userId}`;

  try {
    const response = await fetch(GET_TURL);
    if (!response.ok) {
      throw new Error("讀取失敗");
    }

    const data = await response.json();
    userStore.updateUser(data);
    } catch (error) {
    alert("讀取失敗: " + error.message);
    }
};

// 切換編輯模式並更新用戶信息的函數
const toggleEdit = async () => {
  if (isEditing.value) {
    const userId = userStore.userId;
    const PUT_TURL = `${PUT_URL}${userId}`;

    try {
      const response = await fetch(PUT_TURL, {
        method: "PUT",
        body: JSON.stringify(userStore.$state),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("更新失敗");
      }
      alert("用戶資料已成功更新");
    } catch (error) {
      alert("更新用戶資料失敗: " + error.message);
    }
  }
  isEditing.value = !isEditing.value; // 切換編輯模式
};


// const toggleEditPsw = async () => {
//   if (isEditingPsw.value) {
//     const userId = userStore.userId;
//     const PUT_TURL = `${PUT_URL}${userId}`;

//     try {
//       const response = await fetch(PUT_TURL, {
//         method: "PUT",
//         body: JSON.stringify(userStore.$state),
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) {
//         throw new Error("更新失敗");
//       }
//       alert("用戶密碼已成功更新");
//     } catch (error) {
//       alert("更新用戶資料失敗: " + error.message);
//     }
//   }
//   isEditingPsw.value = !isEditingPsw.value; // 切換編輯模式
// };
// 在組件掛載時加載用戶信息
onMounted(loadUserInfo);
</script>

<template>
  <div class="card">
    <div class="card-body">
      <ul v-if="user">
        <div class="container">
          <div class="form-group">
            <li>姓名</li>
            <span v-if="!isEditing">{{ userStore.username }}</span>
            <input v-if="isEditing" v-model="userStore.username" />
          </div>
          <div class="form-group">
            <li class="">電話</li>
            <span v-if="!isEditing">{{ userStore.phone }}</span>
            <input v-if="isEditing" v-model="userStore.phone" />
          </div>
          <div class="form-group">
            <li>車牌</li>
            <span v-if="!isEditing">{{ userStore.licensePlate }}</span>
            <input v-if="isEditing" v-model="userStore.licensePlate" />
          </div>
          <div class="form-group">
            <li>密碼</li>
            <span v-if="!isEditing">{{ userStore.password }}</span>
            <input v-if="isEditing" v-model="userStore.password" />
          </div>
        </div>

        <div class="container col-12">
          <li>Email信箱</li>
          <span v-if="!isEditing">{{ userStore.email }}</span>
          <input v-if="isEditing" v-model="userStore.email" />
        </div>
      </ul>
      <a href="#" class="button-17 me-3" @click="toggleEdit">{{
        isEditing ? "保存" : "修改"
      }}</a>
      <!-- <a class="button-17" @click="toggleEditPsw">{{
        isEditingPsw ? "密碼保存" : "密碼修改"
      }}</a> -->
    </div>
  </div>
</template>

<style lang="css" scoped>


.button-17 {
  align-items: center;
  appearance: none;
  background-color: #fff;
  border-radius: 24px;
  border-style: none;
  box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px,
    rgba(0, 0, 0, 0.14) 0 6px 10px 0, rgba(0, 0, 0, 0.12) 0 1px 18px 0;
  box-sizing: border-box;
  color: #3c4043;
  cursor: pointer;
  display: inline-flex;
  fill: currentcolor;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  justify-content: center;
  letter-spacing: 0.25px;
  line-height: normal;
  max-width: 100%;
  overflow: visible;
  padding: 2px 24px;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: auto;
  will-change: transform, opacity;
  z-index: 0;
}

.button-17:hover {
  background: #f1f1f1;
  color: #4f4f4f;
}

.button-17:active {
  box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%),
    0 8px 12px 6px rgb(60 64 67 / 15%);
  outline: none;
}

.button-17:focus {
  outline: none;
}

.button-17:not(:disabled) {
  box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
    rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
}

.button-17:not(:disabled):hover {
  box-shadow: rgba(60, 64, 67, 0.3) 0 2px 3px 0,
    rgba(60, 64, 67, 0.15) 0 6px 10px 4px;
}

.button-17:not(:disabled):focus {
  box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
    rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
}

.button-17:not(:disabled):active {
  box-shadow: rgba(60, 64, 67, 0.3) 0 4px 4px 0,
    rgba(60, 64, 67, 0.15) 0 8px 12px 6px;
}

.button-17:disabled {
  box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
    rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
}

span {
  align-items: center;
  appearance: none;
  background-color: #fff;
  border-radius: 24px;
  border-style: none;
  border: 1px solid #c6c6c6;
  box-sizing: border-box;
  color: #3c4043;
  display: inline-flex;
  fill: currentcolor;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  justify-content: center;
  letter-spacing: 0.25px;
  line-height: normal;
  max-width: 100%;
  overflow: visible;
  padding: 2px 24px;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  user-select: none;
  width: auto;
  will-change: transform, opacity;
  z-index: 0;
}
input {
  align-items: center;
  appearance: none;
  background-color: #fff;
  border-radius: 24px;
  border-style: none;
  border: 1px solid #c6c6c6;
  box-sizing: border-box;
  color: #3c4043;
  display: inline-flex;
  fill: currentcolor;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  justify-content: center;
  letter-spacing: 0.25px;
  line-height: normal;
  max-width: 100%;
  overflow: visible;
  padding: 2px 24px;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  user-select: none;
  width: auto;
  will-change: transform, opacity;
  z-index: 0;
}
</style>
