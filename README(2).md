# Lineboard

A client-side call tracking dashboard for reviewing and filtering call records at a glance.

## Description

Lineboard is a static, browser-based dashboard that displays a list of call records — caller name, phone number, date and time, duration, direction, and outcome — alongside summary statistics. It's built as three plain files (HTML, CSS, and a JavaScript module) with no backend, no database, and no build step.

## Purpose

Small teams and independent operators who track calls (support lines, sales outreach, tutoring bookings, etc.) often just need a quick way to see call volume and outcomes without standing up a full CRM. Lineboard demonstrates that dashboard — searchable, filterable, and readable at a glance — as a lightweight, dependency-free reference implementation.

## Features

- Dashboard summary cards: total calls, incoming calls, outgoing calls, answered calls, missed calls, and total call duration
- Call records table with caller name, phone number, date & time, duration, direction, and outcome
- Free-text search across caller name and phone number
- Filter by call direction (incoming / outgoing)
- Filter by call outcome (answered / missed / voicemail / declined)
- "Clear filters" control that resets search and both filters at once
- Summary statistics recalculate automatically whenever the search term or filters change
- Empty-state message when no records match the current filters
- Sample call data (12 valid records) loaded on page load, with built-in validation that discards malformed records instead of failing
- Responsive, mobile-first layout
- Semantic, accessible markup (labeled form controls, table headings, skip link, live region for result counts)

Lineboard currently ships with a fixed set of sample data defined in `script.js`. There is no way to add, edit, or delete call records through the UI, and no data is persisted between page loads.

## Technologies used

