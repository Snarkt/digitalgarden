document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const params = new URLSearchParams(window.location.hash.slice(1));
  const inviteToken = params.get("invite_token");
  const recoveryToken = params.get("recovery_token");

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

  // 初始化身份驗證元件
  identity.init();

  // 外部 token 邏輯延後觸發，避免 race condition
  setTimeout(() => {
    if (inviteToken) {
      identity.completeSignup(inviteToken)
        .then(user => {
          console.log("邀請成功：", user);
          identity.open("login");
        })
        .catch(err => {
          console.error("邀請錯誤", err);
          alert("邀請失效，請聯繫管理員");
        });
    }

    if (recoveryToken) {
      identity.open("recover");
      identity.recover(recoveryToken).catch(err => {
        console.error("密碼重設錯誤", err);
        alert("密碼重設連結可能已失效");
      });
    }
  }, 500);
});
