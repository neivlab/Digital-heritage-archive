// this code is from https://codesandbox.io/p/sandbox/responsive-navbar-html-css-js-1t4um7?file=%2Fscript.js%3A1%2C1-9%2C1

const mobileNav = document.querySelector(".hamburger");
const navbar = document.querySelector(".menubar");

const toggleNav = () => {
  navbar.classList.toggle("active");
  mobileNav.classList.toggle("hamburger-active");
};
mobileNav.addEventListener("click", () => toggleNav());
