document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("h2");
  section.addEventListener("click", () => {
    alert(`Navigating to ${section.textContent}...`);
  });
});
