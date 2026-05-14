(() => {
  const header = document.querySelector(".site-header");
  const navLinks = Array.from(document.querySelectorAll(".nav-links a[href]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  let ticking = false;
  const requestHeaderUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateHeader();
      ticking = false;
    });
  };

  updateHeader();
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });

  const samePageLinks = navLinks.filter((link) => {
    const url = new URL(link.href, window.location.href);
    return url.pathname === window.location.pathname && Boolean(url.hash);
  });

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const url = new URL(link.href, window.location.href);
      link.classList.toggle("is-active", url.hash === `#${id}`);
    });
  };

  samePageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.hash);
      if (!target) return;

      event.preventDefault();
      link.classList.add("is-clicked");
      window.setTimeout(() => link.classList.remove("is-clicked"), 260);

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });

      window.history.pushState(null, "", link.hash);
      setActiveLink(target.id);
    });
  });

  const sectionTargets = samePageLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sectionTargets.length > 0) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-42% 0px -48% 0px",
        threshold: 0,
      }
    );

    sectionTargets.forEach((section) => activeObserver.observe(section));
  }

  const revealTargets = Array.from(
    document.querySelectorAll(
      [
        "main > section:not(.hero):not(.contact-hero):not(.gallery-hero)",
        ".service-card",
        ".project-card",
        ".team-card",
        ".process-grid article",
        ".value-grid article",
        ".gallery-card",
        ".contact-info",
        ".contact-form",
      ].join(", ")
    )
  );

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    revealObserver.observe(target);
  });
})();
