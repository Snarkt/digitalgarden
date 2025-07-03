document.addEventListener("DOMContentLoaded", function () {
  const identity = window.netlifyIdentity;

  const gate = document.getElementById("auth-gate");

  identity.on("init", (user) => {
    if (!user) {
      identity.open();
    } else {
      if (gate) gate.style.display = "block";
    }
  });

  identity.on("login", () => {
    if (gate) gate.style.display = "block";
    identity.close();
  });

  identity.on("logout", () => {
    if (gate) gate.style.display = "none";
  });

  identity.init();
});
