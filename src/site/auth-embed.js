document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const gate = document.getElementById("auth-gate");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  // 從 query string 讀取
  const queryParams = new URLSearchParams(window.location.search);
  let inviteToken = queryParams.get("invite_token");
  let recoveryToken = queryParams.get("recovery_token") || queryParams.get("token");

  // 從 hash 讀取，如果 query 沒值才讀 hash
  if (!inviteToken || !recoveryToken) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    if (!inviteToken) inviteToken = hashParams.get("invite_token");
    if (!recoveryToken) recoveryToken = hashParams.get("recovery_token") || hashParams.get("token");
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
      identity.completeSignup(inviteToken)
        .then(user => {
          console.log("邀請成功：", user);
          identity.open("login");
        })
        .catch(err => {
          console.error("邀請錯誤", err);
          alert("邀請失效，請聯繫管理員");
        });
    } else if (recoveryToken) {
      identity.open("recover");
      identity.recover(recoveryToken)
        .then(() => {
          identity.open("login");
        })
        .catch(err => {
          console.error("密碼重設錯誤", err);
          alert("密碼重設連結可能已失效");
        });
    }
  }, 500);
});
