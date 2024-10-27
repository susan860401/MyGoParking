export async function subscribeUserToPush() {
  // 確保瀏覽器支持推播
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push messaging is not supported");
    return;
  }
  const registration = await navigator.serviceWorker.ready;

  // 使用後端提供的 VAPID 公鑰，將其轉換為 Uint8Array 格式
  const vapidPublicKey =
    "BEOC-kXHgoTOx9oB89JAGbgZxr2w_IXEc_G4_0PACRCJOFtfx4hoT0hxslv1aGGmCSbrzpV-NSexuMjYuCyoMAM";
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  try {
    // 訂閱推播通知
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    // 將訂閱資料發送到後端
    await fetch("https://localhost:7077/api/Notification/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("User is subscribed to push notifications.");
  } catch (error) {
    console.error("Failed to subscribe user:", error);
  }
}

// 將 VAPID 公鑰轉換為 Uint8Array 格式
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
