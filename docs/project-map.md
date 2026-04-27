# MotoApp Ride Gauge: Project Map

This document is a compact context map for feature work. Keep it short and update it when architecture changes.

## Purpose

- Track remaining fuel after trips and refuels.
- Keep all user data locally on device/browser.
- Support web and iOS flow via Capacitor.

## Structure

```text
src/
  main.tsx                 # app bootstrap
  App.tsx                  # providers + routes
  pages/                   # route-level screens
  components/              # shared UI and feature components
  state/fuel.tsx           # core domain state and actions
  lib/storage.ts           # local persistence and math helpers
  test/                    # vitest setup and tests
```

## Runtime Flow

1. `src/main.tsx` mounts the app and unregisters service workers in preview/iframe environments.
2. `src/App.tsx` wires providers (`QueryClientProvider`, `FuelProvider`, router, toasts).
3. Route pages call `useFuel()` from `src/state/fuel.tsx`.
4. `FuelProvider` persists settings/fuel/history through `src/lib/storage.ts`.
5. Settings page handles import/export, including Capacitor filesystem/share logic on native.

## Main Modules

- `src/state/fuel.tsx`
  - Domain API: `addTrip`, `addLiters`, `setExact`, `fillToFull`.
  - Settings and history operations: `updateSettings`, `resetSettings`, `deleteEntry`, `clearHistory`, `importHistory`.
- `src/lib/storage.ts`
  - Storage keys and serialization for settings/current fuel/history.
  - Common calculations: `clamp`, `fuelUsedFor`, `rangeFor`.
- `src/pages/`
  - `Home.tsx`: fuel gauge and quick actions.
  - `HistoryPage.tsx`: history list and deletion.
  - `SettingsPage.tsx`: settings and JSON import/export.

## Feature Brief Template (for new tasks)

Use this format in chat before implementation:

```md
Feature: <short name>
Goal: <what user should be able to do>
Constraints: <technical or UX limits>
UX flow: <main happy path in 2-4 steps>
Touched files: <expected files or folders>
Acceptance criteria:
- <observable outcome 1>
- <observable outcome 2>
Out of scope: <what we do not change now>
```

## Working Agreement

- Keep domain logic in `src/state/fuel.tsx` or extracted domain helpers, not inside page components.
- Keep persistence concerns in `src/lib/storage.ts` (or dedicated storage service files).
- Prefer small, focused PRs and run `npm run lint` and `npm run test` after substantial changes.
- When changing data shapes in storage/history, include a migration/fallback strategy.

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test`

