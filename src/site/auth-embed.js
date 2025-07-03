document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const queryParams = new URLSearchParams(window.location.search);

  const inviteToken =
    queryParams.get("invite_token") || hashParams.get("invite_token");
  const recoveryToken =
    queryParams.get("recovery_token") ||
    queryParams.get("token") ||
    hashParams.get("recovery_token") ||
    hashParams.get("token");

  function showUI(user) {
    const isLoggedIn = !!user;
    gate.style.display = isLoggedIn ? "block" : "none";
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  }

  identity.on("init", user => {
    showUI(user);

    // ✅ 處理邀請
    if (inviteToken) {
      identity
        .completeSignup(inviteToken)
        .then(user => {
          console.log("邀請註冊完成:", user);
          identity.open("login");
        })
        .catch(err => {
          console.error("邀請錯誤:", err);
          alert("邀請連結無效或已過期，請聯絡管理員。");
        });
    }

    // ✅ 處理重設密碼
    else if (recoveryToken) {
      identity.open("recover");
      identity
        .recover(recoveryToken)
        .then(() => {
          console.log("請完成密碼重設");
        })
        .catch(err => {
          console.error("密碼重設錯誤:", err);
          alert("密碼重設連結無效或已過期。");
        });
    }

    // ✅ 預設跳登入介面
    else {
      identity.open("login");
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
