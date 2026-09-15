initPage('alerts');
EmailStore.init();
NotificationStore.init();

function renderAlerts() {
  const alerts = EmailStore.getAlerts();
  const list = document.getElementById('alertsList');
  if (!alerts.length) {
    list.innerHTML = `<div class="empty-state glass">${Icons.check}<div class="empty-state-title">No active alerts</div><div class="empty-state-desc">Unread high-priority messages will appear here.</div></div>`;
    return;
  }
  list.innerHTML = alerts.map(alert => `
    <article class="alert-card glass ${alert.isOverdue ? 'alert-overdue' : ''}">
      <div class="alert-card-icon">${alert.isOverdue ? Icons.alertTriangle : Icons.clock}</div>
      <div class="alert-card-content">
        <div class="alert-card-top"><span class="badge badge-${alert.priority}">${alert.priority} priority</span><span class="alert-countdown">${alert.countdownText}</span></div>
        <h2>${alert.subject}</h2><p>${alert.sender} · ${CATEGORY_META[alert.category]?.label || 'General'}</p>
        <a href="inbox.html?id=${alert.id}" class="btn btn-ghost alert-open">Read message</a>
      </div>
    </article>
  `).join('');
}
renderAlerts();
setInterval(renderAlerts, 60000);
window.addEventListener('sis:email-updated', renderAlerts);
