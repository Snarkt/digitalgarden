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

  // 解析 URL 參數，包含 invite_token、recovery_token（密碼重設用）
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("invite_token");
  const recoveryToken = params.get("recovery_token") || params.get("token");

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

  // 處理重設密碼 token，打開 recover 視窗並呼叫 recover 方法
  if (recoveryToken) {
    identity.open("recover");
    identity.on("init", () => {
      identity.recover(recoveryToken)
        .catch(err => {
          console.error("密碼重設失敗", err);
          alert("重設密碼連結無效或已過期，請重新申請重設。");
        });
    });
  }
});
