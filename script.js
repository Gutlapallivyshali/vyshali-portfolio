/* ==============================
   VYSHALI PORTFOLIO — INTERACTIONS
   ============================== */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // ----- Light / dark theme -----
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);

    const isDark = theme === "dark";

    themeIcon.textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );

    const themeColor = isDark ? "#101713" : "#f7faf7";
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    if (themeMeta) {
      themeMeta.setAttribute("content", themeColor);
    }
  }

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("vyshali-portfolio-theme");
  } catch (error) {
    // The site still works when browser storage is unavailable.
  }

  setTheme(savedTheme === "dark" ? "dark" : "light");

  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    setTheme(nextTheme);

    try {
      localStorage.setItem("vyshali-portfolio-theme", nextTheme);
    } catch (error) {
      // Theme changes still work for this page session.
    }
  });

  // ----- Mobile navigation -----
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = navLinks.querySelectorAll("a");

  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Close the mobile menu when returning to desktop layout.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  // ----- Project category filters -----
  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");
  const projectCount = document.getElementById("project-count");

  function filterProjects(category) {
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(/\s+/);
      const matches = category === "all" || categories.includes(category);

      card.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    projectCount.textContent =
      `${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach((item) => {
        const selected = item === button;

        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      filterProjects(selectedCategory);
    });
  });

  // ----- Scroll reveal animations -----
  const revealElements = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // ----- Current year in footer -----
  document.getElementById("current-year").textContent =
    new Date().getFullYear();
});