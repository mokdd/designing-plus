document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menuArea = document.getElementById("menu-nav");
  menuToggle.addEventListener('click', (e) => {
    menuArea.classList.toggle('open');
  });
});
