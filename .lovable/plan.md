
## MotoFuel — Offline Fuel Estimator

A minimal, offline-first iPhone app to track estimated fuel left in your motorcycle's 23 L tank based on manually entered distances.

### Mobile approach
Build as a **PWA (installable web app)** first — works fully offline, installs to the iPhone home screen via Safari "Add to Home Screen", no App Store needed. All data stays on-device in `localStorage`. If you later want a true native app, we can wrap it with Capacitor.

### Data model (localStorage)
- `settings`: `{ tankCapacity: 23, consumption: 7 }` (liters, L/100km)
- `currentFuel`: number (liters, 0–tankCapacity)
- `history`: array of `{ id, type: 'trip' | 'refuel' | 'set', value, fuelAfter, timestamp }`

### Core formulas
- `fuelUsed = distanceKm * consumption / 100`
- `fuelLeft = clamp(currentFuel - fuelUsed, 0, tankCapacity)`
- `range = fuelLeft / consumption * 100`
- `percent = fuelLeft / tankCapacity * 100`

### Screens & flow

**1. Home (main)**
- Big circular gauge showing % fuel left
- Large number: `XX.X L` remaining
- Sub-line: `of 23 L · ~XXX km range`
- Low-fuel warning banner when <15%
- Two primary buttons: **Add Trip** · **Refuel**
- Bottom tab/icon row: Home · History · Settings

**2. Add Trip (sheet/modal)**
- Numeric input: distance in km
- Shows live preview: "Will use ~X.X L → Y.Y L left"
- Save button → updates fuel, logs entry, returns home

**3. Refuel / Adjust Fuel (sheet/modal)**
- Two modes (segmented control):
  - **Add liters**: input + quick buttons (+5, +10, Fill to full)
  - **Set exact amount**: input current liters
- Clamped to 0–tank capacity
- Save → updates fuel, logs entry

**4. History**
- Reverse-chronological list
- Each row: icon (trip/refuel/set), value, fuel after, date/time
- Swipe-to-delete (deleting recalculates? → keep simple: just remove the log entry, current fuel is the source of truth and not retroactively changed). Note: I'll add a small note in UI explaining this.
- Empty state when no entries

**5. Settings**
- Editable tank capacity (default 23 L)
- Editable consumption (default 7 L/100km)
- Reset to defaults button
- Clear history button (with confirm)

### UI / design
- Clean iOS-native feel: SF-style system fonts, generous spacing, rounded cards, subtle shadows
- Minimal palette: near-black background or off-white, single accent color (fuel-blue/green), red only for low-fuel warning
- Gauge: SVG circular progress, large readable typography
- Bottom navigation with 3 icons (Home, History, Settings)
- Mobile-first, safe-area aware, optimized for one-handed use

### PWA setup
- `vite-plugin-pwa` with offline service worker (cache-first for the shell)
- Manifest: standalone display, portrait, app name "MotoFuel", themed icons
- Apple-specific meta tags so it installs cleanly from Safari
- `/install` page with simple iOS install instructions (Share → Add to Home Screen)

### Out of scope (per your spec)
No login, no backend, no cloud, no GPS, no maps, no analytics, no push notifications (low-fuel shown as in-app banner only).
