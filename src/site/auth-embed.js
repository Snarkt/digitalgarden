document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  // 先從 query string 讀 token
  const queryParams = new URLSearchParams(window.location.search);
  let inviteToken = queryParams.get("invite_token");
  let recoveryToken = queryParams.get("recovery_token") || queryParams.get("token");

  // query 沒讀到再從 hash 讀
  if (!inviteToken) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    inviteToken = hashParams.get("invite_token");
  }
  if (!recoveryToken) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    recoveryToken = hashParams.get("recovery_token") || hashParams.get("token");
  }

  function showUI(user) {
    const isLoggedIn = !!user;
    gate.style.display = isLoggedIn ? "block" : "none";
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  }

  // 身份初始化事件
  identity.on("init", user => {
    showUI(user);

    setTimeout(() => {
      if (inviteToken) {
        // 處理邀請註冊
        identity.completeSignup(inviteToken)
          .then(user => {
            console.log("邀請註冊完成:", user);
            identity.open("login"); // 完成邀請後跳登入
          })
          .catch(err => {
            console.error("邀請錯誤:", err);
            alert("邀請連結無效或已過期，請聯絡管理員。");
            identity.open("login");
          });
      } else if (recoveryToken) {
        // 處理重設密碼
        identity.open("recover");
        identity.recover(recoveryToken)
          .then(() => {
            console.log("請完成密碼重設");
          })
          .catch(err => {
            console.error("密碼重設錯誤:", err);
            alert("密碼重設連結無效或已過期，請重新申請。");
            identity.open("login");
          });
      } else {
        // 沒有 token 就開登入頁面
        identity.open("login");
      }
    }, 500);
  });

  // 登入事件
  identity.on("login", user => {
    showUI(true);
    identity.close();
    console.log("使用者登入:", user);
  });

  // 登出事件
  identity.on("logout", () => {
    showUI(false);
    console.log("使用者登出");
  });

  loginBtn.addEventListener("click", () => identity.open("login"));
  logoutBtn.addEventListener("click", () => identity.logout());

  identity.init();
});
