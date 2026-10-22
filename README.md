# 🤖 IdleRPGMU Auto Clicker

<img width="249" height="485" alt="image" src="https://github.com/user-attachments/assets/355647dd-eb84-46cf-a886-630e3b9f7aa8" />


> Userscript for **MU Idle RPG** — automation of Reset, Map switching, Event registration & rewards, Modal closing, and Mining cycles.


## 🇬🇧 English

### 📖 What is this

A Tampermonkey userscript that automates routine actions in the browser-based idle-RPG **MU Idle RPG** (`idlerpgmu.com/game`).

### ✨ Features

| Feature | Description |
|---|---|
|🔄 Auto-Reset| Resets character when reaching the required level|
|🗺️ Map selector|Automatically travels to the chosen map|
|🎫 Auto Events|	Registers for events and claims rewards (Claim EXP → Continue → Return to Hunting)|
|🚪 Close Modals|	Automatically closes popup modals|
|⛏️ Mining (6h)|	Cycles through Chaos → BC → DS → Creation → Life → Boss, syncs with timer|
|🐾 Auto Feed Pet|	Automatically feeds your pet. Shows current apple balance (e.g., 12 / 17)|
|🧬 Pet Evolution|	Tracks pet level 100, starts evolution, and syncs the incubation timer|
|🎁 Daily Claim|	Syncs the daily reward timer and claims it exactly when available|
|👁️ Smart Cache|	Remembers pet level, apples, and timers, displaying them even when the panel is closed|
|🌐 RU / EN	Language| toggle right in the panel|

### 📦 Installation

1. Install the **[Tampermonkey](https://www.tampermonkey.net/)** extension for your browser.
2. Open the [raw script link](https://github.com/HiddenNekoStudio/AutoClicker-mu/raw/refs/heads/main/IdleRPGMU%20Auto%20Clicker%20(v7.0%20RU-EU)-7.0.user.js).
3. Tampermonkey will ask to install — confirm.
4. Open `https://idlerpgmu.com/game` — the script starts automatically.

### 🎛️ Control Panel

```
┌───────────────────────────────────────┐
│ 🤖 AutoClicker             EN | ON    │
│ Level: 137                            │
│ Stage: MAP: Icarus ✓                  │
│ ───────────────────────────────────── │
│ 🗺️ Map [Icarus ▼]                     │
│ ───────────────────────────────────── │
│ 🎫 Auto Events                 ON     │
│ 🚪 Close Modals                ON     │
│ 🐾 Feed Pet                    ON     │
│ 🍎 Apples: 12 / 17                    │
│ 🧬 Pet Evolution               ON     │
│ Level: 74 | Status: 23:39:43          │
│ 🎁 Daily Claim                 ON     │
│ Time left: 22:44:45                   │
│ ───────────────────────────────────── │
│ ⛏️ Mining (6h)                 ON     │
│ Resource: Chaos                       │
│ Left: 5h 42m                          │
│ Status: ⏳ (sync 3m ago)              │
└───────────────────────────────────────┘
```

### ⚙️ Configuration

All settings are in the **"2. НАСТРОЙКИ / SETTINGS"** block at the top:

| Parameter | Default | Description |
|---|---|---|
| `CLICK_INTERVAL` | `1000` ms | Main loop frequency |
| `RESET_COOLDOWN` | `5000` ms | Anti double-reset guard |
| `MINING_CYCLE_MS` | `6h` | Mining session duration |
| `MINING_SYNC_INTERVAL_MS` | `30 min` | Sync period with in-game timer |
| `PET_CHECK_INTERVAL`	|`30 min`|	How often the script opens the Pet panel |

### 🧹 Full Reset

Open console (`F12`) and run:

```javascript
['idleRPGMU_auto_enabled','idleRPGMU_mining_enabled','idleRPGMU_modal_enabled',
 'idleRPGMU_event_enabled','idleRPGMU_pet_feed_enabled','idleRPGMU_daily_enabled',
 'idleRPGMU_evolve_enabled','idleRPGMU_mining_index','idleRPGMU_mining_started',
 'idleRPGMU_mining_sync','idleRPGMU_map','idleRPGMU_lang','idleRPGMU_daily_finish',
 'idleRPGMU_evolve_finish','idleRPGMU_pet_lvl','idleRPGMU_pet_apples'].forEach(k => localStorage.removeItem(k));
location.reload();
```

## 📄 License / Лицензия

MIT — use freely, contribute back if you improve it.
