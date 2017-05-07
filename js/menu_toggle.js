"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var menuToggle = document.getElementById("menu-toggle");
  var wholeDocument = document.body;
  var target = document.getElementById("main-header");
  var sticky = document.getElementById("sticky-wrapper");

  var toggleOpen = false;
  menuToggle.addEventListener('click', function (e) {
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

  var limit = 400;
  var scrollPosition = 0;
  var ticking = false;
  window.addEventListener('scroll', function (e) {
    scrollPosition = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function () {
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