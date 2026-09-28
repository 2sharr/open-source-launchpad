/**
 * Light / dark theme toggle.
 *
 * The choice is saved in localStorage so it survives a page change. If the
 * viewer has never chosen, we follow their operating system setting (that is
 * handled in CSS by the prefers-color-scheme media query).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "launchpad-theme";
  var root = document.documentElement;

  function readStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // Private browsing, or storage is blocked. Not a problem — we just
      // fall back to the system preference.
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* nothing we can do, and nothing that needs doing */
    }
  }

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    var button = document.querySelector(".theme-toggle");
    if (!button) return;
    var isDark = theme === "dark";
    button.textContent = isDark ? "☀" : "☾";
    button.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
    button.setAttribute("title", button.getAttribute("aria-label"));
  }

  // Apply the stored choice as early as possible to avoid a flash of the
  // wrong theme.
  var stored = readStoredTheme();
  if (stored === "dark" || stored === "light") {
    root.dataset.theme = stored;
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(currentTheme());

    var button = document.querySelector(".theme-toggle");
    if (!button) return;

    button.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  });
})();
