<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore"; // 引入 pinia store

const authStore = useAuthStore();
const GET_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/info`;
const PUT_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/id`;

// Pinia store
const user = ref(authStore.user);

// 定義編輯模式狀態
const isEditing = ref(false);

// 加載用戶信息的函數
const loadUserInfo = async () => {
  // 檢查用戶是否已登入
  if (!authStore.isLogin) {
    alert("請先登入以便看用戶資訊");
    return;
  }

  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    alert("無此用戶");
    return;
  }

  const parsedUser = JSON.parse(storedUser);
  const userId = parsedUser.userId;
  const GET_TURL = `${GET_URL}${userId}`;

  try {
    const response = await fetch(GET_TURL);
    if (!response.ok) {
      throw new Error("讀取失敗");
    }

    const data = await response.json();
    authStore.updateUser(data);
  } catch (error) {
    alert("讀取失敗: " + error.message);
  }
};

// 切換編輯模式並更新用戶信息的函數
const toggleEdit = async () => {
  if (isEditing.value) {
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.userId;
    const PUT_TURL = `${PUT_URL}${userId}`;

    try {
      const response = await fetch(PUT_TURL, {
        method: "PUT",
        body: JSON.stringify(authStore.user),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("更新失敗");
      }
      authStore.updateUser(authStore.user); // 更新 Pinia store
      alert("用戶資料已成功更新");
    } catch (error) {
      alert("更新用戶資料失敗: " + error.message);
    }
  }
  isEditing.value = !isEditing.value; // 切換編輯模式
};

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
            <span v-if="!isEditing">{{ authStore.user.username }}</span>
            <input v-if="isEditing" v-model="authStore.user.username" />
          </div>
          <div class="form-group">
            <li class="">電話</li>
            <span v-if="!isEditing">{{ authStore.user.phone }}</span>
            <input v-if="isEditing" v-model="authStore.user.phone" />
          </div>
          <div class="form-group">
            <li>車牌</li>
            <span v-if="!isEditing">{{ authStore.user.licensePlate }}</span>
            <input v-if="isEditing" v-model="authStore.user.licensePlate" />
          </div>
          <div class="form-group">
            <li>密碼</li>
            <span v-if="!isEditing">***********</span>
            <input v-if="isEditing" v-model="authStore.user.password" />
          </div>
        </div>

        <div class="container col-12">
          <li>Email信箱</li>
          <span v-if="!isEditing">{{ authStore.user.email }}</span>
          <input v-if="isEditing" v-model="authStore.user.email" />
        </div>
      </ul>
      <a href="#" class="button-17" @click="toggleEdit">{{
        isEditing ? "保存" : "修改"
      }}</a>
    </div>
  </div>
</template>

<style lang="css" scoped>
.form-group {
}

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
