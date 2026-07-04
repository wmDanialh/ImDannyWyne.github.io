"use strict";

/* ============================================================
   1. CANVAS CIRCUIT ANIMATION
   ============================================================ */
(function CircuitCanvas() {
  var canvas = document.getElementById("circuit-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var W, H, nodes, lines;
  var NODE_COUNT = 55,
    LINE_DIST = 160,
    SPEED = 0.35;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, function () {
      return {
        x: rand(0, W),
        y: rand(0, H),
        vx: rand(-SPEED, SPEED),
        vy: rand(-SPEED, SPEED),
        r: rand(1.5, 3.5),
      };
    });
    lines = [];
    for (var i = 0; i < NODE_COUNT; i++)
      for (var j = i + 1; j < NODE_COUNT; j++) lines.push([i, j]);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    nodes.forEach(function (n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    lines.forEach(function (pair) {
      var a = nodes[pair[0]],
        b = nodes[pair[1]];
      var dx = a.x - b.x,
        dy = a.y - b.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > LINE_DIST) return;
      var alpha = (1 - dist / LINE_DIST) * 0.18;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = "rgba(0,212,255," + alpha + ")";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });
    nodes.forEach(function (n) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,212,255,0.45)";
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", function () {
    resize();
    initNodes();
  });
  resize();
  initNodes();
  draw();
})();

/* ============================================================
   2. NAVBAR -- scroll + mobile toggle
   ============================================================ */
(function Navbar() {
  var navbar = document.getElementById("navbar");
  var toggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  window.addEventListener(
    "scroll",
    function () {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true },
  );

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open);
    });
  }

  if (navLinks) {
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var sections = document.querySelectorAll("section[id]");
  var links = document.querySelectorAll(".nav-link[data-section]");
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle("active", l.dataset.section === e.target.id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  sections.forEach(function (s) {
    io.observe(s);
  });
})();

/* ============================================================
   3. TYPED TITLE
   ============================================================ */
(function TypedTitle() {
  var el = document.getElementById("typed-title");
  if (!el) return;

  var titles = [
    "Resident Engineer",
    "IT Support Specialist",
    "Full Stack Engineer",
    "Full Stack Developer",
    "Front-End Engineer",
    "Back-End Engineer",
    "Programmer",
    "Data Analyst",
    "Data Engineer",
  ];

  var tIdx = 0,
    cIdx = 0,
    deleting = false;

  function tick() {
    var current = titles[tIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 75);
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        tIdx = (tIdx + 1) % titles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 38);
    }
  }
  setTimeout(tick, 600);
})();

/* ============================================================
   4. SCROLL REVEAL
   ============================================================ */
(function ScrollReveal() {
  var hardcoded = document.querySelectorAll(
    ".section-header, .about-text, .about-skills-preview," +
      ".skill-category-card, .contact-text, .contact-visual",
  );
  hardcoded.forEach(function (el) {
    el.classList.add("reveal");
  });

  var allTargets = document.querySelectorAll(".reveal");
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
  );

  allTargets.forEach(function (el) {
    io.observe(el);
  });
})();

/* ============================================================
   5. STAT COUNTER
   ============================================================ */
(function StatCounter() {
  var stats = document.querySelectorAll(".stat-number[data-target]");
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target,
          target = +el.dataset.target,
          dur = 1400,
          start = performance.now();
        function step(now) {
          var prog = Math.min((now - start) / dur, 1);
          var ease = 1 - Math.pow(1 - prog, 3);
          el.textContent = Math.round(ease * target);
          if (prog < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );
  stats.forEach(function (el) {
    io.observe(el);
  });
})();

/* ============================================================
   6. SKILL BAR ANIMATION
   ============================================================ */
(function SkillBars() {
  var fills = document.querySelectorAll(".skill-bar-fill[data-width]");
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          setTimeout(function () {
            el.style.width = el.dataset.width + "%";
          }, 200);
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.3 },
  );
  fills.forEach(function (el) {
    io.observe(el);
  });
})();

/* ============================================================
   7. PROJECTS -- filter + pagination
   Source: window.projectsData (from projects-data.js)
   ============================================================ */
