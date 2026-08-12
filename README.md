# Trivia Quiz

A trivia quiz game powered by the [Open Trivia Database](https://opentdb.com/). Pick a category and difficulty, answer timed questions, and track your cumulative score.

Originally by [Shoeb Raza](mailto:contact@shoebraza.com) — now a modern React + TypeScript SPA.

## Requirements

- Node.js 20+ (recommended)
- npm

## Setup & run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default [http://localhost:5173](http://localhost:5173)).

## Other scripts

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## How it works

1. **Home** — choose a category, difficulty, and enter your name/email
2. **Quiz** — answer up to 20 questions (60 seconds each) from Open Trivia DB
3. **Score** — see your result; cumulative totals are stored in `localStorage`

Questions and answers from the API may include HTML entities; the app decodes them before display.

## License

MIT — see [LICENSE](./LICENSE). Copyright (c) 2017 Shoeb Raza.
