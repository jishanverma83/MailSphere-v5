/* ============================================================
   ProjectSIS – Inbox page logic
   ============================================================ */

initPage('inbox');
EmailStore.init();
NotificationStore.init();

let currentFilter = 'all';
let currentSearch = '';
let selectedEmailId = null;

const inboxLayout = document.querySelector('.inbox-layout');
const divider = document.getElementById('inboxDivider');
let dragging = false;
divider?.addEventListener('pointerdown', event => {
  dragging = true;
  divider.setPointerCapture(event.pointerId);
  document.body.classList.add('is-resizing');
});
divider?.addEventListener('pointermove', event => {
  if (!dragging || !inboxLayout) return;
  const bounds = inboxLayout.getBoundingClientRect();
  const width = Math.min(Math.max(event.clientX - bounds.left, 280), bounds.width - 360);
  inboxLayout.style.gridTemplateColumns = `${width}px 8px minmax(360px, 1fr)`;
});
divider?.addEventListener('pointerup', () => {
  dragging = false;
  document.body.classList.remove('is-resizing');
});

// Set icons
document.getElementById('gmailIcon').innerHTML = Icons.google;
document.getElementById('emptyIcon').innerHTML = Icons.inboxEmpty;

window.addEventListener('sis:demo-mode', () => {
  const badge = document.getElementById('modeBadge');
  if (badge) badge.hidden = false;
});

// Gmail sync button
document.getElementById('gmailSyncBtn').addEventListener('click', async () => {
  try {
    const result = await Gmail.init();

    if (!result || result.configured === false) {
      Toast.show('Gmail not configured', 'Add your Google Client ID to connect Gmail. Opening Setup Guide...', 'warning');
      setTimeout(() => {
        window.location.href = 'setup-guide.html';
      }, 1500);
      return;
    }

    if (result.ready) {
      if (Gmail.isSignedIn()) {
        await Gmail.onSignIn();
        renderEmailList();
      } else {
        Gmail.signIn();
      }
    }
  } catch (err) {
    Toast.show('Sync failed', err.message || 'Could not connect to Gmail', 'error');
  }
});

// Filters
const filters = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
  { id: 'attachments', label: 'Attachments' },
  { id: 'important', label: 'Important' },
  { id: 'high', label: 'High Priority' },
  { id: 'parent', label: 'Parent' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'homework', label: 'Homework' },
  { id: 'fees', label: 'Fees' },
  { id: 'circular', label: 'Circular' },
  { id: 'leave', label: 'Leave' },
  { id: 'urgent', label: 'Emergency' },
  { id: 'transport', label: 'Transport' }
];

document.getElementById('inboxFilters').innerHTML = filters.map(f => `
  <button class="filter-chip ${f.id === 'all' ? 'active' : ''}" data-filter="${f.id}">${f.label}</button>
`).join('');

document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentFilter = chip.dataset.filter;
    renderEmailList();
  });
});

// Global search listener
window.addEventListener('sis:search', (e) => {
  currentSearch = e.detail;
  renderEmailList();
});

// Render email list
function renderEmailList() {
  let emails;
  if (currentSearch) {
    emails = EmailStore.search(currentSearch);
  } else if (currentFilter === 'all') {
    emails = EmailStore.getActive();
  } else {
    emails = EmailStore.filter(currentFilter).filter(e => !e.archived);
  }

  document.getElementById('inboxCount').textContent = `${emails.length} emails`;

  if (emails.length === 0) {
    document.getElementById('emailList').innerHTML = `
      <div class="empty-state">
        ${Icons.inboxEmpty}
        <div class="empty-state-title">No emails found</div>
        <div class="empty-state-desc">Try adjusting your filters or search query</div>
      </div>
    `;
    return;
  }

  document.getElementById('emailList').innerHTML = emails.map(e => {
    const [c1, c2] = avatarColor(e.sender);
    const meta = CATEGORY_META[e.category];
    return `
      <div class="email-item ${e.read ? '' : 'unread'} ${e.id === selectedEmailId ? 'active' : ''}" data-id="${e.id}">
        <div class="email-item-avatar" style="background:linear-gradient(135deg,${c1},${c2})">${initials(e.sender)}</div>
        <div class="email-item-body">
          <div class="email-item-top">
            <span class="email-item-sender">${e.sender}</span>
            <span class="email-item-date">${formatDate(e.date)}</span>
          </div>
          <div class="email-item-subject">${e.subject}</div>
          <div class="email-item-preview">${e.preview}</div>
          <div class="email-item-meta">
            <span class="cat-pill" style="background:${meta.color}22;color:${meta.color}">${meta.label}</span>
            <span class="badge badge-${e.priority}">${e.priority}</span>
            ${e.starred ? `<span class="email-item-star">${Icons.star}</span>` : ''}
            ${e.hasAttachment ? `<span class="email-item-attachment">${Icons.attachment}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.email-item').forEach(item => {
    item.addEventListener('click', () => openEmail(item.dataset.id));
    item.addEventListener('dblclick', () => { openEmail(item.dataset.id); toggleReaderFullscreen(); });
  });
}

