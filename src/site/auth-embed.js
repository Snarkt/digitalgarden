document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const allowedEmails = [
    "sethfu00958@intumit.com",
    "chabc.9654@gmail.com"
  ];

  // 取得網址中的 query 與 hash token
  const queryParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));

  const inviteToken = queryParams.get("invite_token") || hashParams.get("invite_token");
  const recoveryToken =
    queryParams.get("recovery_token") || queryParams.get("token") ||
    hashParams.get("recovery_token") || hashParams.get("token");

  // 頁面中登入區域的元素
  const gate = document.getElementById("auth-gate");
  const guestArea = document.getElementById("guest");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  // 顯示/隱藏 UI
  function showUI(user) {
    const isLoggedIn = !!user;
    // 只有登出後才顯示 guest 區塊
    guestArea.style.display = isLoggedIn ? "none" : "block";
    // 只有登入後才顯示 gated 區塊
    gate.style.display = isLoggedIn ? "block" : "none";
    // 登入/登出按鈕
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  }

  // 清除網址中的 token（防止 reload 重複觸發）
  function clearTokenFromURL() {
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = "";
    history.replaceState({}, document.title, url.toString());
  }

  // 初始化後處理邀請註冊或密碼重設
  identity.on("init", (user) => {
    showUI(user);

    if (inviteToken) {
      identity.completeSignup(inviteToken)
        .then((user) => {
          console.log("✅ 邀請註冊完成:", user);
          showUI(user);
          clearTokenFromURL();
        })
        .catch((err) => {
          console.error("❌ 邀請錯誤:", err);
          alert("邀請連結無效或已過期，請聯絡管理員。");
          clearTokenFromURL();
        });

    } else if (recoveryToken) {
      identity.recover(recoveryToken)
        .then(() => {
          console.log("🔁 請完成密碼重設");
          clearTokenFromURL();
        })
        .catch((err) => {
          console.error("❌ 密碼重設錯誤:", err);
          alert("密碼重設連結無效或已過期，請重新申請。");
          clearTokenFromURL();
        });

    } else {
      console.log("ℹ️ 無邀請或密碼重設 token，不自動開啟登入視窗");
    }
  });

  // 使用者登入，限制白名單
  identity.on("login", async (user) => {
    console.log("🔓 使用者登入:", user);

    if (allowedEmails.includes(user.email)) {
      showUI(user);
      identity.close();
    } else {
      alert(`⚠️ 您的帳號 (${user.email}) 不在白名單中，將自動登出`);
      await identity.logout();
      showUI(null);
    }
  });

  // 使用者登出
  identity.on("logout", () => {
    console.log("🔒 使用者登出");
    showUI(null);
  });

  // 登入/登出按鈕綁定
  loginBtn.addEventListener("click", () => identity.open("login"));
  logoutBtn.addEventListener("click", () => identity.logout());

  // 啟動 Identity（放最後）
  identity.init();
});
