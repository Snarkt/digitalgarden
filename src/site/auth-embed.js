<!doctype html>
<html lang="zh-tw">
<head>
  <meta charset="UTF-8" />
  <title>登入頁面</title>
  <style>
    #auth-gate {
      display: none;
    }
    .login-form {
      max-width: 300px;
      margin: 30px auto;
      padding: 20px;
      background: #222;
      border-radius: 8px;
      color: white;
      font-family: Arial, sans-serif;
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
  </style>
</head>
<body>

<div id="auth-gate">
  <p>歡迎登入！您已成功登入。</p>
</div>

<div class="login-form" id="login-form">
  <h2>登入</h2>
  <label for="email">電子郵件</label>
  <input type="email" id="email" required />
  
  <label for="password">密碼</label>
  <input type="password" id="password" required />
  
  <button id="login-btn">登入</button>
  <p id="login-error" style="color: red; display:none;"></p>
</div>

<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>

<script>
(async () => {
  const { createIcons, icons } = await import("https://cdn.jsdelivr.net/npm/lucide@0.525.0/+esm");
  
  createIcons({
    icons,
    attrs: { class: ["svg-icon"] }
  });

  const identity = window.netlifyIdentity;
  const gate = document.getElementById("auth-gate");
  const loginForm = document.getElementById("login-form");
  const loginBtn = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");

  if (!identity || !gate || !loginForm) return;

  // 初始化 identity，判斷是否已登入
  identity.on("init", (user) => {
    if (user) {
      gate.style.display = "block";
      loginForm.style.display = "none";
    } else {
      gate.style.display = "none";
      loginForm.style.display = "block";
    }
  });

  identity.on("login", () => {
    gate.style.display = "block";
    loginForm.style.display = "none";
    loginError.style.display = "none";
    identity.close();
  });

  identity.on("logout", () => {
    gate.style.display = "none";
    loginForm.style.display = "block";
  });

  identity.init();

  // 登入按鈕事件
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
      // 成功登入事件已由 identity.on("login") 處理
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
