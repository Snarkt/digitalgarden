document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  // 移除 resetBtn 相關

  if (!gate || !loginBtn || !logoutBtn) {
    console.error("缺少 #auth-gate 或登入/登出按鈕");
    return;
  }

  // 解析 URL 參數，包含 invite_token
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("invite_token");
  // 移除 recoveryToken 相關

  identity.on("init", user => {
    if (user) {
      gate.style.display = "block";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      // no resetBtn
    } else {
      gate.style.display = "none";
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      // no resetBtn
    }
  });

  identity.on("login", () => {
    gate.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  });

  identity.on("logout", () => {
    gate.style.display = "none";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  });

  loginBtn.addEventListener("click", () => identity.open());
  logoutBtn.addEventListener("click", () => identity.logout());

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

  // 移除 recoveryToken 處理
});
