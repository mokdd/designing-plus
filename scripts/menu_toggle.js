document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const wholeDocument = document.body;
  const target = document.getElementById("main-header");
  const sticky = document.getElementById("sticky-wrapper");

  let toggleOpen = false;
  menuToggle.addEventListener('click', (e) => {
    if (!toggleOpen) {
      target.classList.add('header-open');
      wholeDocument.style.overflow = "hidden";
      toggleOpen = true;
    } else {
      target.classList.remove('header-open');
      wholeDocument.style.overflow = "visible";
      toggleOpen = false;
    }
  });


  const limit = 400;
  let scrollPosition = 0;
  let ticking = false;
  window.addEventListener('scroll', (e) => {
    scrollPosition = window.scrollY;
    if(!ticking) {
      window.requestAnimationFrame(() => {
        if (limit < scrollPosition) {
          sticky.classList.add('sticky-on');
        } else {
          sticky.classList.remove('sticky-on');
        }
        ticking = false;
      });
    }
    ticking = true;
  });
});
