(function () {
  var current = window.location.search; // "?utm_source=...&clickid=..."
  if (!current || current === "?") return;

  var incoming = new URLSearchParams(current);
  var links = document.querySelectorAll('a[href*="slotjs.devgame.pro/login"]');

  links.forEach(function (a) {
    var url = new URL(a.getAttribute("href"), window.location.origin);
    // параметры, уже присутствующие на самой ссылке, имеют приоритет
    incoming.forEach(function (value, key) {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });
    a.setAttribute("href", url.toString());
  });
})();
