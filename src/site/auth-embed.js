document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  // 先從 query string 讀
  const queryParams = new URLSearchParams(window.location.search);
  let inviteToken = queryParams.get("invite_token");
  let recoveryToken = queryParams.get("recovery_token") || queryParams.get("token");

  // 再從 hash 讀（只有在 query 沒讀到時）
  if (!inviteToken) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    inviteToken = hashParams.get("invite_token");
  }
  if (!recoveryToken) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    recoveryToken = hashParams.get("recovery_token") || hashParams.get("token");
  }

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

  identity.init();

  setTimeout(() => {
    if (inviteToken) {
      // 只處理邀請流程
      identity.completeSignup(inviteToken)
        .then(user => {
          console.log("邀請成功：", user);
          identity.open("login"); // 完成邀請後跳登入
        })
        .catch(err => {
          console.error("邀請錯誤", err);
          alert("邀請失效，請聯繫管理員");
        });
    } else if (recoveryToken) {
      // 只處理密碼重設流程
      identity.open("recover");
      identity.recover(recoveryToken)
        .then(() => {
          identity.open("login"); // 密碼重設完成跳登入
        })
        .catch(err => {
          console.error("密碼重設錯誤", err);
          alert("密碼重設連結可能已失效");
        });
    } else {
      // 兩者都沒有，直接開登入視窗
      identity.open("login");
    }
  }, 500);
});
