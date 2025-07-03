document.addEventListener("DOMContentLoaded", function () {
  const identity = window.netlifyIdentity;

  identity.on("init", (user) => {
    if (!user) {
      identity.open(); // ⬅️ 直接打開登入視窗
    } else {
      document.getElementById("auth-gate").style.display = "block";
    }
  });

  identity.on("login", () => {
    document.getElementById("auth-gate").style.display = "block";
    identity.close(); // 關閉登入視窗
  });

  identity.on("logout", () => {
    document.getElementById("auth-gate").style.display = "none";
  });

  identity.init(); // ⬅️ 初始化 SDK
});
