/* Plays each infographic once, when it scrolls into view: CSS animations
   via the .in class, and SMIL animations (begin="indefinite") via beginElement. */
(function () {
  "use strict";
  var root = document.documentElement;
  function play(el) {
    el.classList.add("in");
    el.querySelectorAll('[begin="indefinite"]').forEach(function (a) {
      try { a.beginElement(); } catch (e) {}
    });
  }
  var all = document.querySelectorAll(".ig");
  if (!("IntersectionObserver" in window)) { all.forEach(play); return; }
  root.classList.add("js");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { play(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  all.forEach(function (el) { io.observe(el); });
})();
