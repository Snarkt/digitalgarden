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

  identity.init();

  setTimeout(() => {
    const token = inviteToken || recoveryToken; // 取其中一個token來用

    if (token) {
      identity.open("recover");  // 開啟重設密碼視窗
      identity.recover(token).catch(err => {
        console.error("密碼重設失敗：", err);
        alert("密碼重設連結可能已失效，請重新申請。");
      });
    }
  }, 500);
});