// Open email in reader
function openEmail(id) {
  const email = EmailStore.getById(id);
  if (!email) return;
  selectedEmailId = id;
  EmailStore.markRead(id);
  renderEmailList();

  const [c1, c2] = avatarColor(email.sender);
  const meta = CATEGORY_META[email.category];
  const date = new Date(email.date);

  document.getElementById('readerEmpty').classList.add('hidden');
  const content = document.getElementById('readerContent');
  content.classList.remove('hidden');
  content.innerHTML = `
    <div class="email-reader-toolbar">
      <button class="btn-icon" onclick="markUnread('${id}')" title="Mark Unread">${Icons.mail}</button>
      <button class="btn-icon" onclick="markRead('${id}')" title="Mark Read">${Icons.mailOpen}</button>
      <button class="btn-icon" onclick="toggleStar('${id}')" id="starBtn" title="Star">${email.starred ? Icons.star : Icons.starOutline}</button>
      <button class="btn-icon" onclick="archiveEmail('${id}')" title="Archive">${Icons.archive}</button>
      <button class="btn-icon reader-maximize" onclick="toggleReaderFullscreen()" title="Full screen">${Icons.maximize}</button>
      <button class="btn btn-ghost" style="padding:6px 12px;font-size:0.75rem" onclick="openInGmail('${id}')">
        ${Icons.external} Open in Gmail
      </button>
    </div>
    <div class="email-reader-header">
      <div style="display:flex;gap:var(--space-6);margin-bottom:var(--space-8)">
        <span class="cat-pill" style="background:${meta.color}22;color:${meta.color}">${meta.label}</span>
        <span class="badge badge-${email.priority}">${email.priority} priority</span>
      </div>
      <div class="email-reader-subject">${email.subject}</div>
      <div class="email-reader-sender">
        <div class="email-reader-sender-avatar" style="background:linear-gradient(135deg,${c1},${c2})">${initials(email.sender)}</div>
        <div class="email-reader-sender-info">
          <div class="email-reader-sender-name">${email.sender}</div>
          <div class="email-reader-sender-email">${email.senderEmail}</div>
        </div>
        <div class="email-reader-date">${date.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</div>
      </div>
    </div>
    <div class="email-reader-body">${email.body}</div>
    ${email.hasAttachment && email.attachments.length > 0 ? `
      <div class="email-reader-attachments">
        <div style="font-size:0.8rem;font-weight:600;margin-bottom:var(--space-8)">Attachments</div>
        ${email.attachments.map(a => `
          <div class="attachment-chip" onclick="Toast.show('Download','${a.name} (${a.size})','info')">
            ${Icons.attachment} ${a.name} (${a.size})
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
  document.getElementById('emailReader').classList.add('reader-has-email');
}

window.toggleReaderFullscreen = function() {
  document.getElementById('emailReader')?.classList.toggle('reader-fullscreen');
};
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') document.getElementById('emailReader')?.classList.remove('reader-fullscreen');
});

// Actions
window.markRead = function(id) {
  EmailStore.markRead(id);
  Toast.show('Marked as read', '', 'success');
  renderEmailList();
};

window.markUnread = function(id) {
  EmailStore.markUnread(id);
  Toast.show('Marked as unread', '', 'info');
  renderEmailList();
};

window.toggleStar = function(id) {
  EmailStore.toggleStar(id);
  const email = EmailStore.getById(id);
  const starBtn = document.getElementById('starBtn');
  if (starBtn) starBtn.innerHTML = email.starred ? Icons.star : Icons.starOutline;
  Toast.show(email.starred ? 'Starred' : 'Unstarred', '', 'info');
  renderEmailList();
};

window.archiveEmail = function(id) {
  EmailStore.archive(id);
  Toast.show('Archived', 'Email moved to archive', 'success');
  selectedEmailId = null;
  document.getElementById('readerContent').classList.add('hidden');
  document.getElementById('readerEmpty').classList.remove('hidden');
  renderEmailList();
};

window.openInGmail = function(id) {
  Gmail.openInGmail(id);
};

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / (1000 * 60 * 60);
  if (diff < 24) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diff < 48) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Check for email ID in URL
const params = new URLSearchParams(window.location.search);
const emailId = params.get('id');
const requestedFilter = params.get('filter');
if (requestedFilter && filters.some(filter => filter.id === requestedFilter)) {
  currentFilter = requestedFilter;
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.toggle('active', chip.dataset.filter === requestedFilter));
}
if (emailId) {
  openEmail(emailId);
}

renderEmailList();
