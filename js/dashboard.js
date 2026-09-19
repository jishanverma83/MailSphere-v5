/* ============================================================
   ProjectSIS – Dashboard page logic
   ============================================================ */

initPage('dashboard');
EmailStore.init();
NotificationStore.init();

// Set date
document.getElementById('dashDate').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// Refresh icon
document.getElementById('refreshIcon').innerHTML = Icons.refresh;

// Render stat cards
const stats = EmailStore.getStats();
const statCards = [
  { label: 'Total Emails', value: stats.total, icon: 'total', color: '#3b82f6' },
  { label: 'Unread', value: stats.unread, icon: 'unread', color: '#f59e0b' },
  { label: 'Important', value: stats.important, icon: 'priority', color: '#ef4444' },
  { label: 'Today', value: stats.today, icon: 'event', color: '#06b6d4' },
  { label: 'High Priority', value: stats.high, icon: 'zap', color: '#f97316' },
  { label: 'Overdue Alerts', value: stats.overdueAlerts, icon: 'alertTriangle', color: '#dc2626' }
];

document.getElementById('statGrid').innerHTML = statCards.map((s, i) => `
  <div class="stat-card glass animate-slideUp stagger-${(i % 8) + 1}">
    <div class="stat-card-icon" style="background:${s.color}22;color:${s.color}">${Icons[s.icon]}</div>
    <div class="stat-card-value" data-counter="${s.value}">0</div>
    <div class="stat-card-label">${s.label}</div>
  </div>
`).join('');
animateCounters(document.getElementById('statGrid'));

const intelligenceCards = document.getElementById('intelligenceCards');
const intelligence = EmailStore.getSchoolIntelligence();
if (intelligenceCards) {
  intelligenceCards.innerHTML = intelligence.length ? intelligence.map(card => `
    <a class="intelligence-card" href="inbox.html?filter=${card.category}">
      <span class="intelligence-icon" style="color:${CATEGORY_META[card.category].color}">${Icons[CATEGORY_META[card.category].icon] || Icons.info}</span>
      <span><strong>${CATEGORY_META[card.category].label}</strong><small>${card.count} message${card.count === 1 ? '' : 's'}</small></span>
    </a>`).join('') : '<div class="empty-state"><div class="empty-state-title">No school signals yet</div></div>';
}

const timeline = document.getElementById('smartTimeline');
if (timeline) {
  const events = EmailStore.getTimeline();
  timeline.innerHTML = events.length ? events.map(event => `
    <a class="timeline-event" href="inbox.html?id=${event.emailId}">
      <time>${event.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</time>
      <span><strong>${event.label}</strong><small>${event.subject}</small></span>
    </a>`).join('') : '<div class="empty-state"><div class="empty-state-title">No dated events detected</div></div>';
}

const lastSync = localStorage.getItem(SIS_CONFIG.storageKeys.lastSync);
const syncStatus = document.getElementById('syncStatus');
if (syncStatus) {
  syncStatus.textContent = lastSync
    ? `Live Gmail data · synced ${new Date(lastSync).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : 'Local inbox data · connect Gmail to sync';
}

// Charts
Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-subtle').trim();
Chart.defaults.font.family = "'Inter', sans-serif";

// Weekly trend
const weeklyData = EmailStore.getWeeklyTrend();
new Chart(document.getElementById('weeklyChart'), {
  type: 'line',
  data: {
    labels: weeklyData.map(d => d.label),
    datasets: [{
      label: 'Emails',
      data: weeklyData.map(d => d.count),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.08)' } },
      x: { grid: { display: false } }
    }
  }
});

// Category breakdown (doughnut)
const catCounts = EmailStore.getCategoryCounts();
const activeCats = SIS_CONFIG.categories.filter(c => catCounts[c] > 0);
new Chart(document.getElementById('categoryChart'), {
  type: 'doughnut',
  data: {
    labels: activeCats.map(c => CATEGORY_META[c].label),
    datasets: [{
      data: activeCats.map(c => catCounts[c]),
      backgroundColor: activeCats.map(c => CATEGORY_META[c].color),
      borderWidth: 0,
      hoverOffset: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: { boxWidth: 10, padding: 8, font: { size: 10 } }
      }
    }
  }
});

// Recent emails
const recent = EmailStore.getActive().slice(0, 8);
document.getElementById('recentEmails').innerHTML = recent.map(e => {
  const [c1, c2] = avatarColor(e.sender);
  return `
    <a href="inbox.html?id=${e.id}" class="recent-email">
      <div class="recent-email-avatar" style="background:linear-gradient(135deg,${c1},${c2})">${initials(e.sender)}</div>
      <div class="recent-email-body">
        <div class="recent-email-sender">${e.sender}</div>
        <div class="recent-email-subject">${e.subject}</div>
      </div>
      <div class="recent-email-meta">
        ${!e.read ? '<span class="unread-dot"></span>' : ''}
        <span class="recent-email-date">${formatDate(e.date)}</span>
      </div>
    </a>
  `;
}).join('');

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / (1000 * 60 * 60);
  if (diff < 24) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diff < 48) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Refresh button
document.getElementById('refreshBtn').addEventListener('click', async () => {
  const button = document.getElementById('refreshBtn');
  button.disabled = true;
  try {
    await EmailStore.refresh();
    Toast.show('Inbox refreshed', 'Counts reflect the latest synchronized Gmail data.', 'success');
    window.location.reload();
  } finally {
    button.disabled = false;
  }
});

// Auto-refresh
const settings = Settings.get();
if (settings.autoRefresh) {
  setInterval(async () => {
    await EmailStore.refresh();
    window.location.reload();
  }, settings.refreshInterval);
}
