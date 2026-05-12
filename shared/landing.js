/* =====================================================================
   Four Gate Alpha — landing pages: progressive enhancement
   countdown · ticker strips · FAQ accordion · scroll reveals · count-up
   Plain ES5-ish, no deps. Pages still work fully with JS disabled.
   ===================================================================== */
(function () {
  var html = document.documentElement;
  html.classList.add("has-js");

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  } catch (e) {}

  function each(list, fn) {
    Array.prototype.forEach.call(list || [], fn);
  }
  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  /* ---------- Countdown -------------------------------------------------
     <span class="lp-countdown" data-countdown="2026-09-15T09:30:00-04:00"
           data-units="dhms"></span>                                     */
  var UNIT_LABELS = { d: "Days", h: "Hrs", m: "Min", s: "Sec" };
  function renderCountdown(el) {
    var target = new Date(el.getAttribute("data-countdown") || "").getTime();
    if (isNaN(target)) return;
    var units = (el.getAttribute("data-units") || "dhms").split("");
    var timer = window.setInterval(tick, 1000);
    tick();
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        window.clearInterval(timer);
        el.innerHTML =
          '<span class="unit"><span class="v">OPEN</span><span class="l">Now live</span></span>';
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var map = { d: String(d), h: pad2(h), m: pad2(m), s: pad2(s) };
      var out = [];
      for (var i = 0; i < units.length; i++) {
        var u = units[i];
        out.push(
          '<span class="unit"><span class="v">' +
            (map[u] != null ? map[u] : "") +
            '</span><span class="l">' +
            (UNIT_LABELS[u] || "") +
            "</span></span>",
        );
        if (i < units.length - 1) out.push('<span class="sep">:</span>');
      }
      el.innerHTML = out.join("");
    }
  }
  each(document.querySelectorAll("[data-countdown]"), renderCountdown);

  /* ---------- Ticker strips -------------------------------------------
     <span class="lp-ticker-track" data-ticker></span>  (inside .lp-ticker-strip) */
  var SYMBOLS = [
    ["SPX", "5,287.41", "+0.42%", "pos"],
    ["NDX", "18,492.10", "+0.61%", "pos"],
    ["VIX", "13.18", "-1.24%", "neg"],
    ["DXY", "104.62", "+0.08%", "pos"],
    ["US10Y", "4.317%", "+2.1bp", "pos"],
    ["BRENT", "82.04", "-0.71%", "neg"],
    ["GOLD", "2,338.50", "+0.18%", "pos"],
    ["BTC", "61,402", "+1.92%", "pos"],
    ["SMH", "238.91", "+1.04%", "pos"],
    ["XLE", "92.76", "-0.34%", "neg"],
    ["QQQ", "451.18", "+0.58%", "pos"],
    ["IWM", "204.31", "+0.22%", "pos"],
    ["EURUSD", "1.0851", "-0.11%", "neg"],
    ["AAPL", "218.40", "+0.71%", "pos"],
    ["NVDA", "118.92", "+2.04%", "pos"],
    ["MSFT", "441.06", "+0.33%", "pos"],
  ];
  function buildTicker(el) {
    var run = SYMBOLS.map(function (r) {
      return (
        '<span class="lp-ticker-item"><span class="sym">' +
        r[0] +
        "</span><span>" +
        r[1] +
        '</span><span class="' +
        r[3] +
        '">' +
        r[2] +
        '</span><span class="dot" aria-hidden="true"></span></span>'
      );
    }).join("");
    el.innerHTML = run + run;
  }
  each(document.querySelectorAll("[data-ticker]"), buildTicker);

  /* ---------- FAQ accordion (single-open) ----------------------------- */
  each(document.querySelectorAll(".lp-faq-q"), function (btn) {
    var item = btn.closest ? btn.closest(".lp-faq-item") : btn.parentNode;
    btn.setAttribute(
      "aria-expanded",
      item && item.classList.contains("is-open") ? "true" : "false",
    );
    btn.addEventListener("click", function () {
      if (!item) return;
      var open = item.classList.contains("is-open");
      var scope = (item.closest && item.closest(".lp-faq")) || document;
      each(scope.querySelectorAll(".lp-faq-item.is-open"), function (other) {
        if (other === item) return;
        other.classList.remove("is-open");
        var b = other.querySelector(".lp-faq-q");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", !open);
      btn.setAttribute("aria-expanded", !open ? "true" : "false");
    });
  });

  /* ---------- Scroll reveals ------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        each(entries, function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    each(revealEls, function (el) {
      io.observe(el);
    });
  } else {
    each(revealEls, function (el) {
      el.classList.add("is-in");
    });
  }

  /* ---------- Stat count-up ------------------------------------------
     <span class="v" data-count="40" data-suffix="%"></span>            */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute("data-count"));
    if (isNaN(to)) return;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10) || 0;
    function set(v) {
      el.textContent = prefix + v.toFixed(decimals) + suffix;
    }
    if (reduceMotion || !window.requestAnimationFrame) {
      set(to);
      return;
    }
    var dur = 1100,
      start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      set(to * eased);
      if (p < 1) window.requestAnimationFrame(step);
      else set(to);
    }
    window.requestAnimationFrame(step);
  }
  var countEls = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(
      function (entries) {
        each(entries, function (e) {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.45 },
    );
    each(countEls, function (el) {
      cio.observe(el);
    });
  } else {
    each(countEls, animateCount);
  }

  /* ---------- Background parallax -------------------------------------
     Any element carrying data-parallax drifts as the page scrolls (and a
     touch as the pointer moves), so fixed background fields stop feeling
     glued to the viewport.
       data-parallax    = px translateY across the full page scroll
                          (negative = drifts up; positive = drifts down)
       data-parallax-x  = px amplitude of pointer-driven drift (optional)
     Bounded by scroll progress, so it never wanders off — and disabled
     entirely under prefers-reduced-motion.                                */
  (function () {
    if (reduceMotion || !window.requestAnimationFrame) return;
    var layers = [];
    each(document.querySelectorAll("[data-parallax]"), function (el) {
      layers.push({
        el: el,
        ty: parseFloat(el.getAttribute("data-parallax")) || 0,
        amp: parseFloat(el.getAttribute("data-parallax-x")) || 0,
      });
      el.style.willChange = "transform";
    });
    if (!layers.length) return;

    var pxT = 0,
      pyT = 0,
      pxC = 0,
      pyC = 0,
      running = false,
      lastSc = NaN;

    function kick() {
      if (!running) {
        running = true;
        window.requestAnimationFrame(frame);
      }
    }
    function onPointer(e) {
      var t = e.touches ? e.touches[0] : e;
      if (!t) return;
      var w = window.innerWidth || 1,
        h = window.innerHeight || 1;
      pxT = (t.clientX / w - 0.5) * 2;
      pyT = (t.clientY / h - 0.5) * 2;
      kick();
    }
    function frame() {
      var max =
        (document.documentElement.scrollHeight || 0) -
          (window.innerHeight || 0) || 1;
      var sc = window.pageYOffset || document.documentElement.scrollTop || 0;
      var p = sc / max;
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      pxC += (pxT - pxC) * 0.12;
      pyC += (pyT - pyC) * 0.12;
      for (var i = 0; i < layers.length; i++) {
        var L = layers[i];
        var x = pxC * L.amp;
        var y = L.ty * p + pyC * L.amp * 0.6;
        L.el.style.transform =
          "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
      }
      var settled =
        Math.abs(pxT - pxC) < 0.0015 && Math.abs(pyT - pyC) < 0.0015;
      var scrollIdle = sc === lastSc;
      lastSc = sc;
      if (settled && scrollIdle) {
        running = false;
        return;
      }
      window.requestAnimationFrame(frame);
    }

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    window.addEventListener("load", kick);
    window.addEventListener("pointermove", onPointer, { passive: true });
    kick();
  })();
})();
