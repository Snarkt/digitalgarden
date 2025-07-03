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
    console.error("缺少必要的 DOM 元素：#auth-gate, #login-btn, #logout-btn");
    return;
  }

  // 從 URL hash（#後面部分）取得參數，例如 #invite_token=xxx&recovery_token=yyy
  const params = new URLSearchParams(window.location.hash.slice(1));
  const inviteToken = params.get("invite_token");
  const recoveryToken = params.get("recovery_token");

  // 當 Netlify Identity 初始化完成時
  identity.on("init", user => {
    const isLoggedIn = !!user;
    gate.style.display = isLoggedIn ? "block" : "none";
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  });

  // 使用者登入時 UI 更新
  identity.on("login", () => {
    gate.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    identity.close();
  });

  // 使用者登出時 UI 更新
  identity.on("logout", () => {
    gate.style.display = "none";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  });

  // 綁定按鈕事件
  loginBtn.addEventListener("click", () => identity.open());
  logoutBtn.addEventListener("click", () => identity.logout());

  // 初始化 Netlify Identity Widget
  identity.init();

  // 延遲處理邀請註冊及密碼重設，避免與 init race condition
  setTimeout(() => {
    if (inviteToken) {
      identity.completeSignup(inviteToken)
        .then(user => {
          console.log("邀請註冊成功：", user);
          identity.open("login");  // 邀請完成後開啟登入視窗
        })
        .catch(err => {
          console.error("邀請註冊失敗：", err);
          alert("邀請連結無效或已過期，請聯絡管理員重新邀請。");
        });
    }

    if (recoveryToken) {
      identity.open("recover"); // 開啟重設密碼視窗
      identity.recover(recoveryToken)
        .catch(err => {
          console.error("密碼重設失敗：", err);
          alert("密碼重設連結可能已失效，請重新申請。");
        });
    }
  }, 500);
});
