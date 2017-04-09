"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var menuToggle = document.getElementById("menu-toggle");
  var menuArea = document.getElementById("menu-nav");
  menuToggle.addEventListener('click', function (e) {
    menuArea.classList.toggle('open');
  });
});