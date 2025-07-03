document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  // 從 query string 和 hash 分別讀 token
  const queryParams = new URLSearchParams(window.location.search);
  let inviteToken = queryParams.get("invite_token");
  let recoveryToken = queryParams.get("recovery_token") || queryParams.get("token");

  if (!inviteToken || !recoveryToken) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    if (!inviteToken) inviteToken = hashParams.get("invite_token");
    if (!recoveryToken) recoveryToken = hashParams.get("recovery_token") || hashParams.get("token");
  }

  function showUI(user) {
    const isLoggedIn = !!user;
    gate.style.display = isLoggedIn ? "block" : "none";
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  }

  identity.on("init", (user) => {
    showUI(user);

    // 處理 inviteToken 或 recoveryToken 時，避免重複呼叫 open
    if (inviteToken) {
      identity
        .completeSignup(inviteToken)
        .then((user) => {
          console.log("邀請註冊完成:", user);
          // 完成邀請後，直接登入狀態已更新，不需再呼叫 open("login")
          showUI(user);
        })
        .catch((err) => {
          console.error("邀請錯誤:", err);
          alert("邀請連結無效或已過期，請聯絡管理員。");
          identity.open("login");
        });
    } else if (recoveryToken) {
      identity
        .recover(recoveryToken)
        .then(() => {
          console.log("請完成密碼重設");
          identity.open("recover");
        })
        .catch((err) => {
          console.error("密碼重設錯誤:", err);
          alert("密碼重設連結無效或已過期，請重新申請。");
          identity.open("login");
        });
    } else {
      identity.open("login");
    }
  });

  identity.on("login", (user) => {
    showUI(true);
    identity.close();
    console.log("使用者登入:", user);
  });

  identity.on("logout", () => {
    showUI(false);
    console.log("使用者登出");
  });

  loginBtn.addEventListener("click", () => identity.open("login"));
  logoutBtn.addEventListener("click", () => identity.logout());

  identity.init();
});
