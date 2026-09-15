/* ============================================================
   ProjectSIS – Settings page logic
   ============================================================ */

initPage('settings');
EmailStore.init();
NotificationStore.init();

// Set nav icons
document.getElementById('iconAppearance').innerHTML = Icons.palette;
document.getElementById('iconNotifications').innerHTML = Icons.bell;
document.getElementById('iconGeneral').innerHTML = Icons.globe;
document.getElementById('iconData').innerHTML = Icons.shield;
document.getElementById('iconGmail').innerHTML = Icons.google;

const settings = Settings.get();
const compactToggle = document.getElementById('compactToggle');
compactToggle.checked = settings.compactMode;
compactToggle.addEventListener('change', () => { Settings.update({ compactMode: compactToggle.checked }); Theme.applyDensity(compactToggle.checked); });
const sidebarToggle = document.getElementById('sidebarToggle');
sidebarToggle.checked = settings.sidebarCollapsed;
sidebarToggle.addEventListener('change', () => Settings.update({ sidebarCollapsed: sidebarToggle.checked }));
const lastSync = localStorage.getItem(SIS_CONFIG.storageKeys.lastSync);
document.getElementById('lastSyncStatus').textContent = lastSync ? new Date(lastSync).toLocaleString() : 'Not synchronized yet';
document.getElementById('accountStatus').textContent = Profile.get().email || 'Local session';
document.getElementById('signOutBtn').addEventListener('click', () => { Gmail.signOut(); window.location.href = 'index.html'; });

// ---------- Panel switching ----------
document.querySelectorAll('.settings-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    document.getElementById('panel' + item.dataset.panel.charAt(0).toUpperCase() + item.dataset.panel.slice(1)).classList.add('active');
  });
});

// ---------- Theme ----------
function highlightTheme(theme) {
  document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
  const el = document.getElementById('theme' + theme.charAt(0).toUpperCase() + theme.slice(1));
  if (el) el.classList.add('active');
}

highlightTheme(settings.theme);

document.querySelectorAll('.theme-option').forEach(opt => {
  opt.addEventListener('click', () => {
    const theme = opt.dataset.theme;
    Settings.update({ theme });
    Theme.apply(theme);
    highlightTheme(theme);
    Toast.show('Theme updated', `Switched to ${theme} mode`, 'success');
  });
});

// ---------- Notifications ----------
const notifToggle = document.getElementById('notifToggle');
notifToggle.checked = settings.notifications;
notifToggle.addEventListener('change', () => {
  Settings.update({ notifications: notifToggle.checked });
  Toast.show('Notifications', notifToggle.checked ? 'Enabled' : 'Disabled', 'info');
});

const soundToggle = document.getElementById('soundToggle');
soundToggle.checked = settings.soundEnabled;
soundToggle.addEventListener('change', () => {
  Settings.update({ soundEnabled: soundToggle.checked });
  Toast.show('Sound alerts', soundToggle.checked ? 'Enabled' : 'Disabled', 'info');
});

// ---------- General ----------
const languageSelect = document.getElementById('languageSelect');
languageSelect.value = settings.language;
languageSelect.addEventListener('change', () => {
  Settings.update({ language: languageSelect.value });
  Toast.show('Language updated', '', 'success');
});

const autoRefreshToggle = document.getElementById('autoRefreshToggle');
autoRefreshToggle.checked = settings.autoRefresh;
autoRefreshToggle.addEventListener('change', () => {
  Settings.update({ autoRefresh: autoRefreshToggle.checked });
  Toast.show('Auto refresh', autoRefreshToggle.checked ? 'Enabled' : 'Disabled', 'info');
});

const refreshIntervalSelect = document.getElementById('refreshIntervalSelect');
refreshIntervalSelect.value = String(settings.refreshInterval);
refreshIntervalSelect.addEventListener('change', () => {
  Settings.update({ refreshInterval: parseInt(refreshIntervalSelect.value) });
  Toast.show('Refresh interval updated', '', 'success');
});

// ---------- Data ----------
document.getElementById('resetDataBtn').addEventListener('click', () => {
  EmailStore.resetSampleData();
  Toast.show('Data reset', '100 sample emails regenerated', 'success');
});

document.getElementById('clearDataBtn').addEventListener('click', () => {
  Object.values(SIS_CONFIG.storageKeys).forEach(key => localStorage.removeItem(key));
  Toast.show('All data cleared', 'The app will reload with fresh data', 'success');
  setTimeout(() => window.location.href = 'index.html', 1500);
});

// ---------- Gmail ----------
const gmailConnectBtn = document.getElementById('gmailConnectBtn');
const gmailStatus = document.getElementById('gmailStatus');

if (Gmail.isSignedIn()) {
  gmailStatus.textContent = 'Connected';
  gmailConnectBtn.textContent = 'Disconnect';
  gmailConnectBtn.classList.remove('btn-primary');
  gmailConnectBtn.classList.add('btn-ghost');
}

gmailConnectBtn.addEventListener('click', async () => {
  if (Gmail.isSignedIn()) {
    Gmail.signOut();
    gmailStatus.textContent = 'Not connected';
    gmailConnectBtn.textContent = 'Connect Gmail';
    gmailConnectBtn.classList.add('btn-primary');
    gmailConnectBtn.classList.remove('btn-ghost');
    return;
  }

  try {
    const result = await Gmail.init();

    if (!result || result.configured === false) {
      Toast.show('Gmail not configured', 'Add your Google Client ID in the setup guide to enable Gmail sync.', 'warning');
      setTimeout(() => {
        window.location.href = 'setup-guide.html';
      }, 1500);
      return;
    }

    if (result.ready) {
      Gmail.signIn();
    }
  } catch (err) {
    Toast.show('Connection failed', err.message, 'error');
  }
});
