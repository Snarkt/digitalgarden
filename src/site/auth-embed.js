document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const allowedEmails = ["chabc.9654@gmail.com"];
  const allowedDomains = ["intumit.com"];

  function isEmailAllowed(email) {
    const domain = email.split("@")[1];
    return allowedEmails.includes(email) || allowedDomains.includes(domain);
  }

  const gate = document.getElementById("auth-gate");
  const guestArea = document.getElementById("guest");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  function showUI(user) {
    const isLoggedIn = !!user;
    guestArea.style.display = isLoggedIn ? "none" : "block";
    gate.style.display = isLoggedIn ? "block" : "none";
    loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  }

  function clearTokenFromURL() {
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = "";
    history.replaceState({}, document.title, url.toString());
  }

  const queryParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const inviteToken = queryParams.get("invite_token") || hashParams.get("invite_token");
  const recoveryToken =
    queryParams.get("recovery_token") || queryParams.get("token") ||
    hashParams.get("recovery_token") || hashParams.get("token");

  identity.on("init", async (user) => {
    if (user) {
      if (isEmailAllowed(user.email)) {
        showUI(user);
      } else {
        console.warn(`🚫 使用者 ${user.email} 不在白名單，強制登出`);
        await identity.logout();
        showUI(null);
        return;
      }
    } else {
      showUI(null);
    }

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

  identity.on("login", async (user) => {
    console.log("🔓 使用者登入:", user);
    if (isEmailAllowed(user.email)) {
      showUI(user);
      identity.close();
    } else {
      alert(`⚠️ 您的帳號 (${user.email}) 不在白名單中，將自動登出`);
      await identity.logout();
      showUI(null);
    }
  });

  identity.on("logout", () => {
    console.log("🔒 使用者登出");
    showUI(null);
  });

  loginBtn.addEventListener("click", () => identity.open("login"));
  logoutBtn.addEventListener("click", () => identity.logout());

  identity.init();

  // ✅ 頁簽切換功能
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab");

      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      tabContents.forEach(content => {
        content.classList.toggle("active", content.id === target);
      });
    });
  });
});
