  <script setup>
  import { ref, onMounted } from "vue";
  import { useAuthStore } from "@/stores/authStore"; // 引入 pinia store

  const authStore = useAuthStore(); 
  //const GET_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/info`;
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
      // const userId = parsedUser.userId;
      // const PUT_TURL = `${PUT_URL}${userId}`;

      try {
        const response = await fetch(PUT_URL, {
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
    <div class="">
      <h2>用戶基本資訊</h2>
      <hr>
      <div class="card" style="width: 53rem;">
      <div class="card-body">
        <h5 class="card-title">Welcome {{ authStore.user.username }}</h5>
        <ul v-if="user">
          <li>姓名 <span v-if="!isEditing">{{ authStore.user.username }}</span><input v-if="isEditing" v-model="authStore.user.username" /></li>
          
          <li>電話 <span v-if="!isEditing">{{ authStore.user.phone }}</span> <input v-if="isEditing" v-model="authStore.user.phone" /></li>
          <li>Email信箱 <span v-if="!isEditing">{{ authStore.user.email }}</span> <input v-if="isEditing" v-model="authStore.user.email" /></li>
          <li>車牌 <span v-if="!isEditing">{{ authStore.user.licensePlate }}</span> <input v-if="isEditing" v-model="authStore.user.licensePlate" /></li>
          <li>密碼 <span v-if="!isEditing">{{ authStore.user.password }}</span> <input v-if="isEditing" v-model="authStore.user.password" /></li>
        </ul>     
            <a href="#" class="btn btn-dark" @click="toggleEdit">{{ isEditing ? '保存' : '修改' }}</a>
      </div>
    </div>
    </div>
  </template>

  <style lang="css" scoped></style>
