/* ============================================================
   MailSphere S – Shared utilities (theme, icons, toast, sidebar)
   by Jishan Verma
   ============================================================ */

/* ---------- Theme management ---------- */
const Theme = {
  init() {
    const settings = Settings.get();
    this.apply(settings.theme || 'dark');
    this.applyDensity(settings.compactMode);
  },
  apply(theme) {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  },
  applyDensity(isCompact) {
    if (isCompact) {
      document.documentElement.setAttribute('data-density', 'compact');
    } else {
      document.documentElement.removeAttribute('data-density');
    }
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    Settings.update({ theme: next });
    this.apply(next);
    return next;
  }
};

/* ---------- Settings (LocalStorage) ---------- */
const Settings = {
  defaults: {
    theme: 'dark',
    notifications: true,
    language: 'en',
    autoRefresh: false,
    refreshInterval: 60000,
    soundEnabled: true,
    compactMode: false,
    sidebarCollapsed: false
  },
  get() {
    try {
      let raw = localStorage.getItem(SIS_CONFIG.storageKeys.settings);
      if (!raw) raw = localStorage.getItem('sis_settings');
      return raw ? { ...this.defaults, ...JSON.parse(raw) } : { ...this.defaults };
    } catch {
      return { ...this.defaults };
    }
  },
  update(partial) {
    const current = this.get();
    const updated = { ...current, ...partial };
    localStorage.setItem(SIS_CONFIG.storageKeys.settings, JSON.stringify(updated));
    return updated;
  },
  reset() {
    localStorage.removeItem(SIS_CONFIG.storageKeys.settings);
    return { ...this.defaults };
  }
};

/* ---------- Icon library (inline SVG) ---------- */
const Icons = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
  inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  archive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
  attachment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  mailOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 6l-10 7L2 6"/><path d="M22 6v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2z"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  total: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  unread: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
  priority: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  parents: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  teachers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5"/></svg>',
  homework: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  leave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  fees: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  bookOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  graduationCap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5"/></svg>',
  fileText: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  userPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
  event: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  alertCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  alertTriangle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="12" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  trendingUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  trendingDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  inboxEmpty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.504 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>',
  volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
  google: '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  collapse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9-3 3 3 3"/></svg>',
  expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m13 15 3-3-3-3"/></svg>',
  maximize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
  minimize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6m10-10h-6V4m0 6 7-7M9 15l-7 7"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>'
};

/* ---------- Error handling ---------- */
const ErrorSystem = {
  classify(error, status = 0) {
    const reason = String(error?.reason || error?.message || error || '').toLowerCase();
    if (status === 401 || reason.includes('invalid token') || reason.includes('unauthorized')) return 'unauthorized';
    if (status === 403 || reason.includes('insufficientpermissions') || reason.includes('forbidden')) return 'forbidden';
    if (reason.includes('network') || reason.includes('fetch')) return 'network';
    return 'unknown';
  },
  friendly(error, status = 0) {
    switch (this.classify(error, status)) {
      case 'forbidden': return 'Gmail permission is required. Sign in again and approve read-only Gmail access.';
      case 'unauthorized': return 'Your Google session expired. Please sign in again.';
      case 'network': return 'Google could not be reached. Demo Mode is available while you are offline.';
      default: return error?.message || 'Something went wrong. Please try again.';
    }
  },
  report(context, error, response = null) {
    console.error(`[ProjectSIS] ${context}`, {
      error,
      status: response?.status || error?.status || 0,
      response: response?.payload || response?.body || null
    });
  }
};

/* ---------- Toast notifications ---------- */
const Toast = {
  container: null,
  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(title, desc = '', type = 'info') {
    if (!this.container) this.init();
    const colors = {
      success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', icon: 'check', iconColor: '#10b981' },
      error: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', icon: 'alertCircle', iconColor: '#ef4444' },
      warning: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', icon: 'alertCircle', iconColor: '#f59e0b' },
      info: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', icon: 'bell', iconColor: '#3b82f6' }
    };
    const c = colors[type] || colors.info;
    const toast = document.createElement('div');
    toast.className = 'toast glass-strong';
    toast.style.background = c.bg;
    toast.style.borderColor = c.border;
    toast.innerHTML = `
      <div class="toast-icon" style="color:${c.iconColor}">${Icons[c.icon] || Icons.bell}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${desc ? `<div class="toast-desc">${desc}</div>` : ''}
      </div>
    `;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  }
};

