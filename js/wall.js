/**
 * The contributor wall.
 *
 * Reads contributors/index.json, which is rebuilt automatically by a GitHub
 * Action every time a contributor file is merged. Nobody edits index.json by
 * hand — see scripts/build_contributors.py.
 */
(function () {
  "use strict";

  var INDEX_URL = "contributors/index.json";

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function cardFor(person) {
    var handle = escapeHtml(person.github || "");
    var name = escapeHtml(person.name || person.github || "Anonymous");
    var quote = person.quote ? escapeHtml(person.quote) : "";
    var tags = Array.isArray(person.interests) ? person.interests : [];

    var avatar = handle
      ? "https://github.com/" + encodeURIComponent(handle) + ".png?size=96"
      : "";

    var html = '<article class="contributor-card">';
    html += '<div class="contributor-card__head">';
    if (avatar) {
      html +=
        '<img class="contributor-card__avatar" src="' +
        avatar +
        '" alt="" width="48" height="48" loading="lazy">';
    }
    html += "<div>";
    html += '<p class="contributor-card__name">' + name + "</p>";
    if (handle) {
      html +=
        '<a class="contributor-card__handle" href="https://github.com/' +
        encodeURIComponent(handle) +
        '">@' +
        handle +
        "</a>";
    }
    html += "</div></div>";

    if (quote) {
      html += '<p class="contributor-card__quote">“' + quote + "”</p>";
    }

    if (tags.length) {
      html += '<div class="tag-row">';
      tags.slice(0, 4).forEach(function (tag) {
        html += '<span class="tag">' + escapeHtml(tag) + "</span>";
      });
      html += "</div>";
    }

    html += "</article>";
    return html;
  }

  function render(people, listEl, countEl) {
    if (!people.length) {
      listEl.innerHTML =
        '<li class="wall-empty">No contributors match that search.</li>';
    } else {
      listEl.innerHTML = people
        .map(function (person) {
          return "<li>" + cardFor(person) + "</li>";
        })
        .join("");
    }

    if (countEl) {
      countEl.textContent =
        people.length + (people.length === 1 ? " contributor" : " contributors");
    }
  }

  function matches(person, query) {
    if (!query) return true;
    var haystack = [
      person.name,
      person.github,
      person.quote,
      (person.interests || []).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var listEl = document.getElementById("wall");
    if (!listEl) return;

    var countEl = document.getElementById("wall-count");
    var searchEl = document.getElementById("wall-search");
    var everyone = [];

    fetch(INDEX_URL)
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (data) {
        everyone = Array.isArray(data) ? data : data.contributors || [];
        everyone.sort(function (a, b) {
          return String(a.github || "").localeCompare(String(b.github || ""));
        });
        render(everyone, listEl, countEl);
      })
      .catch(function () {
        listEl.innerHTML =
          '<li class="wall-empty">' +
          "Could not load the contributor list.<br>" +
          "If you are opening this file directly from your computer, your browser " +
          "blocks reading local files. Run <code>python3 -m http.server</code> in " +
          "the project folder and open <code>http://localhost:8000</code> instead." +
          "</li>";
      });

    if (searchEl) {
      searchEl.addEventListener("input", function () {
        var query = searchEl.value.trim().toLowerCase();
        render(
          everyone.filter(function (person) {
            return matches(person, query);
          }),
          listEl,
          countEl
        );
      });
    }
  });
})();
