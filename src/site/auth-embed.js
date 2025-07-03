<!doctype html>
<html lang="zh-tw">
<head>
  <meta charset="UTF-8" />
  <title>登入頁面</title>
  <style>
    body {
      background: #111;
      color: white;
      font-family: Arial, sans-serif;
    }
    .login-form {
      max-width: 300px;
      margin: 30px auto;
      padding: 20px;
      background: #222;
      border-radius: 8px;
    }
    .login-form label {
      display: block;
      margin-top: 10px;
    }
    .login-form input {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      border-radius: 4px;
      border: none;
    }
    .login-form button {
      margin-top: 15px;
      width: 100%;
      padding: 10px;
      background: #4caf50;
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }
    .login-form button:hover {
      background: #45a049;
    }
    #auth-gate {
      display: none;
      text-align: center;
      margin-top: 30px;
    }
  </style>
</head>
<body>

<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>

<script>
(async () => {
  // 建立登入區塊
  const body = document.body;

  const authGate = document.createElement("div");
  authGate.id = "auth-gate";
  authGate.innerHTML = `
    <p>歡迎登入！您已成功登入。</p>
  `;

  const loginForm = document.createElement("div");
  loginForm.className = "login-form";
  loginForm.id = "login-form";
  loginForm.innerHTML = `
    <h2>登入</h2>
    <label for="email">電子郵件</label>
    <input type="email" id="email" required />
    <label for="password">密碼</label>
    <input type="password" id="password" required />
    <button id="login-btn">登入</button>
    <p id="login-error" style="color: red; display: none;"></p>
  `;

  body.appendChild(authGate);
  body.appendChild(loginForm);

  // lucide icon (非必要可移除)
  try {
    const { createIcons, icons } = await import("https://cdn.jsdelivr.net/npm/lucide@0.525.0/+esm");
    createIcons({ icons, attrs: { class: ["svg-icon"] } });
  } catch (e) {
    console.warn("lucide 載入失敗，可忽略", e);
  }

  const identity = window.netlifyIdentity;
  const loginBtn = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");

  if (!identity) {
    console.error("Netlify Identity 未正確載入");
    return;
  }

  identity.on("init", (user) => {
    if (user) {
      authGate.style.display = "block";
      loginForm.style.display = "none";
    } else {
      authGate.style.display = "none";
      loginForm.style.display = "block";
    }
  });

  identity.on("login", () => {
    authGate.style.display = "block";
    loginForm.style.display = "none";
    loginError.style.display = "none";
    identity.close();
  });

  identity.on("logout", () => {
    authGate.style.display = "none";
    loginForm.style.display = "block";
  });

  identity.init();

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    loginError.style.display = "none";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      loginError.textContent = "請輸入電子郵件和密碼";
      loginError.style.display = "block";
      return;
    }

    try {
      await identity.login(email, password);
    } catch (err) {
      loginError.textContent = "登入失敗，請確認帳號密碼";
      loginError.style.display = "block";
      console.error(err);
    }
  });
})();
</script>

</body>
</html>
