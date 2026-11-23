/* Sticky menu: marks the section being read, and on phones keeps that
   chip visible inside the swipeable link row (without moving the page). */
(function () {
  "use strict";
  var bar = document.getElementById("navlinks");
  if (!bar || !("IntersectionObserver" in window)) return;
  var links = {};
  bar.querySelectorAll("a[href^='#']").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  var current = null;
  function mark(id) {
    if (id === current || !links[id]) return;
    if (current && links[current]) links[current].classList.remove("on");
    current = id;
    var a = links[id];
    a.classList.add("on");
    if (bar.scrollWidth > bar.clientWidth) {
      var left = a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2;
      bar.scrollTo({ left: left, behavior: "smooth" });
    }
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(links).forEach(function (id) {
    var s = document.getElementById(id);
    if (s) io.observe(s);
  });
})();
