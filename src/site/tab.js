// tab.js
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("[data-tab-btn]");
  const panels = document.querySelectorAll("[data-tab-panel]");

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-btn");

      // 切換按鈕狀態
      tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // 切換內容區塊
      panels.forEach(panel => {
        if (panel.getAttribute("data-tab-panel") === target) {
          panel.style.display = "block";
        } else {
          panel.style.display = "none";
        }
      });
    });
  });
});
