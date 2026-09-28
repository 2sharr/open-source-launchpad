/**
 * Adds a "Copy" button to every code block, so nobody has to select a command
 * by hand and accidentally miss the first character.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var blocks = document.querySelectorAll("pre > code");

    Array.prototype.forEach.call(blocks, function (code) {
      var pre = code.parentNode;

      var wrap = document.createElement("div");
      wrap.className = "code-wrap";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      var button = document.createElement("button");
      button.type = "button";
      button.className = "copy-btn";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy this code to the clipboard");
      wrap.appendChild(button);

      button.addEventListener("click", function () {
        var text = code.textContent;

        function done() {
          button.textContent = "Copied";
          button.classList.add("copy-btn--done");
          setTimeout(function () {
            button.textContent = "Copy";
            button.classList.remove("copy-btn--done");
          }, 1600);
        }

        function failed() {
          button.textContent = "Press Ctrl+C";
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, failed);
          return;
        }

        // Older browsers, and any page not served over https.
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "absolute";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
          done();
        } catch (e) {
          failed();
        }
        document.body.removeChild(area);
      });
    });
  });
})();
