(async () => {
  // 動態載入 Lucide ESM 模組
  const { createIcons, icons } = await import("https://cdn.jsdelivr.net/npm/lucide@0.525.0/+esm");
  createIcons({ icons });

  // Netlify Identity 初始化與事件綁定
  const identity = window.netlifyIdentity;
  const gate = document.getElementById("auth-gate");
  if (!identity || !gate) return;

  identity.on("init", (user) => {
    if (!user) {
      identity.open();
    } else {
      gate.style.display = "block";
    }
  });

  identity.on("login", () => {
    gate.style.display = "block";
    identity.close();
  });

  identity.on("logout", () => {
    gate.style.display = "none";
  });

  identity.init();
})();
