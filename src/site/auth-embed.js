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

  // 解析 URL 參數
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("invite_token");
  const recoveryToken = params.get("recovery_token") || params.get("token");

  // ✅ 所有事件綁定都在 init() 前完成
  identity.on("init", user => {
    const isLoggedIn = !!user;
    gate.style.display = isLoggedIn ? "block" : "none";
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
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

  // ✅ 先 init 才能 recover 或 completeSignup
  identity.init();

  // ✅ 重設密碼流程
  if (recoveryToken) {
    identity.open("recover");
    identity.recover(recoveryToken);  // 不要包在 on("init") 裡
  }

  // ✅ 邀請註冊流程
  if (inviteToken) {
    identity.completeSignup(inviteToken)
      .then(user => {
        console.log("完成註冊，使用者：", user);
        identity.open("login");  // 直接開啟登入畫面
      })
      .catch(err => {
        console.error("註冊完成失敗", err);
        alert("邀請連結無效或已過期，請聯絡管理員重新邀請。");
      });
  }
});
