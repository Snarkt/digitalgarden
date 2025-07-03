document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const resetBtn = document.getElementById("reset-btn");

  if (!gate || !loginBtn || !logoutBtn || !resetBtn) {
    console.error("缺少 #auth-gate 或登入/登出/重設按鈕");
    return;
  }

  // 讀取 URL hash 裡的 token
  const params = new URLSearchParams(window.location.hash.replace(/^#/, "?"));
  const token = params.get("recovery_token") || params.get("token");

  identity.on("init", user => {
    if (user) {
      gate.style.display = "block";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      resetBtn.style.display = "none";
    } else {
      gate.style.display = "none";
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      resetBtn.style.display = "inline-block";
    }
  });

  identity.on("login", () => {
    gate.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    resetBtn.style.display = "none";
    identity.close();
  });

  identity.on("logout", () => {
    gate.style.display = "none";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    resetBtn.style.display = "inline-block";
  });

  loginBtn.addEventListener("click", () => identity.open());
  logoutBtn.addEventListener("click", () => identity.logout());
  resetBtn.addEventListener("click", () => identity.open("recover"));

  identity.init();

  // 如果有 token，打開重設密碼視窗並帶入 token
  if (token) {
    identity.open("recover");
    identity.on("init", () => {
      identity.recover(token);
    });
  }
});
