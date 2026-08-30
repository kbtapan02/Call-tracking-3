# Lineboard — Call Tracking Dashboard

A lightweight, single-page dashboard for logging and tracking calls — connected, missed, and voicemail — with live stats and a filterable call log. No backend, no build step: open `index.html` and go.

![Lineboard screenshot](assets/screenshot.png)

## Features

- **Log calls** with contact name, outcome, duration, and a note
- **Live stats** for connected calls, missed calls, voicemails, and total talk time
- **Filterable call log** by outcome
- **Zero dependencies** — plain HTML, CSS, and JavaScript
- All data lives in the browser tab; nothing is sent to a server

## Getting started

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/call-tracking-dashboard.git
   cd call-tracking-dashboard
   ```
2. Open `index.html` in your browser — that's it.

No install, no server, no dependencies to fetch.

## Project structure

```
├── index.html              # Dashboard markup
├── style.css                # Styling
├── script.js                 # App logic (state, rendering, filters, form handling)
├── data/
│   └── sample-data.json      # Sample call records for testing/demo
├── tests/
│   └── test-calculations.js  # Tests for stat calculations
├── assets/
│   └── screenshot.png        # Dashboard preview
├── LICENSE
└── README.md
```

## Usage

- Fill in the **Log a call** form with a contact name, outcome, duration, and optional note, then submit to add it to the log.
- Use the filter buttons above the call log to view all calls or just one outcome type.
- Stats at the top update automatically as calls are logged.

## Sample data

`data/sample-data.json` contains example call records in the same shape used by the app, useful for testing or seeding a future backend integration.

## Running tests

```bash
node tests/test-calculations.js
```

## Roadmap ideas

- Persist calls with `localStorage` or a backend API
- Export call log to CSV
- Per-contact call history view
- Date range filtering

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you'd like to change.

## License

Released under the [MIT License](LICENSE).