- HTML5 (semantic markup)
- CSS3 (custom properties, Flexbox, Grid, mobile-first media queries)
- Modern vanilla JavaScript (ES modules, no frameworks or libraries)
- [Node.js built-in test runner](https://nodejs.org/api/test.html) (`node:test`, `node:assert`) for automated tests — no test framework dependency required
- Google Fonts (Space Grotesk, IBM Plex Sans, IBM Plex Mono), loaded via CDN `<link>` tags

No frameworks (React, Vue, etc.), CSS libraries (Bootstrap, Tailwind, etc.), bundlers, or paid APIs are used anywhere in the project.

## Project structure

```
lineboard/
├── index.html                  # Page markup and structure
├── style.css                    # All styling (mobile-first, responsive)
├── script.js                    # App logic: data loading, filtering, calculations, rendering
├── data/
│   └── sample-data.json         # Standalone sample call records (id, callerName, phoneNumber, date, time, duration, direction, outcome)
├── test/
│   └── test-calculation.js      # Automated tests focused on the calculation functions in script.js
├── tests/
│   └── script.test.js           # Automated tests for the broader set of pure functions in script.js (validation, search, filters, formatting)
├── package.json                  # Defines the `npm test` script (no runtime dependencies)
├── .gitignore
├── LICENSE
└── README.md
```

## How to run locally

Lineboard has no server-side component, but `script.js` is loaded as an ES module (`<script type="module">`), and browsers block ES module imports on the `file://` protocol. Open the project through a local static server rather than double-clicking `index.html`.

**Option 1 — Node.js (`npx serve`)**
```bash
npx serve .
```
Then open the URL it prints (typically `http://localhost:3000`).

**Option 2 — Python**
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

**Option 3 — VS Code**
Install the "Live Server" extension, right-click `index.html`, and choose **Open with Live Server**.

## How to use the application

1. Open the dashboard in a browser (see above). The six summary cards and the full sample call list appear immediately.
2. Type in the **Search calls** field to filter by caller name or phone number as you type.
3. Use the **Direction** dropdown to show only incoming or only outgoing calls.
4. Use the **Outcome** dropdown to show only answered, missed, voicemail, or declined calls.
5. Combine search and both filters — they apply together.
6. The summary cards and the "Showing X of Y calls" message update automatically after every change.
7. Click **Clear filters** to reset the search field and both dropdowns and see the full list again.
8. If no records match your filters, the table is replaced with an empty-state message explaining that nothing matched.

## How to run automated tests

Automated tests live in two files, both using Node's built-in test runner (`node:test`), so no test framework needs to be installed:

- `test/test-calculation.js` — focused tests for the dashboard calculation functions (total, incoming, outgoing, answered, missed, and total duration calls), covering normal datasets, empty datasets, and datasets with invalid/missing values.
- `tests/script.test.js` — broader tests covering validation, search, filtering, and formatting functions.

Requires Node.js 18 or later (developed and verified on Node 22).

Run every test file:
```bash
npm test
```
or directly:
```bash
node --test
```

Run just the calculation tests:
```bash
node --test test/test-calculation.js
```

## Testing information

- **What's tested:** `test/test-calculation.js` covers `calculateTotalCalls`, `calculateIncomingCalls`, `calculateOutgoingCalls`, `calculateAnsweredCalls`, `calculateMissedCalls`, `calculateTotalDuration`, and the combined `calculateDashboardStats` — each against a shared mixed dataset, an empty dataset, and (where relevant) a dataset with invalid or missing fields, to confirm bad data is skipped rather than corrupting the totals. `tests/script.test.js` additionally covers `validateCall`, `loadCallData`, `searchCalls`, `filterByDirection`, `filterByOutcome`, `applyFilters`, `getDefaultFilters`, and every `format*` formatting helper. 61 test cases in total across both files.
- **Real logic, not reimplemented logic:** both files `import` the functions directly from `script.js` rather than duplicating the calculation logic, so the tests exercise the same code the dashboard runs in the browser.
- **What's not tested:** DOM rendering and event-handling code in `script.js` (`initDashboard` and its private helpers) is not covered by automated tests. These functions are guarded to only run in a browser and were manually verified by exercising the UI directly.
- **Why this split works:** the calculation, filtering, and formatting functions are written as pure functions with no DOM dependency and are individually `export`ed from `script.js`, so `tests/script.test.js` can `import` them directly without a browser or a DOM library.

## GitHub repository setup

1. Create a new, empty repository on GitHub (do not initialize it with a README, since you already have one).
2. From the project folder, initialize and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Lineboard dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. Confirm `index.html`, `style.css`, `script.js`, `tests/`, `package.json`, `LICENSE`, and `README.md` all appear in the repository.

## GitHub Pages deployment instructions

1. In your GitHub repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Set **Branch** to `main` and the folder to `/ (root)`, then click **Save**.
4. GitHub will publish the site at `https://<your-username>.github.io/<your-repo>/` within a few minutes.
5. Because the app is fully static (no server, no build step) and GitHub Pages serves files over HTTP rather than `file://`, the ES module script will load correctly with no additional configuration.

## Browser compatibility

Lineboard relies on ES modules, CSS custom properties, CSS Grid, and optional chaining (`?.`) in JavaScript — all standard in modern evergreen browsers. It has been built and manually checked against current versions of:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

Internet Explorer is not supported (it does not support ES modules or CSS custom properties). Very old versions of mobile browsers may not support all CSS features used (e.g. `:focus-visible`).

## Accessibility considerations

- Semantic HTML throughout: `<nav>`, `<main>`, `<table>` with `<caption>` and `<th scope="col">`, `<time datetime="...">` for timestamps
- All form controls (search field, direction filter, outcome filter) have associated `<label>` elements
- A "Skip to main content" link is provided for keyboard users
- The result-count text is an `aria-live="polite"` region, so screen reader users are notified when filtered results change
- Visible focus outlines (`:focus-visible`) on all interactive elements
- Call direction and outcome are distinguished by both color and a text label (and a shape marker in the CSS), not by color alone
- Form inputs and the reset button use a minimum 44px touch target height for mobile use
- Color choices in `style.css` were chosen for readable contrast against their backgrounds

These are the accessibility measures actually implemented; the project has not been audited against a formal standard such as WCAG 2.1 AA, and no automated accessibility testing (e.g. axe, Lighthouse CI) is currently part of the test suite.

## Known limitations

- Call data is a fixed, hardcoded sample set inside `script.js` — there is no way to add, edit, or delete records through the UI, and there is no backend or database to persist changes
- `data/sample-data.json` is provided as a standalone, valid sample dataset but is not currently loaded by `script.js` at runtime; the app still reads its sample data from the array defined in `script.js` itself
- No pagination or virtual scrolling — all records render at once, which is fine for the sample data set but would need addressing for a large real-world call log
- No sorting of table columns (e.g. by date or duration)
- No CSV/PDF export of call records
- No authentication or multi-user support, by design (see project constraints)
- Automated tests cover the pure logic only, not DOM rendering or user interaction flows
- Font loading depends on a Google Fonts CDN connection; the layout still works without it but falls back to system fonts

## Future improvements

- Add sorting by column (date, duration, caller name)
- Add pagination or infinite scroll for larger data sets
- Persist data locally (e.g. `localStorage`) so filters or added records survive a page reload
- Add the ability to add, edit, and delete call records from the UI
- Add CSV export of the currently filtered records
- Add browser-based UI tests (e.g. Playwright) to complement the existing unit tests
- Add an automated accessibility check (e.g. axe-core or Lighthouse CI) to the test suite

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
