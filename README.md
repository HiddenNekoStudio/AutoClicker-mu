# 🤖 IdleRPGMU Auto Clicker

> Userscript for **MU Idle RPG** — automation of Reset, Map switching, Event registration & rewards, Modal closing, and Mining cycles.

[🇷🇺 Русский](#-русский) · [🇬🇧 English](#-english)

---

## 🇷🇺 Русский

### 📖 Что это

Юзерскрипт для Tampermonkey, который автоматизирует рутинные действия в браузерной idle-RPG **MU Idle RPG** (`idlerpgmu.com/game`).

### ✨ Возможности

| Функция | Описание |
|---|---|
| 🔄 **Авто-Reset** | Сбрасывает персонажа при достижении нужного уровня |
| 🗺️ **Выбор карты** | Автоматически переходит на выбранную вами карту |
| 🎫 **Авто-ивенты** | Регистрация на Blood Castle / Devil Square / Chaos Castle, сбор награды (Claim EXP → Continue → Return to Hunting) |
| 🚪 **Закрытие окон** | Автоматически закрывает всплывающие модальные окна |
| ⛏️ **Mining (6ч)** | Циклично запускает Chaos → BC → DS, синхронизируется с игровым таймером |
| 🌐 **RU / EN** | Переключение языка прямо в панели |

### 📦 Установка

1. Установите расширение **[Tampermonkey](https://www.tampermonkey.net/)** для вашего браузера.
2. Откройте [ссылку на raw-файл скрипта](https://github.com/HiddenNekoStudio/AutoClicker-mu/blob/main/IdleRPGMU%20Auto%20Clicker%20(v7.0%20RU-EU)-7.0.user.js).
3. Tampermonkey предложит установку — подтвердите.
4. Откройте `https://idlerpgmu.com/game` — скрипт запустится автоматически.

### 🎛️ Панель управления

```
┌───────────────────────────────────────┐
│ 🤖 Автокликер             RU | ON     │
│ Уровень: 137                          │
│ Этап: MAP: Icarus ✓                   │
│ ───────────────────────────────────── │
│ 🗺️ Карта [Icarus ▼]                   │
│ ───────────────────────────────────── │
│ 🎫 Авто-ивенты                 ON     │
│ 🚪 Закрытие окон               ON     │
│ ───────────────────────────────────── │
│ ⛏️ Mining (6ч)                 ON     │
│ Ресурс: Chaos                         │
│ Осталось: 5ч 42м                      │
│ Статус: ⏳ (синк 3м назад)             │
└───────────────────────────────────────┘
```

### ⚙️ Настройки

Все параметры находятся в начале скрипта в блоке **«2. НАСТРОЙКИ»**:

| Параметр | По умолчанию | Описание |
|---|---|---|
| `CLICK_INTERVAL` | `1000` мс | Частота главного цикла |
| `RESET_COOLDOWN` | `5000` мс | Защита от двойного Reset |
| `MINING_CYCLE_MS` | `6ч` | Длительность сессии Mining |
| `MINING_SYNC_INTERVAL_MS` | `30 мин` | Период синка с игровым таймером |

### 🧹 Полный сброс

Откройте консоль (`F12`) и выполните:

```javascript
['idleRPGMU_auto_enabled','idleRPGMU_mining_enabled','idleRPGMU_modal_enabled',
 'idleRPGMU_event_enabled','idleRPGMU_mining_index','idleRPGMU_mining_started',
 'idleRPGMU_mining_sync','idleRPGMU_map','idleRPGMU_lang'].forEach(k => localStorage.removeItem(k));
location.reload();
```

### ⚠️ Дисклеймер

Автоматизация в онлайн-играх может нарушать пользовательское соглашение. Используйте на свой страх и риск.

---

## 🇬🇧 English

### 📖 What is this

A Tampermonkey userscript that automates routine actions in the browser-based idle-RPG **MU Idle RPG** (`idlerpgmu.com/game`).

### ✨ Features

| Feature | Description |
|---|---|
| 🔄 **Auto-Reset** | Resets character when reaching the required level |
| 🗺️ **Map selector** | Automatically travels to the chosen map |
| 🎫 **Auto Events** | Registers for Blood Castle / Devil Square / Chaos Castle, claims rewards (Claim EXP → Continue → Return to Hunting) |
| 🚪 **Close Modals** | Automatically closes popup modals |
| ⛏️ **Mining (6h)** | Cycles through Chaos → BC → DS, syncs with in-game timer |
| 🌐 **RU / EN** | Language toggle right in the panel |

### 📦 Installation

1. Install the **[Tampermonkey](https://www.tampermonkey.net/)** extension for your browser.
2. Open the [raw script link](https://github.com/HiddenNekoStudio/AutoClicker-mu/blob/main/IdleRPGMU%20Auto%20Clicker%20(v7.0%20RU-EU)-7.0.user.js).
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

### 🧹 Full Reset

Open console (`F12`) and run:

```javascript
['idleRPGMU_auto_enabled','idleRPGMU_mining_enabled','idleRPGMU_modal_enabled',
 'idleRPGMU_event_enabled','idleRPGMU_mining_index','idleRPGMU_mining_started',
 'idleRPGMU_mining_sync','idleRPGMU_map','idleRPGMU_lang'].forEach(k => localStorage.removeItem(k));
location.reload();
```

### ⚠️ Disclaimer

Automation in online games may violate the Terms of Service. Use at your own risk.

---

## 📜 Changelog / История

### v7.0
- 🌐 RU/EU localization + language selector in panel

### v6.2
- 🎫 Auto event reward claim (Claim EXP → Continue → Return to Hunting)

### v6.1
- 🎫 Auto event registration with ticket check

### v6.0
- 🎫 Initial auto events support

### v5.1
- 🚪 Modal close toggle

### v5.0
- ⛏️ Mining sync with in-game timer

### v4.0
- ⛏️ Auto Mining cycle (6h)

### v3.0
- ⛏️ Initial Mining support

### v2.0
- 🎛️ On/Off panel with state persistence

### v1.0
- 🔄 Auto Reset + Map switch

---

## 📄 License / Лицензия

MIT — use freely, contribute back if you improve it.
