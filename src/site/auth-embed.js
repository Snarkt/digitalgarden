document.addEventListener("DOMContentLoaded", function () {
  const identity = netlifyIdentity;

  const gate = document.getElementById("auth-gate");

  function renderLoginForm() {
    document.body.innerHTML = `
      <h2>請登入以瀏覽 Digital Garden 首頁</h2>
      <input type="email" id="email" placeholder="Email"><br>
      <input type="password" id="password" placeholder="Password"><br>
      <button id="login-btn">登入</button>
      <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
    `;

    document.getElementById("login-btn").onclick = () => {
      const email = document.getElementById("email").value;
      const pw = document.getElementById("password").value;

      identity.login({ email, password: pw }, true)
        .then(() => location.reload())
        .catch(() => alert("登入失敗"));
    };
  }

  identity.on("init", user => {
    if (user) {
      gate.style.display = "block"; // 顯示主內容
    } else {
      renderLoginForm(); // 顯示登入表單
    }
  });

  identity.init();
});