(function Projects() {
  var projectsData = window.projectsData;
  if (!projectsData || !Array.isArray(projectsData)) {
    console.warn(
      "Projects: window.projectsData not found. Check projects-data.js is loaded.",
    );
    return;
  }

  var grid = document.getElementById("projects-grid");
  var pagination = document.getElementById("projects-pagination");
  var btnFirst = document.getElementById("page-first");
  var btnPrev = document.getElementById("page-prev");
  var btnNext = document.getElementById("page-next");
  var btnLast = document.getElementById("page-last");
  var pageNums = document.getElementById("page-numbers");
  var filterBtns = document.querySelectorAll(
    ".filter-btn:not([data-cert-filter])",
  );

  if (!grid) return;

  var PER_PAGE = 3;
  var currentPage = 1;
  var activeFilter = "all";

  var catGradients = {
    backend: "linear-gradient(135deg,#0a1628 0%,#0d2137 100%)",
    fullstack: "linear-gradient(135deg,#0a1e28 0%,#0d3020 100%)",
    ml: "linear-gradient(135deg,#1a0a28 0%,#2d1040 100%)",
    devops: "linear-gradient(135deg,#1a1a0a 0%,#2a2810 100%)",
    blockchain: "linear-gradient(135deg,#1a0a2a 0%,#200a3a 100%)",
    def: "linear-gradient(135deg,#0a0f1a 0%,#0d1828 100%)",
  };

  function getFiltered() {
    return activeFilter === "all"
      ? projectsData
      : projectsData.filter(function (p) {
          return p.category === activeFilter;
        });
  }

  function githubSVG() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>';
  }
  function liveSVG() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
  }

  function createCard(p) {
    var imgStyle = p.image
      ? "background:url('" + p.image + "') center/cover no-repeat;"
      : "background:" + (catGradients[p.category] || catGradients.def) + ";";

    var githubBtn =
      p.links && p.links.github
        ? '<a href="' +
          p.links.github +
          '" class="project-link-btn" target="_blank" rel="noopener" aria-label="GitHub repository" title="GitHub">' +
          githubSVG() +
          "</a>"
        : "";
    var liveBtn =
      p.links && p.links.demo
        ? '<a href="' +
          p.links.demo +
          '" class="project-link-btn project-link-btn--live" target="_blank" rel="noopener" aria-label="Live demo" title="Live Demo">' +
          liveSVG() +
          "</a>"
        : "";

    var featuredBadge = p.featured
      ? '<span class="project-featured-badge"><span>&#9733;</span> Featured</span>'
      : "";
    var tagsHtml = (p.tags || [])
      .map(function (t) {
        return '<span class="project-tag">' + t + "</span>";
      })
      .join("");

    var card = document.createElement("article");
    card.className = "project-card" + (p.featured ? " featured" : "");
    card.innerHTML =
      '<div class="project-thumb" style="' +
      imgStyle +
      '">' +
      '<div class="project-thumb-overlay"></div>' +
      '<span class="project-category-badge">' +
      (p.category || "") +
      "</span>" +
      "</div>" +
      '<div class="project-body">' +
      featuredBadge +
      '<div class="project-card-header">' +
      '<h3 class="project-title">' +
      p.title +
      "</h3>" +
      '<div class="project-links">' +
      githubBtn +
      liveBtn +
      "</div>" +
      "</div>" +
      '<p class="project-desc">' +
      p.desc +
      "</p>" +
      '<div class="project-tags">' +
      tagsHtml +
      "</div>" +
      "</div>";
    return card;
  }

  function renderPageNumbers(totalPages) {
    pageNums.innerHTML = "";
    if (totalPages < 1) return;
    var range = [];
    for (var i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      )
        range.push(i);
      else if (range[range.length - 1] !== "...") range.push("...");
    }
    range.forEach(function (item) {
      if (item === "...") {
        var el = document.createElement("span");
        el.className = "page-ellipsis";
        el.textContent = "...";
        pageNums.appendChild(el);
      } else {
        var btn = document.createElement("button");
        btn.className = "page-num" + (item === currentPage ? " active" : "");
        btn.textContent = item;
        btn.setAttribute("aria-label", "Page " + item);
        btn.setAttribute(
          "aria-current",
          item === currentPage ? "page" : "false",
        );
        btn.addEventListener("click", function () {
          goTo(item);
        });
        pageNums.appendChild(btn);
      }
    });
  }

  function renderPage() {
    var filtered = getFiltered();
    var totalPages = Math.ceil(filtered.length / PER_PAGE);
    var slice = filtered.slice(
      (currentPage - 1) * PER_PAGE,
      currentPage * PER_PAGE,
    );
    grid.innerHTML = "";
    slice.forEach(function (p) {
      grid.appendChild(createCard(p));
    });
    pagination.style.display = totalPages > 1 ? "flex" : "none";
    btnFirst.disabled = currentPage === 1;
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages || totalPages === 0;
    btnLast.disabled = currentPage === totalPages || totalPages === 0;
    renderPageNumbers(totalPages);
  }

  function goTo(page) {
    var totalPages = Math.ceil(getFiltered().length / PER_PAGE);
    currentPage = Math.max(1, Math.min(page, totalPages));
    renderPage();
    var s = document.getElementById("projects");
    if (s) s.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      currentPage = 1;
      renderPage();
    });
  });

  if (btnFirst)
    btnFirst.addEventListener("click", function () {
      goTo(1);
    });
  if (btnPrev)
    btnPrev.addEventListener("click", function () {
      goTo(currentPage - 1);
    });
  if (btnNext)
    btnNext.addEventListener("click", function () {
      goTo(currentPage + 1);
    });
  if (btnLast)
    btnLast.addEventListener("click", function () {
      goTo(Math.ceil(getFiltered().length / PER_PAGE));
    });

  renderPage();
})();

