<!-- .github/copilot-instructions.md -->

# Copilot / AI agent instructions — Platter (static site)

Purpose: help AI coding agents be immediately productive on this repository (static HTML/CSS/JS). Keep changes minimal, respect existing structure, and prefer edits that are safe to preview in-browser.

- **Big picture:** This is a single-page static site. Major folders:
  - `index.html` — single entry HTML (DOM structure, IDs, class patterns).
  - `css/style.css` — one stylesheet controlling layout and visual tokens.
  - `js/script.js` — single global script file; code should avoid module/bundler assumptions.
  - `images/` — image assets organized by subfolders: `hero`, `categories`, `Restaurant`, `dishes`.

- **Why this structure:** Simple, unbundled static site meant for direct editing and browser preview. There is no `package.json` or build step in the repo — prefer minimal, non-tooling changes unless the PR adds a clear benefit and includes updated docs.

- **Key files / examples to reference when making edits:**
  - `index.html`: hero IDs `hero-title`, `hero-description`; main hero image `#food-slider`; category slider items live under `.category-slider`.
  - `js/script.js`: single global script loaded at the bottom of `index.html` (`<script src="js/script.js"></script>`). Attach event listeners on `DOMContentLoaded` and use existing IDs/classes (e.g., `.dot`, `.find-btn`) to avoid breaking selectors.
  - `css/style.css`: patterns use plain class names (e.g., `.restaurant-card`, `.category-item`) rather than a strict BEM scheme.

- **Project-specific conventions & patterns** (follow these exactly):
  - Add images to the matching subfolder under `images/` and reference them with a relative path (e.g., `images/categories/pizza.png`).
  - Duplicate HTML UI blocks by copying the existing structure (e.g., a `div.restaurant-card` block) and change only text, src, and aria labels.
  - Keep JS DOM queries scoped (start from a section root when possible) to avoid global collisions — the site uses many generic class names.
  - Keep CSS changes confined to `css/style.css` unless adding a new stylesheet is necessary.

- **Debug / preview workflow (no build tools):**
  - Quick preview: open `index.html` in the browser directly or run a local static server:

    - Python: `python3 -m http.server 8000` then visit `http://localhost:8000`
    - Node: `npx http-server . -p 8000` (only if `npx` available)

  - Recommended editor: use Live Server (VS Code) or preview in Chrome/Firefox. JS errors will appear in the browser console — inspect selectors and IDs first.

- **What to change in `js/script.js` vs `index.html`:**
  - Content and static text (titles, descriptions, labels) — edit `index.html` directly for the simplest change.
  - Dynamic behavior (sliders, click handlers, DOM updates) — implement in `js/script.js` and target the same IDs/classes present in `index.html`.
  - Example: to change hero text programmatically: `document.getElementById('hero-title').textContent = 'New Title'` (use `DOMContentLoaded`).

- **Integration points / external deps:**
  - Fonts via Google Fonts and icons via Font Awesome CDN are referenced in `index.html` (no local packages).
  - There are no backend APIs or server code in the repo — any mention of network calls should be explicit in code and stubbed for local preview.

- **When creating PRs:**
  - Keep diffs small and focused (one UI/behavior change per PR).
  - Include screenshots or link to a local preview steps in the PR description.
  - If adding new images, include optimized files (reasonable dimensions and compressed PNG/JPEG) and update any HTML that references them.

- **Files to inspect for context before editing:**
  - `index.html` — structure and anchor examples
  - `js/script.js` — current event handlers and DOM assumptions
  - `css/style.css` — layout and token patterns

If anything here is unclear or you want more detailed examples (e.g., a sample DOM-to-JS change or a suggested refactor to modularize scripts), tell me which area to expand and I will iterate.
