const root = document.documentElement;
const body = document.body;

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const currentYear = document.querySelector("[data-current-year]");

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getActiveTheme = () => {
  return root.dataset.theme || getSystemTheme();
};

const setThemeLabel = () => {
  if (!themeLabel) return;

  const activeTheme = getActiveTheme();
  themeLabel.textContent = activeTheme === "dark" ? "Oscuro" : "Claro";
};

const applySavedTheme = () => {
  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  }

  setThemeLabel();
};

const toggleTheme = () => {
  const activeTheme = getActiveTheme();
  const nextTheme = activeTheme === "dark" ? "light" : "dark";

  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  setThemeLabel();
};

const setupThemeToggle = () => {
  if (!themeToggle) return;

  themeToggle.addEventListener("click", toggleTheme);

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!localStorage.getItem("portfolio-theme")) {
      setThemeLabel();
    }
  });
};

const setupMobileMenu = () => {
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
};

const setupActiveNavigation = () => {
  const links = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};

const setupRotatingWords = () => {
  const wordElement = document.querySelector("[data-rotating-word]");

  if (!wordElement) return;

  const words = wordElement.dataset.words
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) return;

  let index = 0;

  setInterval(() => {
    index = (index + 1) % words.length;

    wordElement.style.opacity = "0";

    window.setTimeout(() => {
      wordElement.textContent = words[index];
      wordElement.style.opacity = "1";
    }, 160);
  }, 1500);
};

const setupRevealAnimations = () => {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
};

const setupCopyEmail = () => {
  const copyButtons = document.querySelectorAll("[data-copy-email]");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail;

      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);

        const originalText = button.textContent;
        button.textContent = "Email copiado";

        window.setTimeout(() => {
          button.textContent = originalText;
        }, 1600);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  });
};

const setupProjectFilters = () => {
  const filterButtons = document.querySelectorAll("[data-project-filter]");
  const projectCards = document.querySelectorAll("[data-project-category]");

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.projectFilter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach((card) => {
        const category = card.dataset.projectCategory;
        const shouldShow = filter === "todos" || category === filter;

        card.hidden = !shouldShow;
      });
    });
  });
};

const setupDocsSearch = () => {
  const searchInput = document.querySelector("[data-docs-search]");
  const docCards = document.querySelectorAll("[data-doc-card]");
  const filterButtons = document.querySelectorAll("[data-doc-filter]");

  if (!docCards.length) return;

  let activeFilter = "todos";

  const updateDocs = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    docCards.forEach((card) => {
      const searchableText = card.textContent.toLowerCase();
      const category = card.dataset.docCategory || "otros";

      const matchesSearch = searchableText.includes(query);
      const matchesFilter = activeFilter === "todos" || category === activeFilter;

      card.hidden = !matchesSearch || !matchesFilter;
    });
  };

  if (searchInput) {
    searchInput.addEventListener("input", updateDocs);
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.docFilter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      updateDocs();
    });
  });

  updateDocs();
};

const setupTimeline = () => {
  const timelineButtons = document.querySelectorAll("[data-timeline-button]");
  const timelineItems = document.querySelectorAll("[data-timeline-item]");

  if (!timelineButtons.length || !timelineItems.length) return;

  timelineButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.timelineButton;

      timelineButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      timelineItems.forEach((item) => {
        item.hidden = target !== "todo" && item.dataset.timelineItem !== target;
      });
    });
  });
};

const setCurrentYear = () => {
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
};

applySavedTheme();

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setupMobileMenu();
  setupActiveNavigation();
  setupRotatingWords();
  setupRevealAnimations();
  setupCopyEmail();
  setupProjectFilters();
  setupDocsSearch();
  setupTimeline();
  setCurrentYear();
});