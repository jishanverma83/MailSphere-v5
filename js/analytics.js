/* ============================================================
   ProjectSIS – Analytics page logic
   ============================================================ */

initPage('analytics');
EmailStore.init();
NotificationStore.init();

Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-subtle').trim();
Chart.defaults.font.family = "'Inter', sans-serif";

// Summary stats
const stats = EmailStore.getStats();
function openInboxFilter(filter) { window.location.href = `inbox.html?filter=${encodeURIComponent(filter)}`; }
const summaryCards = [
  { label: 'Total Emails', value: stats.total, icon: 'total', color: '#3b82f6' },
  { label: 'Unread', value: stats.unread, icon: 'unread', color: '#f59e0b' },
  { label: 'High Priority', value: stats.high, icon: 'priority', color: '#ef4444' },
  { label: 'Starred', value: stats.starred, icon: 'star', color: '#eab308' },
  { label: 'With Attachments', value: stats.attachments, icon: 'attachment', color: '#10b981' }
];

document.getElementById('statGrid').innerHTML = summaryCards.map((s, i) => `
  <div class="stat-card glass animate-slideUp stagger-${i + 1}">
    <div class="stat-card-icon" style="background:${s.color}22;color:${s.color}">${Icons[s.icon]}</div>
    <div class="stat-card-value" data-counter="${s.value}">0</div>
    <div class="stat-card-label">${s.label}</div>
  </div>
`).join('');
animateCounters(document.getElementById('statGrid'));

// Pie chart - category breakdown
const catCounts = EmailStore.getCategoryCounts();
const activeCats = SIS_CONFIG.categories.filter(c => catCounts[c] > 0);
new Chart(document.getElementById('pieChart'), {
  type: 'pie',
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
    onClick: (event, elements) => { if (elements[0]) openInboxFilter(activeCats[elements[0].index]); },
    plugins: {
      legend: { position: 'right', labels: { boxWidth: 10, padding: 8, font: { size: 10 } } }
    }
  }
});

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
      backgroundColor: 'rgba(59,130,246,0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    onClick: () => openInboxFilter('week'),
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
  }
});

// Monthly trend
const monthlyData = EmailStore.getMonthlyTrend();
new Chart(document.getElementById('monthlyChart'), {
  type: 'bar',
  data: {
    labels: monthlyData.map(m => m.label),
    datasets: [{
      label: 'Emails',
      data: monthlyData.map(m => m.count),
      backgroundColor: '#06b6d4',
      borderRadius: 6,
      barThickness: 30
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    onClick: () => openInboxFilter('week'),
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
  }
});

// Read vs Unread
const readUnread = EmailStore.getReadUnread();
new Chart(document.getElementById('readChart'), {
  type: 'doughnut',
  data: {
    labels: ['Read', 'Unread'],
    datasets: [{
      data: [readUnread.read, readUnread.unread],
      backgroundColor: ['#10b981', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    onClick: (event, elements) => { if (elements[0]) openInboxFilter(elements[0].index === 0 ? 'read' : 'unread'); },
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12 } } }
  }
});

// Priority distribution
const priorityCounts = EmailStore.getPriorityCounts();
new Chart(document.getElementById('priorityChart'), {
  type: 'doughnut',
  data: {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [priorityCounts.high, priorityCounts.medium, priorityCounts.low],
      backgroundColor: ['#ef4444', '#f59e0b', '#64748b'],
      borderWidth: 0,
      hoverOffset: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    onClick: (event, elements) => { if (elements[0]) openInboxFilter(['high', 'medium', 'low'][elements[0].index]); },
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12 } } }
  }
});

// Category bar chart
new Chart(document.getElementById('barChart'), {
  type: 'bar',
  data: {
    labels: activeCats.map(c => CATEGORY_META[c].label),
    datasets: [{
      label: 'Count',
      data: activeCats.map(c => catCounts[c]),
      backgroundColor: activeCats.map(c => CATEGORY_META[c].color),
      borderRadius: 4,
      barThickness: 20
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    onClick: (event, elements) => { if (elements[0]) openInboxFilter(activeCats[elements[0].index]); },
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true }, y: { grid: { display: false } } }
  }
});
