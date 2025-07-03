document.addEventListener("DOMContentLoaded", function () {
  const identity = window.netlifyIdentity;

  const gate = document.getElementById("auth-gate");
  if (!identity || !gate) return; // 防呆：必要物件不存在就跳過

  identity.on("init", (user) => {
    if (!user) {
      identity.open(); // 未登入自動開啟登入視窗
    } else {
      gate.style.display = "block";
    }
  });

  identity.on("login", () => {
    gate.style.display = "block";
    identity.close(); // 登入後自動關閉
  });

  identity.on("logout", () => {
    gate.style.display = "none";
  });

  identity.init(); // 初始化 Netlify Identity
});
