//service worker

// 註冊 install 事件
self.addEventListener("install", function (event) {
  console.log("Service Worker 安裝中...");
  // 跳過等待，立即激活新版本的 Service Worker
  event.waitUntil(self.skipWaiting());
});

// 註冊 activate 事件
self.addEventListener("activate", function (event) {
  console.log("Service Worker 已激活");
  // 讓新的 Service Worker 立即接管所有客戶端
  event.waitUntil(self.clients.claim());
});

// 監聽推播 (push) 事件
self.addEventListener("push", function (event) {
  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }
  console.log("Push event received");
  let data = {
    title: "Something Has Happened",
    message: "Here's something you might want to check out.",
  };
  if (event.data) {
    try {
      data = event.data.json(); // 嘗試解析 JSON 格式的資料
    } catch (e) {
      console.error("無效的 JSON 格式", e);
    }
  }
  const options = {
    body: data.message, // 通知的主要內容
    icon: "/logo.png", // 通知圖標，可按需替換路徑
    actions: [
      {
        action: "open_app",
        title: "查看詳細內容",
      },
      {
        action: "dismiss",
        title: "關閉",
      },
    ],
  };

  // 顯示通知
  event.waitUntil(self.registration.showNotification(data.title, options));
});
// 處理通知點擊 (notificationclick) 事件
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // 點擊後關閉通知

  if (event.action === "open_app") {
    // 在新窗口或當前窗口打開應用
    event.waitUntil(
      clients.openWindow("/home") // 替換為您的目標頁面，例如 /dashboard
    );
  }
});
