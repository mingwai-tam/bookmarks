(function () {
  const THEME_STORAGE_KEY = "bookmark-theme";
  const themeEl = document.getElementById("theme-select");
  const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredTheme() {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" || value === "auto" ? value : "auto";
  }

  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    if (mode === "auto") {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function initializeTheme() {
    if (!themeEl) {
      return;
    }

    const initialMode = getStoredTheme();
    themeEl.value = initialMode;
    applyTheme(initialMode);

    themeEl.addEventListener("change", () => {
      const nextMode = themeEl.value;
      localStorage.setItem(THEME_STORAGE_KEY, nextMode);
      applyTheme(nextMode);
    });

    // Keep Auto mode synced with OS theme changes.
    systemThemeQuery.addEventListener("change", () => {
      if (themeEl.value === "auto") {
        applyTheme("auto");
      }
    });
  }

  const allBookmarks = Array.isArray(window.BOOKMARKS) ? window.BOOKMARKS : [];
  const categories = ["All", ...new Set(allBookmarks.map((bookmark) => bookmark.category).filter(Boolean))];

  const tabsEl = document.getElementById("tabs");
  const searchEl = document.getElementById("bookmark-search");
  const listEl = document.getElementById("bookmark-list");
  const emptyEl = document.getElementById("empty-state");
  const countEl = document.getElementById("result-count");

  let activeCategory = "All";

  function includesQuery(bookmark, query) {
    if (!query) {
      return true;
    }

    const haystack = [
      bookmark.title || "",
      bookmark.url || "",
      bookmark.category || "",
      ...(Array.isArray(bookmark.tags) ? bookmark.tags : [])
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query.toLowerCase());
  }

  function getVisibleBookmarks() {
    const query = searchEl.value.trim();
    const hasQuery = query.length > 0;

    return allBookmarks.filter((bookmark) => {
      const categoryMatch = hasQuery || activeCategory === "All" || bookmark.category === activeCategory;
      const queryMatch = includesQuery(bookmark, query);
      return categoryMatch && queryMatch;
    });
  }

  function renderTabs() {
    tabsEl.innerHTML = "";

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = category === activeCategory ? "tab active" : "tab";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(category === activeCategory));
      button.textContent = category;
      button.addEventListener("click", () => {
        activeCategory = category;
        renderTabs();
        renderList();
      });
      tabsEl.appendChild(button);
    });
  }

  function renderList() {
    const visible = getVisibleBookmarks();
    listEl.innerHTML = "";

    visible.forEach((bookmark, index) => {
      const safeTitle = bookmark.title || "Untitled Bookmark";
      const safeUrl = bookmark.url || "#";
      const safeCategory = bookmark.category || "Uncategorized";

      const li = document.createElement("li");
      li.className = "item";
      li.style.animationDelay = `${80 + index * 50}ms`;

      const tagsText = Array.isArray(bookmark.tags) && bookmark.tags.length > 0
        ? `Tags: ${bookmark.tags.join(", ")}`
        : "";

      const link = document.createElement("a");
      link.href = safeUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const title = document.createElement("span");
      title.className = "item-title";
      title.textContent = safeTitle;

      const meta = document.createElement("span");
      meta.className = "item-meta";
      meta.textContent = `${safeCategory}${tagsText ? ` • ${tagsText}` : ""}`;

      const url = document.createElement("span");
      url.className = "item-url";
      url.textContent = safeUrl;

      link.appendChild(title);
      link.appendChild(meta);
      link.appendChild(url);
      li.appendChild(link);

      listEl.appendChild(li);
    });

    emptyEl.hidden = visible.length !== 0;
    countEl.textContent = `${visible.length} bookmark${visible.length === 1 ? "" : "s"} shown`;
  }

  searchEl.addEventListener("input", renderList);

  initializeTheme();
  renderTabs();
  renderList();
})();
