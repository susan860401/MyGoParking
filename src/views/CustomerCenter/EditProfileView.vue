  <script setup>
  import { ref, onMounted } from "vue";

  const GET_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/info`;
  const PUT_URL = `${import.meta.env.VITE_API_BASEURL}/Customers/id`;

  const user = ref({
    username: "",
    phone: "",
    email: "",
    licensePlate: "",
    password: "",
  });

  //讀取
  const Info = async () => {
  try {
    const storedUser = localStorage.getItem('user');
    const parsedUser = JSON.parse(storedUser); //將string字串(storedUser)轉成物件
    const userId = parsedUser.user;         
    const GET_TURL = `${GET_URL}${userId}`
    console.log(GET_TURL);
    
    const response = await fetch(GET_TURL);
    const data = await response.json();
    user.value = data;
    console.log(data)
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

// 定義編輯模式狀態
const isEditing = ref(false);

// 切換編輯模式，並在保存時調用API更新用戶資訊
const toggleEdit = async () => {
  if (isEditing.value) {
    // 非修改模式，發送PUT請求
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = JSON.parse(storedUser); // 取得用戶ID
      const userId = parsedUser.user;
      const PUT_TURL = `${PUT_URL}${userId}`;

      const response = await fetch(PUT_TURL, {
        method: "PUT",
        body: JSON.stringify(user.value),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to update user info");
      }
      alert("用戶資料已成功更新");
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("更新用戶資料失敗");
    }
  }
  // 切換編輯狀態
  isEditing.value = !isEditing.value;
};



// const toggleEdit = async () => {
//   try {
//     const response = await fetch(PUT_URL, {
//       method: "PUT",
//       body: JSON.stringify(user.value),
//       headers: { "Content-Type": "application/json" },
//     });
//     if (!response.ok) {
//       throw new Error('Failed to update user info');
//     }
//     alert("用戶資料已成功更新");
//   } catch (error) {
//     console.error("Error updating user info:", error);
//     alert("更新用戶資料失敗");
//   }
// };

  // 從 localStorage 中取出資料
  // const loadUserFromLocalStorage = () => {
  //   const storedUser = localStorage.getItem('user'); // 假設 'user' 是儲存用戶資料的 key
  //   console.log(storedUser);
  //   console.log(user.email);
  //   if (storedUser) {
  //     // 將 JSON 字串解析為物件，並賦值給 user
  //     user.value = JSON.parse(storedUser);
  //     console.log(user);
  //   }
  // };

  // 當組件加載時載入用戶資料
  onMounted(() => {
    Info();
  });

  </script>

  <template>
    <div class="">
      <h2>用戶基本資訊</h2>
      <hr>
      <div class="card" style="width: 53rem;">
      <div class="card-body">
        <h5 class="card-title">Welcome</h5>
        <ul v-if="user">
          <li>姓名 <span v-if="!isEditing.valueOf">{{user.username}}</span><input v-if="isEditing" v-model="user.username" /></li>
          
          <li>電話 <span v-if="!isEditing.valueOf">{{user.phone}}</span> <input v-if="isEditing" v-model="user.phone" /></li>
          <li>Email信箱 <span v-if="!isEditing.valueOf">{{user.email}}</span> <input v-if="isEditing" v-model="user.email" /></li>
          <li>車牌 <span v-if="!isEditing.valueOf">{{user.licensePlate}}</span> <input v-if="isEditing" v-model="user.licensePlate" /></li>
          <li>密碼 <span v-if="!isEditing.valueOf">{{user.password}}</span> <input v-if="isEditing" v-model="user.password" /></li>
        </ul>     
            <a href="#" class="btn btn-dark" @click="toggleEdit">{{ isEditing ? '保存' : '修改' }}</a>
      </div>
    </div>
    </div>
  </template>

  <style lang="css" scoped></style>