/* ============================================================
   8. CERTIFICATIONS -- category filter + pagination
   Source: window.certsData (from certs-data.js)
   ============================================================ */
(function Certifications() {
  var allCerts = window.certsData;
  if (!allCerts || !Array.isArray(allCerts)) {
    console.warn(
      "Certifications: window.certsData not found. Check certs-data.js is loaded.",
    );
    return;
  }

  var grid = document.getElementById("cert-grid");
  var pagination = document.getElementById("cert-pagination");
  var btnFirst = document.getElementById("cert-first");
  var btnPrev = document.getElementById("cert-prev");
  var btnNext = document.getElementById("cert-next");
  var btnLast = document.getElementById("cert-last");
  var pageNums = document.getElementById("cert-page-numbers");

  if (!grid) return;

  var PER_PAGE = 8;
  var currentPage = 1;
  var activeCategory = "all";

  var categories = [
    { key: "all", label: "All" },
    { key: "fullstack", label: "Full Stack" },
    { key: "data", label: "Data Analytics" },
    { key: "cybersecurity", label: "Cybersecurity" },
    { key: "cloud", label: "Cloud & DevOps" },
    { key: "technical", label: "IT Support" },
    { key: "python", label: "Python" },
    { key: "c#", label: "C#" },
  ];

  var filterBar = document.getElementById("cert-filter-bar");
  if (filterBar) {
    categories.forEach(function (cat) {
      var btn = document.createElement("button");
      btn.className = "filter-btn" + (cat.key === "all" ? " active" : "");
      btn.textContent = cat.label;
      btn.dataset.certFilter = cat.key;
      btn.addEventListener("click", function () {
        filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        activeCategory = cat.key;
        currentPage = 1;
        renderPage();
      });
      filterBar.appendChild(btn);
    });
  }

  function getFiltered() {
    return activeCategory === "all"
      ? allCerts
      : allCerts.filter(function (c) {
          return c.category === activeCategory;
        });
  }

  function createCertCard(c) {
    var card = document.createElement("a");
    card.className = "cert-card";
    card.href = c.url || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", c.name + " certification");

    var badgeHtml = c.badge
      ? '<img src="' +
        c.badge +
        '" alt="' +
        c.name +
        ' badge" class="cert-badge-img" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
      : "";
    var fallback =
      '<div class="cert-badge-fallback"' +
      (c.badge ? ' style="display:none"' : "") +
      ">&#127885;</div>";

    card.innerHTML =
      '<div class="cert-badge-wrap">' +
      badgeHtml +
      fallback +
      "</div>" +
      '<div class="cert-info">' +
      '<div class="cert-name">' +
      c.name +
      "</div>" +
      '<div class="cert-issuer">' +
      c.issuer +
      "</div>" +
      '<div class="cert-year">Issued ' +
      c.year +
      "</div>" +
      "</div>" +
      '<div class="cert-arrow">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
      "</div>";
    return card;
  }

  function renderPageNumbers(totalPages) {
    pageNums.innerHTML = "";
    if (totalPages < 1) return;
    var range = [];
    for (var i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      )
        range.push(i);
      else if (range[range.length - 1] !== "...") range.push("...");
    }
    range.forEach(function (item) {
      if (item === "...") {
        var el = document.createElement("span");
        el.className = "page-ellipsis";
        el.textContent = "...";
        pageNums.appendChild(el);
      } else {
        var btn = document.createElement("button");
        btn.className = "page-num" + (item === currentPage ? " active" : "");
        btn.textContent = item;
        btn.setAttribute("aria-label", "Page " + item);
        btn.setAttribute(
          "aria-current",
          item === currentPage ? "page" : "false",
        );
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          goTo(item);
        });
        pageNums.appendChild(btn);
      }
    });
  }

  function renderPage() {
    var filtered = getFiltered();
    var totalPages = Math.ceil(filtered.length / PER_PAGE);
    var slice = filtered.slice(
      (currentPage - 1) * PER_PAGE,
      currentPage * PER_PAGE,
    );
    grid.innerHTML = "";
    if (slice.length === 0) {
      grid.innerHTML =
        '<p style="color:var(--text-muted);font-family:var(--font-mono);grid-column:1/-1;padding:24px 0">No certifications in this category yet.</p>';
    } else {
      slice.forEach(function (c) {
        grid.appendChild(createCertCard(c));
      });
    }
    pagination.style.display = totalPages > 1 ? "flex" : "none";
    btnFirst.disabled = currentPage === 1;
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages || totalPages === 0;
    btnLast.disabled = currentPage === totalPages || totalPages === 0;
    renderPageNumbers(totalPages);
  }

  function goTo(page) {
    var totalPages = Math.ceil(getFiltered().length / PER_PAGE);
    currentPage = Math.max(1, Math.min(page, totalPages));
    renderPage();
    var s = document.getElementById("certs");
    if (s) s.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (btnFirst)
    btnFirst.addEventListener("click", function (e) {
      e.preventDefault();
      goTo(1);
    });
  if (btnPrev)
    btnPrev.addEventListener("click", function (e) {
      e.preventDefault();
      goTo(currentPage - 1);
    });
  if (btnNext)
    btnNext.addEventListener("click", function (e) {
      e.preventDefault();
      goTo(currentPage + 1);
    });
  if (btnLast)
    btnLast.addEventListener("click", function (e) {
      e.preventDefault();
      goTo(Math.ceil(getFiltered().length / PER_PAGE));
    });

  renderPage();
})();

/* ============================================================
   9. GLOW CURSOR
   ============================================================ */
(function GlowCursor() {
  var glow = document.getElementById("cursor-glow");
  if (!glow || window.matchMedia("(pointer: coarse)").matches) return;
  var cx = -200,
    cy = -200;
  document.addEventListener(
    "mousemove",
    function (e) {
      cx = e.clientX;
      cy = e.clientY;
    },
    { passive: true },
  );
  (function animateGlow() {
    glow.style.left = cx + "px";
    glow.style.top = cy + "px";
    requestAnimationFrame(animateGlow);
  })();
})();

/* ============================================================
   VIEW COUNTER
   ============================================================ */
async function initViewCounter() {
  const counterEl = document.getElementById("view-counter");
  if (!counterEl) return;
  try {
    const res = await fetch(
      "https://api.counterapi.dev/v1/dannywyne.portfolio/views/up",
    );
    const data = await res.json();
    if (data.count) {
      counterEl.textContent = data.count.toString().padStart(6, "0");
    }
  } catch (err) {
    console.error("Counter error:", err);
  }
}
document.addEventListener("DOMContentLoaded", initViewCounter);
