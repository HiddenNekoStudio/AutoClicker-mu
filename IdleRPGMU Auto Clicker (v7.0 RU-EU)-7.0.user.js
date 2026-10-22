// ==UserScript==
// @name         IdleRPGMU Auto Clicker (v8.0 RU/EU)
// @name:ru      IdleRPGMU Автокликер (v8.0 RU/EU)
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Reset + Map + Event + Modal + Mining + Pet (Auto-Open) + Daily + Evolve
// @description:ru  Сброс + Карта + Ивенты + Окна + Mining + Питомец (Авто-открытие) + Ежедневки + Эволюция
// @author       You
// @match        https://idlerpgmu.com/game*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 0. ЛОКАЛИЗАЦИЯ / LOCALIZATION
    // ==========================================
    const TRANSLATIONS = {
        ru: {
            title: '🤖 Автокликер',
            level: 'Уровень',
            stage: 'Этап',
            map: '🗺️ Карта',
            loading: 'загрузка...',
            autoEvents: '🎫 Авто-ивенты',
            modalClose: '🚪 Закрытие окон',
            petFeed: '🐾 Кормление',
            petEvolve: '🧬 Эволюция питомца',
            petLevel: 'Уровень питомца',
            apples: '🍎 Яблоки',
            dailyClaim: '🎁 Ежедневная награда',
            dailyLeft: 'До награды',
            dailyReady: 'ГОТОВО',
            mining: '⛏️ Mining (6ч)',
            resource: 'Ресурс',
            left: 'Осталось',
            status: 'Статус',
            on: 'ВКЛ',
            off: 'ВЫКЛ',
            waiting: 'ОЖИДАНИЕ',
            reset: 'СБРОС',
            resetCd: 'СБРОС (КД)',
            closeModal: 'ЗАКРЫТИЕ ОКНА',
            noTabs: 'нет вкладок',
            noButton: 'нет кнопки',
            miningOff: 'ВЫКЛ',
            reg: 'РЕГ',
            claim: 'ЗАБРАТЬ',
            continueEvt: 'ПРОДОЛЖИТЬ',
            hunt: 'ОХОТА',
            later: 'позже',
            waitBtn: 'ждём кнопку',
            expApplied: 'EXP начислен',
            feeding: 'КОРМЛЕНИЕ',
            dailyClaiming: 'НАГРАДА',
            evolving: 'ЭВОЛЮЦИЯ',
            maxLevel: 'МАКС. УРОВЕНЬ',
            toMining: '→ Mining',
            onMining: 'на Mining',
            collect: 'СБОР',
            choice: 'выбор',
            start: 'СТАРТ',
            toHunt: '→ Охота',
            ready: '✓ готово',
            unavailable: 'недоступен',
            alreadyMining: 'уже копает',
            syncAgo: 'синк {n}м назад',
            langSwitch: 'Переключить язык'
        },
        en: {
            title: '🤖 AutoClicker',
            level: 'Level',
            stage: 'Stage',
            map: '🗺️ Map',
            loading: 'loading...',
            autoEvents: '🎫 Auto Events',
            modalClose: '🚪 Close Modals',
            petFeed: '🐾 Feed Pet',
            petEvolve: '🧬 Pet Evolution',
            petLevel: 'Pet Level',
            apples: '🍎 Apples',
            dailyClaim: '🎁 Daily Claim',
            dailyLeft: 'Time left',
            dailyReady: 'READY',
            mining: '⛏️ Mining (6h)',
            resource: 'Resource',
            left: 'Left',
            status: 'Status',
            on: 'ON',
            off: 'OFF',
            waiting: 'WAITING',
            reset: 'RESET',
            resetCd: 'RESET (CD)',
            closeModal: 'CLOSE MODAL',
            noTabs: 'no tabs',
            noButton: 'no button',
            miningOff: 'OFF',
            reg: 'REG',
            claim: 'CLAIM',
            continueEvt: 'CONTINUE',
            hunt: 'HUNT',
            later: 'later',
            waitBtn: 'waiting button',
            expApplied: 'EXP applied',
            feeding: 'FEEDING',
            dailyClaiming: 'DAILY',
            evolving: 'EVOLVING',
            maxLevel: 'MAX LEVEL',
            toMining: '→ Mining',
            onMining: 'on Mining',
            collect: 'COLLECT',
            choice: 'select',
            start: 'START',
            toHunt: '→ Hunting',
            ready: '✓ done',
            unavailable: 'unavailable',
            alreadyMining: 'already mining',
            syncAgo: 'sync {n}m ago',
            langSwitch: 'Switch language'
        }
    };

    function detectDefaultLang() {
        const saved = localStorage.getItem('idleRPGMU_lang');
        if (saved && TRANSLATIONS[saved]) return saved;
        const nav = (navigator.language || 'en').toLowerCase();
        if (nav.startsWith('ru') || nav.startsWith('uk') || nav.startsWith('be') || nav.startsWith('kk')) return 'ru';
        return 'en';
    }

    let currentLang = detectDefaultLang();

    function t(key, params) {
        let str = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
               || TRANSLATIONS.en[key]
               || key;
        if (params) {
            Object.keys(params).forEach(k => {
                str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
            });
        }
        return str;
    }

    // ==========================================
    // 1. СЕЛЕКТОРЫ / SELECTORS
    // ==========================================
    const SELECTOR_RESET = '.reset.character-reset';
    const SELECTOR_LEVEL = '.level';
    const SELECTOR_MINING_PRIMARY = '.Mining-module__RSe5Oa__primaryAction';
    const SELECTOR_MINING_TIMER = '.Mining-module__RSe5Oa__timer';
    const SELECTOR_EVENT_MODAL = '.modal-backdrop section[role="dialog"]';
    const SELECTOR_TICKETS = '.MiningResourceSummary-module__W8RoJG__miningResource';
    
    const SELECTOR_PET_FEED = 'button.Pets-module__wel0pa__feed';
    const SELECTOR_PET_BALANCE = '.Pets-module__wel0pa__feedBalance';
    const SELECTOR_DAILY_SECTION = '.Pets-module__wel0pa__claimDaily';
    const SELECTOR_PET_IDENTITY = '.Pets-module__wel0pa__identity span';
    const SELECTOR_PET_INCUBATION = '.Pets-module__wel0pa__incubationClock';
    const SELECTOR_PET_EVOLUTION = '.Pets-module__wel0pa__evolution';
    
    // Селекторы для авто-открытия питомца
    const SELECTOR_PET_COMPANION = 'button.Pets-module__wel0pa__companion';
    const SELECTOR_PET_PANEL = '.Pets-module__wel0pa__identity, .Pets-module__wel0pa__feedBalance';

    const MINING_RESOURCES = [
        { tone: 'chaos', label: 'Chaos' },
        { tone: 'blood', label: 'BC' },
        { tone: 'devil', label: 'DS' },
        { tone: 'creation', label: 'Creation' },
        { tone: 'life', label: 'Life' },
        { tone: 'boss', label: 'Boss' }
    ];

    const MODAL_CONTAINERS = [
        '[role="dialog"]', '.modal', '.modal-content',
        '[class*="Modal-module"]', '[class*="module__"]'
    ];
    const CLOSE_BUTTON_SELECTORS = [
        'button[aria-label="Close"]', 'button[aria-label="close"]',
        'button[aria-label="Закрыть"]', 'button[aria-label="закрыть"]',
        '.modal-close', '.close-modal', '.close-button', 'button.close'
    ];

    // ==========================================
    // 2. НАСТРОЙКИ / SETTINGS
    // ==========================================
    const CLICK_INTERVAL = 1000;
    const RESET_COOLDOWN = 5000;
    const MINING_CYCLE_MS = 6 * 60 * 60 * 1000;
    const MINING_SYNC_INTERVAL_MS = 30 * 60 * 1000;
    const PET_CHECK_INTERVAL = 60000; // Проверка питомца раз в минуту

    // ==========================================
    // 3. СОСТОЯНИЕ / STATE
    // ==========================================
    let isEnabled           = localStorage.getItem('idleRPGMU_auto_enabled')   !== 'false';
    let isMiningEnabled     = localStorage.getItem('idleRPGMU_mining_enabled') !== 'false';
    let isModalCloseEnabled = localStorage.getItem('idleRPGMU_modal_enabled')  !== 'false';
    let isEventAutoEnabled  = localStorage.getItem('idleRPGMU_event_enabled')  !== 'false';
    let isPetFeedEnabled    = localStorage.getItem('idleRPGMU_pet_feed_enabled') !== 'false';
    let isDailyClaimEnabled = localStorage.getItem('idleRPGMU_daily_enabled')  !== 'false';
    let isEvolveEnabled     = localStorage.getItem('idleRPGMU_evolve_enabled') !== 'false';
    let lastResetTime = 0;

    let miningIndex = parseInt(localStorage.getItem('idleRPGMU_mining_index') || '0', 10);
    let miningStartedAt = parseInt(localStorage.getItem('idleRPGMU_mining_started') || '0', 10);
    let miningLastSyncAt = parseInt(localStorage.getItem('idleRPGMU_mining_sync') || '0', 10);
    let miningCycleStep = 0;
    let miningMode = null;

    let eventClaimStep = 0;
    
    // Синхронизация таймеров
    let dailyFinishTime = parseInt(localStorage.getItem('idleRPGMU_daily_finish') || '0', 10);
    let lastDailyParse = 0;
    
    let evolveFinishTime = parseInt(localStorage.getItem('idleRPGMU_evolve_finish') || '0', 10);
    let lastEvolveParse = 0;

    // Управление панелью питомца
    let petPanelAutoOpened = false;
    let petPanelCooldown = 0;

    // ==========================================
    // 4. ПАНЕЛЬ / PANEL
    // ==========================================
    function createUI() {
        const existing = document.getElementById('idle-auto-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'idle-auto-panel';
        panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:6px;">
                <strong style="font-size:14px;">${t('title')}</strong>
                <div style="display:flex;gap:4px;">
                    <button id="lang-toggle-btn" title="${t('langSwitch')}" style="padding:3px 8px;cursor:pointer;border:none;border-radius:4px;font-weight:bold;font-size:11px;background:#555;color:#fff;">${currentLang.toUpperCase()}</button>
                    <button id="auto-toggle-btn" style="padding:4px 10px;cursor:pointer;border:none;border-radius:4px;font-weight:bold;">ON</button>
                </div>
            </div>
            <div style="font-size:12px;margin-bottom:4px;">
                ${t('level')}: <span id="auto-level" style="color:#4CAF50;font-weight:bold;">...</span>
            </div>
            <div style="font-size:12px;margin-bottom:8px;">
                ${t('stage')}: <span id="auto-stage" style="color:#FFC107;font-weight:bold;">...</span>
            </div>

            <div style="border-top:1px solid #444;padding-top:8px;">
                <div style="font-size:12px;margin-bottom:4px;"><strong>${t('map')}</strong></div>
                <select id="map-select" style="width:100%;padding:4px;border-radius:4px;background:#222;color:#fff;border:1px solid #555;font-size:12px;">
                    <option value="">${t('loading')}</option>
                </select>
            </div>

            <div style="border-top:1px solid #444;padding-top:8px;margin-top:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <strong style="font-size:12px;">${t('autoEvents')}</strong>
                    <button id="event-toggle-btn" style="padding:3px 8px;cursor:pointer;border:none;border-radius:4px;font-weight:bold;font-size:11px;">ON</button>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <strong style="font-size:12px;">${t('modalClose')}</strong>
                    <button id="modal-toggle-btn" style="padding:3px 8px;cursor:pointer;border:none;border-radius:4px;font-weight:bold;font-size:11px;">ON</button>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <strong style="font-size:12px;">${t('petFeed')}</strong>
                    <button id="pet-toggle-btn" style="padding:3px 8px;cursor:pointer;border:none;border-radius:4px;font-weight:bold;font-size:11px;">ON</button>
                </div>
                <div style="font-size:11px;margin-bottom:6px;">
                    ${t('apples')}: <span id="pet-apples" style="color:#9E9E9E;font-weight:bold;">... / ...</span>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <strong style="font-size:12px;">${t('petEvolve')}</strong>
                    <button id="evolve-toggle-btn" style="padding:3px 8px;cursor:pointer;border:none;border-radius:4px;font-weight:bold;font-size:11px;">ON</button>
                </div>
                <div style="font-size:11px;margin-bottom:6px;display:flex;justify-content:space-between;">
                    <span>${t('petLevel')}: <span id="pet-lvl" style="color:#03A9F4;font-weight:bold;">?</span></span>
                    <span id="evolve-status" style="color:#9E9E9E;font-weight:bold;">...</span>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="font-size:12px;">${t('dailyClaim')}</strong>
                    <button id="daily-toggle-btn" style="padding:3px 8px;cursor:pointer;border:none;border-radius:4px;font-weight:bold;font-size:11px;">ON</button>
                </div>
                <div style="font-size:11px;margin-top:3px;">
                    ${t('dailyLeft')}: <span id="daily-left" style="color:#9E9E9E;font-weight:bold;">...</span>
                </div>
            </div>

            <div style="border-top:1px solid #444;padding-top:8px;margin-top:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <strong style="font-size:12px;">${t('mining')}</strong>
                    <button id="mining-toggle-btn" style="padding:3px 8px;cursor:pointer;border:none;border-radius:4px;font-weight:bold;font-size:11px;">ON</button>
                </div>
                <div style="font-size:11px;margin-bottom:3px;">
                    ${t('resource')}: <span id="mining-resource" style="color:#03A9F4;font-weight:bold;">...</span>
                </div>
                <div style="font-size:11px;margin-bottom:3px;">
                    ${t('left')}: <span id="mining-left" style="color:#FF9800;font-weight:bold;">...</span>
                </div>
                <div style="font-size:11px;">
                    ${t('status')}: <span id="mining-status" style="color:#9E9E9E;font-weight:bold;">...</span>
                </div>
            </div>
        `;
        Object.assign(panel.style, {
            position: 'fixed', bottom: '10px', left: '10px',
            background: 'rgba(30,30,30,0.92)', color: '#fff',
            padding: '10px 15px', borderRadius: '8px',
            border: '1px solid #444',
            zIndex: '2147483646',
            pointerEvents: 'auto',
            fontFamily: 'Arial,sans-serif',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)', minWidth: '245px'
        });

        const host = document.body || document.documentElement;
        host.appendChild(panel);

        document.getElementById('auto-toggle-btn').addEventListener('click', () => {
            isEnabled = !isEnabled;
            localStorage.setItem('idleRPGMU_auto_enabled', isEnabled);
            updateToggleUI();
        });
        document.getElementById('mining-toggle-btn').addEventListener('click', () => {
            isMiningEnabled = !isMiningEnabled;
            localStorage.setItem('idleRPGMU_mining_enabled', isMiningEnabled);
            if (!isMiningEnabled) { miningCycleStep = 0; miningMode = null; }
            updateToggleUI();
        });
        document.getElementById('modal-toggle-btn').addEventListener('click', () => {
            isModalCloseEnabled = !isModalCloseEnabled;
            localStorage.setItem('idleRPGMU_modal_enabled', isModalCloseEnabled);
            updateToggleUI();
        });
        document.getElementById('event-toggle-btn').addEventListener('click', () => {
            isEventAutoEnabled = !isEventAutoEnabled;
            localStorage.setItem('idleRPGMU_event_enabled', isEventAutoEnabled);
            updateToggleUI();
        });
        document.getElementById('pet-toggle-btn').addEventListener('click', () => {
            isPetFeedEnabled = !isPetFeedEnabled;
            localStorage.setItem('idleRPGMU_pet_feed_enabled', isPetFeedEnabled);
            updateToggleUI();
        });
        document.getElementById('daily-toggle-btn').addEventListener('click', () => {
            isDailyClaimEnabled = !isDailyClaimEnabled;
            localStorage.setItem('idleRPGMU_daily_enabled', isDailyClaimEnabled);
            updateToggleUI();
        });
        document.getElementById('evolve-toggle-btn').addEventListener('click', () => {
            isEvolveEnabled = !isEvolveEnabled;
            localStorage.setItem('idleRPGMU_evolve_enabled', isEvolveEnabled);
            updateToggleUI();
        });
        document.getElementById('map-select').addEventListener('change', (e) => {
            localStorage.setItem('idleRPGMU_map', e.target.value);
        });
        document.getElementById('lang-toggle-btn').addEventListener('click', () => {
            currentLang = currentLang === 'ru' ? 'en' : 'ru';
            localStorage.setItem('idleRPGMU_lang', currentLang);
            createUI();
            refreshMapSelect();
        });

        updateToggleUI();
    }

    function ensurePanel() {
        if (!document.getElementById('idle-auto-panel')) {
            console.log('🔧 Panel not found, recreating...');
            createUI();
            refreshMapSelect();
        }
    }

    function updateToggleUI() {
        const t1 = document.getElementById('auto-toggle-btn');
        const t2 = document.getElementById('mining-toggle-btn');
        const t3 = document.getElementById('modal-toggle-btn');
        const t4 = document.getElementById('event-toggle-btn');
        const t5 = document.getElementById('pet-toggle-btn');
        const t6 = document.getElementById('daily-toggle-btn');
        const t7 = document.getElementById('evolve-toggle-btn');
        const tl = document.getElementById('lang-toggle-btn');
        
        if (t1) { t1.textContent = isEnabled ? t('on') : t('off'); t1.style.background = isEnabled ? '#4CAF50' : '#f44336'; t1.style.color = 'white'; }
        if (t2) { t2.textContent = isMiningEnabled ? t('on') : t('off'); t2.style.background = isMiningEnabled ? '#03A9F4' : '#f44336'; t2.style.color = 'white'; }
        if (t3) { t3.textContent = isModalCloseEnabled ? t('on') : t('off'); t3.style.background = isModalCloseEnabled ? '#9C27B0' : '#f44336'; t3.style.color = 'white'; }
        if (t4) { t4.textContent = isEventAutoEnabled ? t('on') : t('off'); t4.style.background = isEventAutoEnabled ? '#FF9800' : '#f44336'; t4.style.color = 'white'; }
        if (t5) { t5.textContent = isPetFeedEnabled ? t('on') : t('off'); t5.style.background = isPetFeedEnabled ? '#E91E63' : '#f44336'; t5.style.color = 'white'; }
        if (t6) { t6.textContent = isDailyClaimEnabled ? t('on') : t('off'); t6.style.background = isDailyClaimEnabled ? '#FFC107' : '#f44336'; t6.style.color = 'white'; }
        if (t7) { t7.textContent = isEvolveEnabled ? t('on') : t('off'); t7.style.background = isEvolveEnabled ? '#9C27B0' : '#f44336'; t7.style.color = 'white'; }
        if (tl) { tl.textContent = currentLang.toUpperCase(); }
    }

    // ==========================================
    // 5. КАРТЫ / MAPS
    // ==========================================
    function getAvailableMaps() {
        const maps = [];
        document.querySelectorAll('button.destination-map').forEach(b => {
            const aria = b.getAttribute('aria-label') || '';
            if (aria.endsWith('Locked')) return;
            const name = aria.split(',')[0].trim();
            if (name && !maps.includes(name)) maps.push(name);
        });
        return maps;
    }

    function refreshMapSelect() {
        const sel = document.getElementById('map-select');
        if (!sel) return;
        const saved = localStorage.getItem('idleRPGMU_map') || 'Icarus';
        const maps = getAvailableMaps();
        if (maps.length === 0) return;

        const existing = Array.from(sel.options).map(o => o.value).filter(v => v);
        const same = existing.length === maps.length && existing.every((v, i) => v === maps[i]);

        if (!same) {
            sel.innerHTML = '';
            maps.forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                sel.appendChild(opt);
            });
        }
        sel.value = maps.includes(saved) ? saved : maps[0];
        if (!sel.value && maps[0]) sel.value = maps[0];
    }

    function getSelectedMap() {
        return localStorage.getItem('idleRPGMU_map') || 'Icarus';
    }

    // ==========================================
    // 6. УТИЛИТЫ / UTILS
    // ==========================================
    function updateStatusUI(level, stage) {
        const l = document.getElementById('auto-level');
        const s = document.getElementById('auto-stage');
        if (l) l.textContent = level;
        if (s) s.textContent = stage;
    }
    function updateMiningUI(resourceLabel, status, leftText) {
        const r = document.getElementById('mining-resource');
        const l = document.getElementById('mining-left');
        const s = document.getElementById('mining-status');
        if (r) r.textContent = resourceLabel;
        if (l && leftText !== undefined) l.textContent = leftText;
        if (s) s.textContent = status;
    }
    function getLevel() {
        const el = document.querySelector(SELECTOR_LEVEL);
        if (el) return el.textContent.trim();
        const btn = document.querySelector(SELECTOR_RESET);
        if (btn) {
            const m = btn.textContent.match(/Lv\.?\s*(\d+)/i);
            if (m) return m[1];
        }
        return '?';
    }
    function isVisible(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        const s = window.getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
    }
    function formatMs(ms) {
        const totalSec = Math.max(0, Math.floor(ms / 1000));
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        if (currentLang === 'ru') {
            if (h > 0) return `${h}ч ${m}м`;
            if (m > 0) return `${m}м ${s}с`;
            return `${s}с`;
        } else {
            if (h > 0) return `${h}h ${m}m`;
            if (m > 0) return `${m}m ${s}s`;
            return `${s}s`;
        }
    }
    function parseTimeText(txt) {
        if (!txt) return 0;
        const t2 = txt.toLowerCase();
        let ms = 0;
        const h = t2.match(/(\d+)\s*hour/);
        const m = t2.match(/(\d+)\s*min/);
        const s = t2.match(/(\d+)\s*sec/);
        if (h) ms += parseInt(h[1], 10) * 3600000;
        if (m) ms += parseInt(m[1], 10) * 60000;
        if (s) ms += parseInt(s[1], 10) * 1000;
        return ms;
    }
    function readMiningTimer() {
        const timerEl = document.querySelector(SELECTOR_MINING_TIMER);
        if (!timerEl) return null;
        let elapsedMs = 0, remainingMs = 0;
        timerEl.querySelectorAll('span').forEach(span => {
            const label = (span.childNodes[0] && span.childNodes[0].textContent || '').toLowerCase();
            const strong = span.querySelector('strong');
            if (!strong) return;
            const val = parseTimeText(strong.textContent);
            if (label.includes('elapsed')) elapsedMs = val;
            else if (label.includes('remaining')) remainingMs = val;
        });
        return { elapsedMs, remainingMs };
    }
    function getTabBtn(name) {
        const btns = document.querySelectorAll('nav.activity-switch button');
        for (const b of btns) {
            if ((b.textContent || '').trim().toLowerCase().includes(name)) return b;
        }
        return null;
    }
    function isTabActive(btn) {
        if (!btn) return false;
        return btn.getAttribute('aria-pressed') === 'true' || btn.classList.contains('active');
    }
    function findButtonIn(container, text) {
        const btns = container.querySelectorAll('button');
        for (const b of btns) {
            if ((b.textContent || '').trim().toLowerCase().includes(text.toLowerCase())) return b;
        }
        return null;
    }

    // ==========================================
    // 7. АВТО-ИВЕНТЫ / AUTO EVENTS
    // ==========================================
    function getEventNameFromModal(modal) {
        const small = modal.querySelector('small');
        if (small && small.textContent.trim()) return small.textContent.trim();
        const cls = modal.className || '';
        const m = cls.match(/([A-Z][a-zA-Z]+)-module/);
        if (m) return m[1].replace(/([A-Z])/g, ' $1').trim();
        return null;
    }

    function getTicketCountForEvent(eventName) {
        if (!eventName) return 0;
        const tickets = document.querySelectorAll(SELECTOR_TICKETS);
        for (const tt of tickets) {
            const title = tt.getAttribute('title') || tt.getAttribute('aria-label') || '';
            if (title.toLowerCase().includes(eventName.toLowerCase())) {
                const b = tt.querySelector('b');
                return b ? parseInt(b.textContent, 10) || 0 : 0;
            }
        }
        return 0;
    }

    function findEventModal() {
        const all = Array.from(document.querySelectorAll(SELECTOR_EVENT_MODAL))
                         .filter(m => isVisible(m));
        if (all.length === 0) return null;

        for (const m of all) {
            const h2 = m.querySelector('h2');
            const title = h2 ? h2.textContent.trim() : '';
            if (/exp applied/i.test(title)) return { modal: m, state: 'exp_applied', title };
        }
        for (const m of all) {
            const h2 = m.querySelector('h2');
            const title = h2 ? h2.textContent.trim() : '';
            if (/complete/i.test(title)) return { modal: m, state: 'complete', title };
        }
        for (const m of all) {
            const text = m.textContent || '';
            const h2 = m.querySelector('h2');
            const title = h2 ? h2.textContent.trim() : '';
            if (/registration is now open/i.test(text)) return { modal: m, state: 'open', title };
            if (/registration unavailable/i.test(text)) return { modal: m, state: 'unavailable', title };
            if (/event concluded/i.test(text))           return { modal: m, state: 'concluded', title };
        }
        return null;
    }

    function tryHandleEvent() {
        if (!isEventAutoEnabled) return null;

        const found = findEventModal();
        if (!found) {
            if (eventClaimStep !== 0 && !document.querySelector(SELECTOR_EVENT_MODAL)) {
                eventClaimStep = 0;
            }
            return null;
        }

        const { modal, state, title } = found;
        const eventName = getEventNameFromModal(modal) || 'Event';

        if (state === 'exp_applied') {
            if (eventClaimStep < 2) {
                const contBtn = findButtonIn(modal, 'Continue');
                if (contBtn && !contBtn.disabled) {
                    contBtn.click();
                    eventClaimStep = 2;
                    return `✅ ${t('continueEvt')}: ${eventName}`;
                }
            }
            return `⏳ ${eventName}: ${t('expApplied')}`;
        }

        if (state === 'complete') {
            if (eventClaimStep === 0) {
                const claimBtn = findButtonIn(modal, 'Claim EXP')
                              || findButtonIn(modal, 'Claim Reward')
                              || (() => {
                                     const btns = modal.querySelectorAll('button');
                                     for (const b of btns) {
                                         const txt = (b.textContent || '').trim();
                                         if (/^claim\s+/i.test(txt) && !/claim later/i.test(txt)) return b;
                                     }
                                     return null;
                                 })();
                if (claimBtn && !claimBtn.disabled) {
                    claimBtn.click();
                    eventClaimStep = 1;
                    return `💰 ${t('claim')}: ${eventName}`;
                }
                eventClaimStep = 2;
            }
            if (eventClaimStep === 1) {
                eventClaimStep = 2;
            }
            if (eventClaimStep === 2) {
                const returnBtn = findButtonIn(modal, 'Return to Hunting')
                               || findButtonIn(modal, 'Return to Hunt')
                               || findButtonIn(modal, 'Return');
                if (returnBtn && !returnBtn.disabled) {
                    returnBtn.click();
                    eventClaimStep = 0;
                    return `🏹 ${t('hunt')}: ${eventName}`;
                }
                const laterBtn = findButtonIn(modal, 'Claim Later')
                              || findButtonIn(modal, 'Close');
                if (laterBtn && !laterBtn.disabled) {
                    laterBtn.click();
                    eventClaimStep = 0;
                    return `⏭️ ${eventName} (${t('later')})`;
                }
                return `⏳ ${eventName}: ${t('waitBtn')}`;
            }
        }

        if (state === 'open' && eventClaimStep === 0) {
            const tickets = getTicketCountForEvent(eventName);
            if (tickets > 0) {
                const regBtn = findButtonIn(modal, 'Register Now');
                if (regBtn && !regBtn.disabled) {
                    regBtn.click();
                    return `🎫 ${t('reg')}: ${eventName} (${tickets})`;
                }
            } else {
                const laterBtn = findButtonIn(modal, 'Maybe Later');
                if (laterBtn && !laterBtn.disabled) {
                    laterBtn.click();
                    return `⏭️ ${eventName} (0)`;
                }
            }
        }

        if ((state === 'unavailable' || state === 'concluded') && eventClaimStep === 0) {
            const laterBtn = findButtonIn(modal, 'Maybe Later')
                          || findButtonIn(modal, 'Close');
            if (laterBtn && !laterBtn.disabled) {
                laterBtn.click();
                return `⏭️ ${eventName} (${state})`;
            }
        }

        return null;
    }

    // ==========================================
    // 8. ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН / CLOSE MODALS
    // ==========================================
    function closeAnyModal() {
        for (const contSel of MODAL_CONTAINERS) {
            let conts;
            try { conts = document.querySelectorAll(contSel); } catch(e) { continue; }
            for (const c of conts) {
                if (c.closest('#idle-auto-panel')) continue;
                // Игнорируем панель питомца, чтобы не закрыть её раньше времени
                if (c.querySelector(SELECTOR_PET_PANEL)) continue;
                if (!isVisible(c)) continue;
                for (const btnSel of CLOSE_BUTTON_SELECTORS) {
                    let btn;
                    try { btn = c.querySelector(btnSel); } catch(e) { continue; }
                    if (btn && isVisible(btn)) { btn.click(); return true; }
                }
            }
        }
        return false;
    }

    // ==========================================
    // 9. ПИТОМЕЦ, ЭВОЛЮЦИЯ И ЕЖЕДНЕВКИ / PET, EVOLVE & DAILY
    // ==========================================
    function updatePetUI() {
        const applesEl = document.getElementById('pet-apples');
        if (applesEl) {
            const balanceEl = document.querySelector(SELECTOR_PET_BALANCE);
            if (balanceEl) {
                const spans = balanceEl.querySelectorAll('span b');
                if (spans.length >= 2) {
                    const costMatch = spans[0].textContent.match(/\d+/);
                    const availMatch = spans[1].textContent.match(/\d+/);
                    if (costMatch && availMatch) {
                        const cost = parseInt(costMatch[0], 10);
                        const avail = parseInt(availMatch[0], 10);
                        applesEl.textContent = `${avail} / ${cost}`;
                        applesEl.style.color = avail >= cost ? '#4CAF50' : '#FF9800';
                    }
                }
            } else {
                applesEl.textContent = '... / ...';
                applesEl.style.color = '#9E9E9E';
            }
        }

        const lvlEl = document.getElementById('pet-lvl');
        const evoEl = document.getElementById('evolve-status');
        if (!lvlEl || !evoEl) return;

        const identityEl = document.querySelector(SELECTOR_PET_IDENTITY);
        if (identityEl) {
            const match = identityEl.textContent.match(/(\d+)\s*\/\s*100/);
            if (match) lvlEl.textContent = match[1];
            else lvlEl.textContent = '?';
        } else {
            lvlEl.textContent = '?';
        }

        if (!isEvolveEnabled) {
            evoEl.textContent = t('off');
            evoEl.style.color = '#9E9E9E';
            return;
        }

        const clockEl = document.querySelector(SELECTOR_PET_INCUBATION);
        if (clockEl) {
            evoEl.textContent = clockEl.textContent;
            evoEl.style.color = '#FF9800';
        } else {
            const evoSection = document.querySelector(SELECTOR_PET_EVOLUTION);
            if (evoSection) {
                const btn = evoSection.querySelector('button');
                if (btn && !btn.disabled) {
                    evoEl.textContent = t('ready');
                    evoEl.style.color = '#4CAF50';
                } else {
                    evoEl.textContent = t('waitBtn');
                    evoEl.style.color = '#9E9E9E';
                }
            } else {
                evoEl.textContent = '—';
                evoEl.style.color = '#9E9E9E';
            }
        }
    }

    function updateDailyUI() {
        const el = document.getElementById('daily-left');
        if (!el) return;

        if (!isDailyClaimEnabled) {
            el.textContent = t('off');
            el.style.color = '#9E9E9E';
            return;
        }

        const claimSection = document.querySelector(SELECTOR_DAILY_SECTION);
        if (!claimSection) {
            el.textContent = '...';
            el.style.color = '#9E9E9E';
            return;
        }

        const btn = claimSection.querySelector('button');
        if (btn && !btn.disabled) {
            el.textContent = t('dailyReady');
            el.style.color = '#4CAF50';
            return;
        }

        const b = claimSection.querySelector('b');
        if (b) {
            const match = b.textContent.match(/(\d{2}:\d{2}:\d{2})/);
            if (match) {
                el.textContent = match[1];
                el.style.color = '#FF9800';
                return;
            }
        }
        
        el.textContent = '...';
        el.style.color = '#9E9E9E';
    }

    function petTick() {
        if (!isPetFeedEnabled) return null;

        const feedBtn = document.querySelector(SELECTOR_PET_FEED);
        if (feedBtn && !feedBtn.disabled && isVisible(feedBtn)) {
            feedBtn.click();
            return t('feeding');
        }
        return null;
    }

    function evolveTick() {
        if (!isEvolveEnabled) return null;

        const evoSection = document.querySelector(SELECTOR_PET_EVOLUTION);
        const clockEl = document.querySelector(SELECTOR_PET_INCUBATION);

        if (clockEl) {
            const match = clockEl.textContent.match(/(\d{2}):(\d{2}):(\d{2})/);
            if (match) {
                const h = parseInt(match[1], 10);
                const m = parseInt(match[2], 10);
                const s = parseInt(match[3], 10);
                const remainingMs = (h * 3600 + m * 60 + s) * 1000;

                if (remainingMs > 1000) {
                    if (Date.now() - lastEvolveParse > 10000 || evolveFinishTime === 0) {
                        evolveFinishTime = Date.now() + remainingMs;
                        localStorage.setItem('idleRPGMU_evolve_finish', evolveFinishTime.toString());
                        lastEvolveParse = Date.now();
                    }
                } else {
                    evolveFinishTime = 0;
                    localStorage.setItem('idleRPGMU_evolve_finish', '0');
                }
            }
        }

        if (evoSection) {
            const btn = evoSection.querySelector('button');
            const timeReached = (evolveFinishTime > 0 && Date.now() >= evolveFinishTime);

            if (btn && !btn.disabled && isVisible(btn)) {
                if (timeReached || evolveFinishTime === 0 || !clockEl) {
                    btn.click();
                    evolveFinishTime = 0;
                    localStorage.setItem('idleRPGMU_evolve_finish', '0');
                    return t('evolving');
                }
            }
        }
        
        if (!evoSection) {
            const identityEl = document.querySelector(SELECTOR_PET_IDENTITY);
            if (identityEl && identityEl.textContent.includes('100 / 100')) {
                const allButtons = document.querySelectorAll('.Pets-module__wel0pa__shell button, .Pets-module__wel0pa__identity button');
                for (let btn of allButtons) {
                    const txt = (btn.textContent || '').toLowerCase();
                    if ((txt.includes('evolve') || txt.includes('ascend')) && !btn.disabled) {
                        btn.click();
                        return t('evolving');
                    }
                }
            }
        }

        return null;
    }

    function dailyTick() {
        if (!isDailyClaimEnabled) return null;

        const claimSection = document.querySelector(SELECTOR_DAILY_SECTION);
        if (!claimSection) return null;

        const b = claimSection.querySelector('b');
        const btn = claimSection.querySelector('button');

        if (b && b.textContent.includes('Next in')) {
            const match = b.textContent.match(/(\d{2}):(\d{2}):(\d{2})/);
            if (match) {
                const h = parseInt(match[1], 10);
                const m = parseInt(match[2], 10);
                const s = parseInt(match[3], 10);
                const remainingMs = (h * 3600 + m * 60 + s) * 1000;

                if (remainingMs > 1000) {
                    if (Date.now() - lastDailyParse > 10000 || dailyFinishTime === 0) {
                        dailyFinishTime = Date.now() + remainingMs;
                        localStorage.setItem('idleRPGMU_daily_finish', dailyFinishTime.toString());
                        lastDailyParse = Date.now();
                    }
                } else {
                    dailyFinishTime = 0;
                    localStorage.setItem('idleRPGMU_daily_finish', '0');
                }
            }
        }

        const timeReached = (dailyFinishTime > 0 && Date.now() >= dailyFinishTime);
        
        if (btn && !btn.disabled && isVisible(btn)) {
            if (timeReached || dailyFinishTime === 0 || !b) {
                btn.click();
                dailyFinishTime = 0;
                localStorage.setItem('idleRPGMU_daily_finish', '0');
                return t('dailyClaiming');
            }
        }
        
        return null;
    }

    // ==========================================
    // 10. MINING — СИНК + ЦИКЛ / SYNC + CYCLE
    // ==========================================
    function miningTick() {
        if (!isMiningEnabled) {
            updateMiningUI('—', t('miningOff'), '—');
            return;
        }

        const miningTab = getTabBtn('mining');
        const huntingTab = getTabBtn('hunting');
        if (!miningTab || !huntingTab) {
            updateMiningUI('—', t('noTabs'), '—');
            return;
        }

        if (miningCycleStep > 0) {
            runMiningCycle(miningTab, huntingTab);
            return;
        }

        const now = Date.now();
        const needSync = (miningStartedAt === 0) || (now - miningLastSyncAt >= MINING_SYNC_INTERVAL_MS);
        const expired  = (miningStartedAt > 0) && (now - miningStartedAt >= MINING_CYCLE_MS);

        if (expired) {
            miningMode = 'collect';
            miningCycleStep = 1;
            runMiningCycle(miningTab, huntingTab);
            return;
        }

        if (needSync) {
            miningMode = 'sync';
            miningCycleStep = 1;
            runMiningCycle(miningTab, huntingTab);
            return;
        }

        const left = MINING_CYCLE_MS - (now - miningStartedAt);
        const sinceSync = Math.floor((now - miningLastSyncAt) / 60000);
        updateMiningUI(
            MINING_RESOURCES[miningIndex].label,
            `⏳ (${t('syncAgo', { n: sinceSync })})`,
            formatMs(left)
        );
    }

    function runMiningCycle(miningTab, huntingTab) {
        const res = MINING_RESOURCES[miningIndex];

        if (miningCycleStep === 1) {
            if (!isTabActive(miningTab)) {
                miningTab.click();
                updateMiningUI(res.label, t('toMining'), '...');
                return;
            }
            miningCycleStep = 2;
            return;
        }

        if (miningCycleStep === 2) {
            const primaryBtn = document.querySelector(SELECTOR_MINING_PRIMARY);
            if (!primaryBtn) return;
            const active = /stop|collect/i.test(primaryBtn.textContent || '');
            const now = Date.now();

            if (miningMode === 'sync') {
                if (active) {
                    const tmr = readMiningTimer();
                    if (tmr && tmr.elapsedMs > 0) {
                        miningStartedAt = now - tmr.elapsedMs;
                        miningLastSyncAt = now;
                        localStorage.setItem('idleRPGMU_mining_started', miningStartedAt.toString());
                        localStorage.setItem('idleRPGMU_mining_sync', miningLastSyncAt.toString());
                    }
                    miningCycleStep = 6;
                } else {
                    miningMode = 'startNew';
                    miningCycleStep = 4;
                }
                return;
            }

            if (miningMode === 'collect') {
                if (active) {
                    primaryBtn.click();
                    updateMiningUI(res.label, t('collect'), currentLang === 'ru' ? '0м' : '0m');
                    miningCycleStep = 3;
                } else {
                    miningCycleStep = 3;
                }
                return;
            }

            if (miningMode === 'startNew') {
                if (active) {
                    const tmr = readMiningTimer();
                    if (tmr) miningStartedAt = now - tmr.elapsedMs;
                    miningLastSyncAt = now;
                    localStorage.setItem('idleRPGMU_mining_started', miningStartedAt.toString());
                    localStorage.setItem('idleRPGMU_mining_sync', miningLastSyncAt.toString());
                    miningCycleStep = 6;
                } else {
                    miningCycleStep = 4;
                }
                return;
            }
        }

        if (miningCycleStep === 3) {
            miningIndex = (miningIndex + 1) % MINING_RESOURCES.length;
            localStorage.setItem('idleRPGMU_mining_index', miningIndex);
            miningCycleStep = 4;
            updateMiningUI(MINING_RESOURCES[miningIndex].label, t('choice'), '...');
            return;
        }

        if (miningCycleStep === 4) {
            const nextRes = MINING_RESOURCES[miningIndex];
            const resBtn = document.querySelector(`button[data-tone="${nextRes.tone}"]`);
            
            if (resBtn && resBtn.disabled) {
                console.log(`⛏️ Ресурс ${nextRes.label} заблокирован, пропускаем.`);
                miningIndex = (miningIndex + 1) % MINING_RESOURCES.length;
                localStorage.setItem('idleRPGMU_mining_index', miningIndex);
                updateMiningUI(MINING_RESOURCES[miningIndex].label, t('choice'), '...');
                return;
            }

            if (resBtn) {
                resBtn.click();
                updateMiningUI(nextRes.label, t('choice'), '...');
                miningCycleStep = 5;
            } else {
                miningCycleStep = 5;
            }
            return;
        }

        if (miningCycleStep === 5) {
            const startBtn = document.querySelector(SELECTOR_MINING_PRIMARY);
            if (startBtn && isVisible(startBtn) && !/stop|collect/i.test(startBtn.textContent || '')) {
                startBtn.click();
                updateMiningUI(MINING_RESOURCES[miningIndex].label, t('start'), currentLang === 'ru' ? '6ч' : '6h');
                miningCycleStep = 6;
                return;
            }
            return;
        }

        if (miningCycleStep === 6) {
            if (!isTabActive(huntingTab)) {
                huntingTab.click();
                updateMiningUI(MINING_RESOURCES[miningIndex].label, t('toHunt'), '...');
                return;
            }
            if (miningMode === 'collect' || miningMode === 'startNew') {
                miningStartedAt = Date.now();
                miningLastSyncAt = Date.now();
                localStorage.setItem('idleRPGMU_mining_started', miningStartedAt.toString());
                localStorage.setItem('idleRPGMU_mining_sync', miningLastSyncAt.toString());
            }
            miningCycleStep = 0;
            miningMode = null;
            return;
        }
    }

    // ==========================================
    // 11. ГЛАВНЫЙ ЦИКЛ / MAIN LOOP
    // ==========================================
    let mapRefreshCounter = 0;

    function mainLoop() {
        ensurePanel();

        if (!isEnabled) {
            updateStatusUI(getLevel(), t('off'));
            updateMiningUI('—', t('miningOff'), '—');
            return;
        }

        const level = getLevel();
        let stage = t('waiting');

        mapRefreshCounter++;
        if (mapRefreshCounter >= 30) {
            refreshMapSelect();
            mapRefreshCounter = 0;
        }

        // 1. Закрытие модалок (кроме питомца)
        if (isModalCloseEnabled && closeAnyModal()) {
            updateStatusUI(level, t('closeModal'));
            return;
        }

        // 2. Логика работы с питомцем (Авто-открытие и синхронизация)
        const isPetPanelOpen = document.querySelector(SELECTOR_PET_PANEL);
        
        if (isPetPanelOpen) {
            // Если панель открыта, обновляем данные и выполняем действия
            updatePetUI();
            updateDailyUI();
            
            const evolveResult = evolveTick();
            if (evolveResult) updateStatusUI(level, evolveResult);
            
            const dailyResult = dailyTick();
            if (dailyResult) updateStatusUI(level, dailyResult);
            
            const petResult = petTick();
            if (petResult) updateStatusUI(level, petResult);
            
            // Если мы её открыли авто-кликом, пытаемся закрыть, чтобы не мешала
            if (petPanelAutoOpened) {
                // Ищем кнопку закрытия (крестик)
                const closeBtn = document.querySelector('.Pets-module__wel0pa__close') || document.querySelector('button[aria-label="Close"]');
                if (closeBtn && isVisible(closeBtn)) {
                    closeBtn.click();
                    petPanelAutoOpened = false;
                    petPanelCooldown = Date.now(); // Кулдаун на следующее открытие
                } else {
                    // Если крестика нет, пробуем кликнуть по иконке питомца (toggle)
                    const compBtn = document.querySelector(SELECTOR_PET_COMPANION);
                    if (compBtn && isVisible(compBtn)) {
                        compBtn.click();
                        petPanelAutoOpened = false;
                        petPanelCooldown = Date.now();
                    }
                }
            }
        } else {
            // Панель закрыта. Проверяем, не пора ли её открыть
            if (isPetFeedEnabled || isDailyClaimEnabled || isEvolveEnabled) {
                if (Date.now() - petPanelCooldown > PET_CHECK_INTERVAL) {
                    const compBtn = document.querySelector(SELECTOR_PET_COMPANION);
                    if (compBtn && !compBtn.disabled && isVisible(compBtn)) {
                        compBtn.click();
                        petPanelAutoOpened = true;
                        petPanelCooldown = Date.now();
                        updateStatusUI(level, '🐾 OPEN PET');
                        return; // Ждем следующего тика для рендера
                    }
                }
            }
        }

        // 3. Обработка ивентов
        const eventResult = tryHandleEvent();
        if (eventResult) {
            updateStatusUI(level, eventResult);
            return;
        }

        // 4. Reset
        const resetBtn = document.querySelector(SELECTOR_RESET);
        if (resetBtn && !resetBtn.disabled) {
            if (Date.now() - lastResetTime > RESET_COOLDOWN) {
                resetBtn.click();
                lastResetTime = Date.now();
                stage = t('reset');
            } else {
                stage = t('resetCd');
            }
        }

        // 5. Карта
        if (stage !== t('reset') && stage !== t('resetCd')) {
            const selectedMap = getSelectedMap();
            const mapBtn = document.querySelector(`button.destination-map[aria-label^="${selectedMap},"]`);
            if (mapBtn && !mapBtn.disabled && !mapBtn.classList.contains('selected')) {
                mapBtn.click();
                stage = 'MAP: ' + selectedMap;
            } else if (mapBtn && mapBtn.classList.contains('selected')) {
                stage = 'MAP: ' + selectedMap + ' ✓';
            } else {
                stage = 'MAP: ' + selectedMap + ' ?';
            }
        }

        updateStatusUI(level, stage);
        miningTick();
    }

    // ==========================================
    // 12. ЗАПУСК / START (Firefox-friendly)
    // ==========================================
    function waitForBody(callback) {
        if (document.body) {
            callback();
            return;
        }
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect();
                callback();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        const iv = setInterval(() => {
            if (document.body) {
                clearInterval(iv);
                observer.disconnect();
                callback();
            }
        }, 100);
    }

    function startScript() {
        ensurePanel();
        refreshMapSelect();
        setTimeout(refreshMapSelect, 500);
        setTimeout(refreshMapSelect, 2000);
        setTimeout(refreshMapSelect, 5000);

        setInterval(mainLoop, CLICK_INTERVAL);

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                ensurePanel();
                mainLoop();
            }
        });

        console.log('🚀 AutoClicker v8.0 started. Lang:', currentLang);
    }

    waitForBody(startScript);

})();
