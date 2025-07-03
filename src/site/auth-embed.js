// digitalgarden/src/site/auth-embed.js

// 等頁面 DOM 建立完成後執行
document.addEventListener("DOMContentLoaded", () => {
  if (!window.netlifyIdentity) {
    console.error("Netlify Identity Widget 尚未載入");
    return;
  }

  const gateway = document.getElementById("auth-gate");
  if (!gateway) {
    console.error("找不到 #auth-gate，用於顯示登入後內容");
    return;
  }

  const identity = window.netlifyIdentity;

  identity.on("init", user => {
    gateway.style.display = user ? "block" : "none";
  });

  identity.on("login", () => {
    gateway.style.display = "block";
    identity.close();
  });

  identity.on("logout", () => {
    gateway.style.display = "none";
  });

  identity.init();
});
