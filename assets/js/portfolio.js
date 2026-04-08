(function () {
  "use strict";

  var THEME_KEY = "portfolio-theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (e) {
      /* ignore */
    }
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      var isDark = theme === "dark";
      toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    if (stored === "dark" || stored === "light") {
      applyTheme(stored);
      return;
    }
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("dark");
    } else {
      applyTheme("light");
    }
  }

  function toggleTheme() {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setStoredTheme(next);
    applyTheme(next);
  }

  function initMobileNav() {
    var nav = document.getElementById("site-nav");
    var overlay = document.getElementById("nav-overlay");
    var openBtn = document.getElementById("nav-open");
    if (!nav || !openBtn) return;

    function closeNav() {
      nav.classList.remove("is-open");
      if (overlay) overlay.classList.remove("is-visible");
      openBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    function openNav() {
      nav.classList.add("is-open");
      if (overlay) overlay.classList.add("is-visible");
      openBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    openBtn.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeNav();
      else openNav();
    });

    if (overlay) {
      overlay.addEventListener("click", closeNav);
    }

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 1023px)").matches) closeNav();
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 1024px)").matches) closeNav();
    });
  }

  function initSmoothScrollOffset() {
    /* Native smooth scroll handles behavior; nav closes on mobile above */
  }

  function initScrollSpy() {
    var hero = document.getElementById("hero");
    var main = document.querySelector("main");
    if (!main) return;
    var mainSections = main.querySelectorAll("section[id]");
    var sections = hero ? [hero].concat(Array.prototype.slice.call(mainSections)) : Array.prototype.slice.call(mainSections);
    var links = document.querySelectorAll('#site-nav a[href^="#"]');
    if (!sections.length || !links.length) return;

    var offset = 100;

    function update() {
      var scrollPos = window.scrollY + offset;
      var current = sections[0] ? sections[0].id : "";
      for (var i = 0; i < sections.length; i++) {
        var sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) current = sec.id;
      }
      links.forEach(function (a) {
        var hash = a.getAttribute("href");
        a.classList.toggle("is-active", hash === "#" + current);
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function initBackToTop() {
    var btn = document.getElementById("back-top");
    if (!btn) return;

    function toggle() {
      if (window.scrollY > 400) btn.classList.add("is-visible");
      else btn.classList.remove("is-visible");
    }

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    var themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    initMobileNav();
    initSmoothScrollOffset();
    initScrollSpy();
    initBackToTop();
  });
})();
