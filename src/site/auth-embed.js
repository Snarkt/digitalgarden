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

  // 解析 URL 參數，包含 invite_token、recovery_token
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("invite_token");
  const recoveryToken = params.get("recovery_token") || params.get("token");

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

  // 處理 invite_token，完成註冊
  if (inviteToken) {
    identity.completeSignup(inviteToken)
      .then(user => {
        console.log("完成註冊，使用者：", user);
        identity.open();  // 完成註冊後打開登入視窗
      })
      .catch(err => {
        console.error("註冊完成失敗", err);
        alert("邀請連結無效或已過期，請聯絡管理員重新邀請。");
      });
  }

  // 處理重設密碼 token
  if (recoveryToken) {
    identity.open("recover");
    identity.on("init", () => {
      identity.recover(recoveryToken);
    });
  }
});
