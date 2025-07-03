(async () => {
  const { createIcons, icons } = await import("https://cdn.jsdelivr.net/npm/lucide@0.525.0/+esm");
  
  createIcons({
    icons,
    attrs: { class: ["svg-icon"] }
  });

  // 下面是你的 Netlify Identity 初始化
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
