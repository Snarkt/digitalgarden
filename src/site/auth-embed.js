// digitalgarden/src/site/auth-embed.js
document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (!gate || !loginBtn || !logoutBtn) {
    console.error("缺少 #auth-gate 或登入/登出按鈕");
    return;
  }

  // 初始化回呼：判斷是否已登入
  identity.on("init", user => {
    if (user) {
      gate.style.display = "block";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    } else {
      gate.style.display = "none";
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
    }
  });

  identity.on("login", () => {
    gate.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    identity.close();
  });

  identity.on("logout", () => {
    gate.style.display = "none";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  });

  // 點擊登入按鈕開啟視窗
  loginBtn.addEventListener("click", () => identity.open());
  // 點擊登出按鈕登出
  logoutBtn.addEventListener("click", () => identity.logout());

  identity.init();
});
