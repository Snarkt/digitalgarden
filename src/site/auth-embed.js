document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  //const resetBtn = document.getElementById("reset-btn");

  if (!gate || !loginBtn || !logoutBtn) {
    console.error("缺少 #auth-gate 或登入/登出按鈕");
    return;
  }

  // 解析 URL 參數
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("invite_token");
  const recoveryToken = params.get("recovery_token") || params.get("token");

  // 初始化登入狀態處理
  identity.on("init", user => {
    const isLoggedIn = !!user;
    gate.style.display = isLoggedIn ? "block" : "none";
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
    //resetBtn.style.display = isLoggedIn ? "none" : "inline-block";
  });

  identity.on("login", () => {
    gate.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    //resetBtn.style.display = "none";
    identity.close();
  });

  identity.on("logout", () => {
    gate.style.display = "none";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    //resetBtn.style.display = "inline-block";
  });

  // 按鈕綁定事件
  loginBtn.addEventListener("click", () => identity.open());
  logoutBtn.addEventListener("click", () => identity.logout());
  //resetBtn.addEventListener("click", () => identity.open("recover"));

  // 初始化身份驗證
  identity.init();

  // invite token 註冊完成流程
  if (inviteToken) {
    identity.completeSignup(inviteToken)
      .then(user => {
        console.log("完成註冊，使用者：", user);
        identity.open();  // 可改為 identity.open("login") 明確顯示登入視窗
      })
      .catch(err => {
        console.error("註冊完成失敗", err);
        alert("邀請連結無效或已過期，請聯絡管理員重新邀請。");
      });
  }

  // recovery token 密碼重設流程
  if (recoveryToken) {
    identity.open("recover");
    identity.on("init", () => {
      identity.recover(recoveryToken);
    });
  }
});