function animateCounters(root = document) {
  root.querySelectorAll('[data-counter]').forEach(element => {
    const target = Number(element.dataset.counter) || 0;
    const duration = 650;
    const start = performance.now();
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ---------- Sidebar component ---------- */
const Sidebar = {
  render(activePage) {
    const links = [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: 'dashboard.html' },
      { id: 'inbox', label: 'Inbox', icon: 'inbox', href: 'inbox.html' },
      { id: 'analytics', label: 'Analytics', icon: 'analytics', href: 'analytics.html' },
      { id: 'alerts', label: 'Alerts', icon: 'alertTriangle', href: 'alerts.html' },
      { id: 'settings', label: 'Settings', icon: 'settings', href: 'settings.html' },
      { id: 'about', label: 'About', icon: 'info', href: 'about.html' },
      { id: 'setup', label: 'Setup Guide', icon: 'book', href: 'setup-guide.html' }
    ];

    const profile = Profile.get();
    const unreadCount = EmailStore.getUnreadCount();
    const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
    const avatarStyle = profile.avatar ? `background-image:url("${profile.avatar}");background-size:cover;background-position:center;` : '';

    return `
      <aside class="sidebar" id="sidebar">
        <a href="dashboard.html" class="sidebar-brand">
          <div class="sidebar-brand-logo">S</div>
          <div class="sidebar-brand-copy"><div class="sidebar-brand-text">MailSphere S</div><div class="sidebar-brand-byline">by Jishan Verma</div></div>
        </a>
        <button class="sidebar-collapse-btn" id="sidebarCollapseBtn" title="Collapse sidebar (Ctrl/Cmd + B)">${Icons.collapse}</button>
        <nav class="sidebar-nav">
          <div class="sidebar-section-label">Main</div>
          ${links.map(l => `
            <a href="${l.href}" class="sidebar-link ${l.id === activePage ? 'active' : ''}">
              ${Icons[l.icon]}
              <span class="sidebar-link-text">${l.label}</span>
              ${l.id === 'inbox' && unreadCount > 0 ? `<span class="sidebar-link-badge">${unreadCount}</span>` : ''}
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <a href="profile.html" class="sidebar-user">
            <div class="sidebar-user-avatar" style="${avatarStyle}">${profile.avatar ? '' : initials}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${profile.name || 'Guest User'}</div>
              <div class="sidebar-user-role">${profile.role || 'Staff'}</div>
            </div>
          </a>
        </div>
      </aside>
      <div class="sidebar-overlay" id="sidebarOverlay"></div>
    `;
  },
  mount(activePage) {
    const mountPoint = document.getElementById('sidebar-mount');
    if (mountPoint) {
      mountPoint.innerHTML = this.render(activePage);
      this.bindEvents();
    }
  },
  bindEvents() {
    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobileMenuBtn');
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const setCollapsed = (collapsed) => {
      sidebar.classList.toggle('collapsed', collapsed);
      document.querySelector('.main-area')?.classList.toggle('sidebar-collapsed', collapsed);
      Settings.update({ sidebarCollapsed: collapsed });
      if (collapseBtn) collapseBtn.innerHTML = collapsed ? Icons.expand : Icons.collapse;
    };
    setCollapsed(Settings.get().sidebarCollapsed);
    collapseBtn?.addEventListener('click', () => setCollapsed(!sidebar.classList.contains('collapsed')));
    if (!window.__sisSidebarShortcutBound) {
      window.__sisSidebarShortcutBound = true;
      document.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
          event.preventDefault();
          const current = document.getElementById('sidebar');
          if (current) setCollapsed(!current.classList.contains('collapsed'));
        }
      });
    }
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.add('show');
        overlay.classList.add('show');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
      });
    }
  }
};

/* ---------- Header component ---------- */
const Header = {
  render(activePage, searchPlaceholder = 'Search emails, students, parents...') {
    const profile = Profile.get();
    const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
    const notifCount = EmailStore.getUnreadCount();
    const avatarStyle = profile.avatar ? `background-image:url("${profile.avatar}");background-size:cover;background-position:center;` : '';

    return `
      <header class="top-header">
        <button class="btn-icon mobile-menu-btn" id="mobileMenuBtn">${Icons.menu}</button>
        <div class="header-search">
          ${Icons.search}
          <input type="text" id="globalSearch" placeholder="${searchPlaceholder}" />
        </div>
        <div class="header-actions">
          <button class="header-btn" id="themeToggle" title="Toggle theme">${Icons.moon}</button>
          <button class="header-btn" id="notifBtn" title="Notifications">
            ${Icons.bell}
            ${notifCount > 0 ? '<span class="header-btn-dot"></span>' : ''}
          </button>
          <div style="position:relative">
            <div class="header-avatar" id="headerAvatar" style="${avatarStyle}">${profile.avatar ? '' : initials}</div>
            <div class="profile-dropdown glass-strong" id="profileDropdown">
              <div class="profile-dropdown-header">
                <div class="profile-dropdown-name">${profile.name || 'Guest User'}</div>
                <div class="profile-dropdown-email">${profile.email || 'Not signed in'}</div>
              </div>
              <a href="profile.html" class="profile-dropdown-item">${Icons.user} My Profile</a>
              <a href="settings.html" class="profile-dropdown-item">${Icons.settings} Settings</a>
              <a href="setup-guide.html" class="profile-dropdown-item">${Icons.book} Setup Guide</a>
              <a href="index.html" class="profile-dropdown-item" style="color:var(--sis-error)">${Icons.logout} Sign Out</a>
            </div>
          </div>
        </div>
      </header>
      <div class="notif-dropdown glass-strong" id="notifDropdown" style="position:absolute">
        <div style="padding:var(--space-12);border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:0.875rem;font-weight:700">Notifications</span>
          <button class="btn-ghost btn" style="padding:4px 10px;font-size:0.7rem" id="clearNotif">Clear all</button>
        </div>
        <div id="notifList"></div>
      </div>
    `;
  },
  mount(activePage) {
    const mountPoint = document.getElementById('header-mount');
    if (mountPoint) {
      mountPoint.innerHTML = this.render(activePage);
      this.bindEvents();
      this.renderNotifications();
    }
  },
  bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      const settings = Settings.get();
      themeBtn.innerHTML = settings.theme === 'dark' ? Icons.sun : Icons.moon;
      themeBtn.addEventListener('click', () => {
        const next = Theme.toggle();
        themeBtn.innerHTML = next === 'dark' ? Icons.sun : Icons.moon;
      });
    }

    // Notification dropdown
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = notifBtn.getBoundingClientRect();
        notifDropdown.style.top = (rect.bottom + 8) + 'px';
        notifDropdown.style.right = '12px';
        notifDropdown.classList.toggle('show');
        this.renderNotifications();
      });
      document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
          notifDropdown.classList.remove('show');
        }
      });
    }

    const clearBtn = document.getElementById('clearNotif');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        NotificationStore.clearAll();
        this.renderNotifications();
        Toast.show('Notifications cleared', '', 'success');
      });
    }

    // Profile dropdown
    const avatar = document.getElementById('headerAvatar');
    const profileDropdown = document.getElementById('profileDropdown');
    if (avatar && profileDropdown) {
      avatar.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = avatar.getBoundingClientRect();
        profileDropdown.style.top = (rect.bottom + 8) + 'px';
        profileDropdown.style.right = '12px';
        profileDropdown.classList.toggle('show');
      });
      document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && e.target !== avatar) {
          profileDropdown.classList.remove('show');
        }
      });
    }

    // Global search
    const search = document.getElementById('globalSearch');
    if (search) {
      search.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        window.dispatchEvent(new CustomEvent('sis:search', { detail: query }));
      });
    }
  },
  renderNotifications() {
    const list = document.getElementById('notifList');
    if (!list) return;
    const notifs = NotificationStore.getAll();
    if (notifs.length === 0) {
      list.innerHTML = `<div class="empty-state" style="padding:var(--space-16)"><div class="empty-state-title">No notifications</div></div>`;
      return;
    }
    list.innerHTML = notifs.slice(0, 20).map(n => {
      const iconColor = n.color || '#3b82f6';
      return `
        <div class="notif-item">
          <div class="notif-icon" style="background:${iconColor}22;color:${iconColor}">${Icons[n.icon] || Icons.bell}</div>
          <div class="notif-content">
            <div class="notif-title">${n.title}</div>
            <div class="notif-desc">${n.desc}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `;
    }).join('');
  }
};

/* ---------- Profile (LocalStorage) ---------- */
const Profile = {
  defaults: {
    name: 'Sarah Mitchell',
    role: 'Principal',
    email: 'sarah.mitchell@school.edu',
    phone: '+1 555-0100',
    school: 'Greenwood International School',
    avatar: null
  },
  get() {
    try {
      const raw = localStorage.getItem(SIS_CONFIG.storageKeys.profile);
      return raw ? { ...this.defaults, ...JSON.parse(raw) } : { ...this.defaults };
    } catch {
      return { ...this.defaults };
    }
  },
  update(partial) {
    const current = this.get();
    const updated = { ...current, ...partial };
    localStorage.setItem(SIS_CONFIG.storageKeys.profile, JSON.stringify(updated));
    return updated;
  },
  applyGoogleUser(user) {
    if (!user || !user.name) return this.get();
    const profile = this.get();
    const next = {
      ...profile,
      name: user.name || profile.name,
      email: user.email || profile.email,
      avatar: user.picture || user.avatar || profile.avatar || null
    };
    localStorage.setItem(SIS_CONFIG.storageKeys.profile, JSON.stringify(next));
    return next;
  }
};

/* ---------- Page init helper ---------- */
function initPage(activePage) {
  Theme.init();
  Toast.init();
  Sidebar.mount(activePage);
  Header.mount(activePage);
  if (!window.__sisErrorsBound) {
    window.__sisErrorsBound = true;
    window.addEventListener('error', (event) => ErrorSystem.report('Uncaught JavaScript error', event.error || event.message));
    window.addEventListener('unhandledrejection', (event) => ErrorSystem.report('Unhandled promise rejection', event.reason));
  }
  // Re-apply theme on system change if auto
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const settings = Settings.get();
    if (settings.theme === 'auto') Theme.apply('auto');
  });
}

window.Theme = Theme;
window.Settings = Settings;
window.Icons = Icons;
window.Toast = Toast;
window.animateCounters = animateCounters;
window.ErrorSystem = ErrorSystem;
window.Sidebar = Sidebar;
window.Header = Header;
window.Profile = Profile;
window.initPage = initPage;
