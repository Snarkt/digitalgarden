document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const params = new URLSearchParams(window.location.search); // 用 query string
  const inviteToken = params.get("invite_token");
  const recoveryToken = params.get("recovery_token") || params.get("token");

  function showUI(user) {
    const isLoggedIn = !!user;
    gate.style.display = isLoggedIn ? "block" : "none";
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  }

  identity.on("init", user => {
    showUI(user);

    if (inviteToken) {
      // 完成邀請註冊
      identity.completeSignup(inviteToken)
        .then(user => {
          console.log("邀請註冊完成:", user);
        })
        .catch(err => {
          console.error("邀請失敗:", err);
          alert("邀請連結無效或已過期，請聯絡管理員。");
        });
    } 
    if (recoveryToken) {
      // 跳到重設密碼頁面並執行 recover
      identity.open("recover");
      identity.recover(recoveryToken)
        .then(() => {
          console.log("請完成密碼重設");
        })
        .catch(err => {
          console.error("密碼重設失敗:", err);
          alert("密碼重設連結無效或已過期，請重新申請。");
        });
    }
  });

  identity.on("login", () => {
    showUI(true);
    identity.close();
  });

  identity.on("logout", () => {
    showUI(false);
  });

  loginBtn.addEventListener("click", () => identity.open("login"));
  logoutBtn.addEventListener("click", () => identity.logout());

  identity.init();
});
