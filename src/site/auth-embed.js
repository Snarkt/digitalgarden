document.addEventListener("DOMContentLoaded", async () => {
  const allowedEmails = [
    "sethfu00958@intumit.com",
    "chabc.9654@gmail.com"
  ];

  // 初始化 Auth0 客戶端
  const auth0Client = await createAuth0Client({
    domain: "dev-x61qw7gt5164ns5j.us.auth0.com",
    client_id: "3wSNNxlskZfjZmls2k97NvYewG53EJj0",
    redirect_uri: window.location.origin,
    cacheLocation: "localstorage",
    useRefreshTokens: true
  });

  // 處理 redirect 回來的 callback
  if (window.location.search.includes("code=") &&
      window.location.search.includes("state=")) {
    try {
      await auth0Client.handleRedirectCallback();
      history.replaceState({}, document.title, "/"); // 清除 URL 中的 code/state
    } catch (err) {
      console.error("⚠️ 回傳處理錯誤", err);
    }
  }

  // DOM 元素
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const gate = document.getElementById("auth-gate");
  const userInfo = document.getElementById("user-info");

  // 檢查是否已登入
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0Client.getUser();

    if (allowedEmails.includes(user.email)) {
      showUI(user);
    } else {
      alert(`⚠️ 帳號 ${user.email} 不在白名單內，將自動登出`);
      await auth0Client.logout({ returnTo: window.location.origin });
    }
  }

  // 按鈕綁定事件
  loginBtn.addEventListener("click", () => auth0Client.loginWithRedirect());
  logoutBtn.addEventListener("click", () =>
    auth0Client.logout({ returnTo: window.location.origin })
  );

  // UI 顯示控制
  function showUI(user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    gate.style.display = "block";
    userInfo.innerText = `👤 登入帳號：${user.email}`;
  }
});
