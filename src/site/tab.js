document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  if (!tabButtons.length || !tabContents.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-tab");

      // 清除所有 active 樣式
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // 加上 active 樣式
      button.classList.add("active");
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.classList.add("active");
      } else {
        console.warn(`⚠️ 沒有找到 id 為 ${targetId} 的 tab-content`);
      }
    });
  });
});
