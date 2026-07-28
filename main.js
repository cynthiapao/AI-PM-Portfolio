(function () {
  const iconSets = [
    { selector: ".hero .pill-row span", icons: ["layers-3", "graduation-cap", "briefcase-business"] },
    { selector: ".detail-pills span", icons: ["badge-check", "target", "chart-no-axes-combined", "sparkles"] },
    { selector: ".tag-line", icons: ["book-open"] },
    { selector: ".read-time", icons: ["clock"] }
  ];

  const addIcon = (element, iconName) => {
    if (element.querySelector("[data-lucide]")) {
      return;
    }

    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", iconName);
    icon.setAttribute("aria-hidden", "true");
    element.prepend(icon);
  };

  const enhanceInlineIcons = () => {
    iconSets.forEach(({ selector, icons }) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        addIcon(element, icons[index % icons.length]);
      });
    });
  };

  const buildDetailToc = () => {
    if (!document.body.classList.contains("detail-page")) {
      return;
    }

    const headings = Array.from(document.querySelectorAll(".detail-section .section-heading h2"));
    if (headings.length < 3) {
      return;
    }

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `section-${index + 1}`;
      }
    });

    const toc = document.createElement("aside");
    toc.className = "detail-toc";
    toc.setAttribute("aria-label", "页面目录");

    const title = document.createElement("p");
    title.textContent = "On this page";
    toc.appendChild(title);

    const nav = document.createElement("nav");
    headings.forEach((heading, index) => {
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent.trim();
      if (index === 0) {
        link.classList.add("active");
      }
      nav.appendChild(link);
    });

    toc.appendChild(nav);
    document.body.appendChild(toc);

    const links = new Map(
      Array.from(toc.querySelectorAll("a")).map((link) => [link.getAttribute("href").slice(1), link])
    );

    const setActive = (id) => {
      links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-24% 0px -62% 0px",
        threshold: 0.01
      }
    );

    headings.forEach((heading) => observer.observe(heading));
  };

  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  enhanceInlineIcons();
  buildDetailToc();
  refreshIcons();
})();
