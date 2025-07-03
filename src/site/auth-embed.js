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
    console.error("缺少必要的 UI 元件");
    return;
  }

  // 取得 URL 中的 invite token 與 recovery token
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("invite_token");
  const recoveryToken = params.get("recovery_token") || params.get("token");

  // 初始化身份驗證狀態前，綁定事件
  identity.on("init", user => {
    const isLoggedIn = !!user;
    gate.style.display = isLoggedIn ? "block" : "none";
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";

    // ✅ 初始化完成後再處理 Token
    if (inviteToken) {
      identity
        .completeSignup(inviteToken)
        .then(user => {
          console.log("完成邀請註冊：", user);
          identity.open("login"); // 顯示登入畫面
        })
        .catch(err => {
          console.error("邀請註冊失敗", err);
          alert("邀請連結無效或已過期，請聯絡管理員重新邀請。");
        });
    }

    if (recoveryToken) {
      identity.open("recover");
      identity.recover(recoveryToken); // ✅ 正確觸發密碼重設
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

  loginBtn.addEventListener("click", () => identity.open());
  logoutBtn.addEventListener("click", () => identity.logout());

  // ✅ 最後執行初始化
  identity.init();
});
