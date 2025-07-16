document.addEventListener("DOMContentLoaded", async () => {
  // 🧩 初始化 Auth0 客戶端
  const auth0Client = await createAuth0Client({
    domain: "dev-x61qw7gt5164ns5j.auth0.com",          // 例：mytenant.auth0.com
    client_id: "3wSNNxlskZfjZmls2k97NvYewG53EJj0",
    cacheLocation: "localstorage",
    useRefreshTokens: true
  });

  // 白名單 emails（登入後驗證）
  const allowedEmails = [
    "admin@example.com",
    "staff@example.com",
    "user1@example.com"
  ];

  // DOM 元素
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const gate = document.getElementById("auth-gate");
  const userInfo = document.getElementById("user-info");

  // 處理 OAuth2 回調
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  // 取得登入者
  const user = await auth0Client.getUser();

  // 顯示/隱藏 UI 方法
  function showUI(isLoggedIn, email = "") {
    gate.style.display = isLoggedIn ? "block" : "none";
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
    userInfo.innerText = isLoggedIn ? `登入帳號：${email}` : "";
  }

  // 白名單檢查
  if (user) {
    if (allowedEmails.includes(user.email)) {
      showUI(true, user.email);
    } else {
      alert(`⚠️ ${user.email} 無權登入此系統！`);
      await auth0Client.logout({ returnTo: window.location.origin });
      showUI(false);
      return;
    }
  }

  // Login / Logout 事件綁定
  loginBtn.addEventListener("click", () => {
    auth0Client.loginWithRedirect({
      redirect_uri: window.location.origin
    });
  });

  logoutBtn.addEventListener("click", async () => {
    await auth0Client.logout({
      returnTo: window.location.origin
    });
    showUI(false);
  });
});
