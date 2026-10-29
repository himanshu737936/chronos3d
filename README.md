# Chronos3D — a 3D study OS for Android

Chronos3D is a single-file, installable web app (PWA) built for studying on an Android phone.
It bundles a focus timer, a pomodoro engine, task management, a syllabus tracker, spaced-repetition
flashcards, a day planner and deep session analytics into one dark, animated interface — with a
rendered 3D "focus city" as the centrepiece.

No account, no server, no build step. Everything you enter stays in your browser's local storage.

**Version 3.2.0** · build 2026-10-29

## Features

- **Focus timer & pomodoro engine** — configurable session and break lengths, presets, custom time,
  and a dial you can start, pause and reset.
- **Focus city (3D)** — a live isometric/3D visualisation rendered on canvas that grows with the work
  you put in.
- **Tasks** — subjects, priorities, estimated durations, repeat rules and due dates, with quick add.
- **Syllabus tracker** — subjects and their completion split, so you can see what is left before an exam.
- **Flashcards** — decks, cards with due dates, and a cram mode for last-minute revision.
- **Planner** — time blocks for the day, so sessions map to a real schedule.
- **Analytics** — sessions, focus time, streak, consistency, average session length, subject split,
  hour-of-day heat, plus deltas against your previous period.
- **Exam countdown, next-up and today's rhythm** on the home screen.
- **Coach** — short, rule-based nudges based on your recent consistency.
- **Offline & installable** — ships a web app manifest and a service worker, so it installs to the
  home screen and works without a connection.

## Nothing you focus is lost

Time is banked automatically, not only when a block runs to the end:

- Reset or skip a running block — the minutes you actually focused are saved
  as a session (marked `partial`). Anything under 10 seconds is treated as
  noise and dropped.
- Pause and close the app — the block comes back on the dial with its time
  still on it; the banked part is logged when it ends or resets.
- Countdown: setting a new time or resetting banks what was already counted
  down.
- Stopwatch: the elapsed time is persisted; if it is left behind, it is saved
  on the next launch.
- A block that finishes while the app is closed is logged on reopen, once —
  never twice.

## Updating

The app ships a service worker that fetches the shell from the network first and
falls back to the cached copy only when offline, so a new deploy reaches an
installed app on the next launch. If an installed copy ever looks stale, open
the menu (⋮) and tap **Force refresh** — it clears the cache, re-checks the
worker and reloads.

The version is visible in that same menu, and in the page as
`<meta name="app-version">`. The menu also has **Diagnostics**, which shows the
build, the device and browser string, viewport, which CSS features the browser
supports, storage size and the last few runtime errors — the quickest way to
report a problem on a phone we cannot see.

## Run it

Open `index.html` in a browser. That is the whole app.

To run it as a proper PWA (service worker and install prompt need a secure origin), serve the folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy on GitHub Pages

1. Push this repo to GitHub (see below).
2. Repository **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save. The app goes live at `https://<your-username>.github.io/<repo-name>/`.

The `.nojekyll` file is already included, so GitHub Pages serves the files as-is.

## Project layout

```
index.html          the entire app — markup, styles and logic in one file
manifest.json       web app manifest (name, icons, standalone display)
sw.js               service worker — offline shell cache
icons/              app icons (192, 512, apple-touch)
.nojekyll           tells GitHub Pages to skip Jekyll processing
LICENSE             MIT
```

## Notes

- Data lives in `localStorage` under the app's origin. Clearing site data clears your progress.
  Moving from `file://` to a hosted URL means a fresh start, because the origin changes.
- Fonts (Space Grotesk, JetBrains Mono) load from Google Fonts; the app still runs without them.
- The icons in `icons/` are simple generated placeholders — swap in your own art at the same
  filenames and sizes.

## License

MIT — see [LICENSE](LICENSE).
