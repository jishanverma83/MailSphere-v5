/* ============================================================
   ProjectSIS – Email store: classification, priority, search, filters
   ============================================================ */

/* ---------- Classification engine ---------- */
const Classifier = {
  categoryPatterns: {
    homework: ['homework', 'assignment', 'submission', 'project', 'worksheet', 'submission', 'homework submission', 'classwork'],
    leave: ['leave', 'absence', 'absent', 'sick leave', 'vacation', 'leave application', 'leave request', 'medical leave'],
    fees: ['fee', 'payment', 'invoice', 'tuition', 'receipt', 'pending payment', 'fee structure', 'fee reminder', 'school fee'],
    parent: ['parent', 'father', 'mother', 'guardian', 'pta', 'parent meeting', 'concern'],
    teacher: ['teacher', 'faculty', 'staff', 'lesson', 'grade', 'report card', 'class teacher', 'subject teacher'],
    circular: ['circular', 'notice', 'announcement', 'memo', 'bulletin', 'newsletter'],
    admission: ['admission', 'enrollment', 'enrol', 'new student', 'admission form', 'admission inquiry', 'open house'],
    transport: ['transport', 'bus', 'route', 'pickup', 'vehicle', 'bus route', 'transport fee'],
    exam: ['exam', 'test', 'quiz', 'marks', 'result', 'schedule', 'exam schedule', 'midterm', 'final exam'],
    event: ['event', 'festival', 'celebration', 'sports day', 'annual day', 'cultural', 'fundraiser', 'picnic'],
    complaint: ['complaint', 'issue', 'problem', 'bully', 'bullying', 'harassment', 'concern', 'grievance'],
    urgent: ['urgent', 'emergency', 'immediate', 'asap', 'critical', 'danger', 'medical emergency'],
    spam: ['win', 'lottery', 'prize', 'free', 'click here', 'unsubscribe', 'offer', 'discount', 'limited time']
  },

  classify(subject, body = '') {
    const text = (subject + ' ' + body).toLowerCase();
    let bestMatch = 'general';
    let bestScore = 0;

    for (const [cat, keywords] of Object.entries(this.categoryPatterns)) {
      let score = 0;
      for (const kw of keywords) {
        if (text.includes(kw)) score += kw.split(' ').length;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = cat;
      }
    }
    return bestMatch;
  },

  detectPriority(subject, body = '', category = '') {
    const text = (subject + ' ' + body + ' ' + category).toLowerCase();
    for (const kw of SIS_CONFIG.priorityKeywords.high) {
      if (text.includes(kw)) return 'high';
    }
    if (category === 'urgent' || category === 'complaint') return 'high';
    for (const kw of SIS_CONFIG.priorityKeywords.medium) {
      if (text.includes(kw)) return 'medium';
    }
    if (category === 'fees' || category === 'leave' || category === 'exam') return 'medium';
    return 'low';
  }
};

/* ---------- Avatar helper ---------- */
function avatarColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function avatarGradient(seed) {
  const [c1, c2] = avatarColor(seed);
  return `linear-gradient(135deg, ${c1}, ${c2})`;
}

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

/* ---------- Email store ---------- */
const EmailStore = {
  emails: [],
  initialized: false,

  init() {
    if (this.initialized) return;
    const stored = this.load();
    if (stored && stored.length > 0) {
      this.emails = stored;
    } else {
      this.emails = SampleData.generate();
      this.save();
    }
    this.initialized = true;
  },

  load() {
    try {
      let raw = localStorage.getItem(SIS_CONFIG.storageKeys.emails);
      if (!raw) raw = localStorage.getItem('sis_emails');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  save() {
    localStorage.setItem(SIS_CONFIG.storageKeys.emails, JSON.stringify(this.emails));
  },

  getAll() {
    this.init();
    return [...this.emails].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getById(id) {
    this.init();
    return this.emails.find(e => e.id === id);
  },

  getUnreadCount() {
    this.init();
    return this.emails.filter(e => !e.read && !e.archived).length;
  },

  getTodayCount() {
    this.init();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return this.emails.filter(e => !e.archived && new Date(e.date).getTime() >= startOfToday).length;
  },

  getImportantCount() {
    this.init();
    return this.emails.filter(e => !e.archived && (e.starred || e.priority === 'high' || e.category === 'urgent')).length;
  },

  getStats() {
    this.init();
    const active = this.emails.filter(e => !e.archived);
    const total = active.length;
    const unread = active.filter(e => !e.read).length;
    const read = total - unread;
    const high = active.filter(e => e.priority === 'high').length;
    const important = this.getImportantCount();
    const today = this.getTodayCount();
    const overdueAlerts = this.getOverdueAlertCount();
    const activeAlerts = this.getActiveAlertCount();
    const parents = active.filter(e => e.category === 'parent').length;
    const teachers = active.filter(e => e.category === 'teacher').length;
    const homework = active.filter(e => e.category === 'homework').length;
    const leave = active.filter(e => e.category === 'leave').length;
    const fees = active.filter(e => e.category === 'fees').length;
    const starred = active.filter(e => e.starred).length;
    const attachments = active.filter(e => e.hasAttachment).length;
    return {
      total,
      unread,
      read,
      high,
      important,
      today,
      overdueAlerts,
      activeAlerts,
      parents,
      teachers,
      homework,
      leave,
      fees,
      starred,
      attachments
    };
  },

  getCategoryCounts() {
    this.init();
    const counts = {};
    for (const cat of SIS_CONFIG.categories) counts[cat] = 0;
    this.emails.filter(e => !e.archived).forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  },

  getPriorityCounts() {
    this.init();
    const active = this.emails.filter(e => !e.archived);
    return {
      high: active.filter(e => e.priority === 'high').length,
      medium: active.filter(e => e.priority === 'medium').length,
      low: active.filter(e => e.priority === 'low').length
    };
  },

  getReadUnread() {
    this.init();
    const active = this.emails.filter(e => !e.archived);
    const unread = active.filter(e => !e.read).length;
    return {
      read: active.length - unread,
      unread
    };
  },

  getWeeklyTrend() {
    this.init();
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStart = new Date(d.setHours(0, 0, 0, 0)).getTime();
      const dayEnd = new Date(d.setHours(23, 59, 59, 999)).getTime();
      const count = this.emails.filter(e => {
        if (e.archived) return false;
        const time = new Date(e.date).getTime();
        return time >= dayStart && time <= dayEnd;
      }).length;
      days.push({
        label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(dayStart).getDay()],
        date: new Date(dayStart).toISOString(),
        count
      });
    }
    return days;
  },

  getMonthlyTrend() {
    this.init();
    const months = [];
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const targetMonth = d.getMonth();
      const targetYear = d.getFullYear();
      const count = this.emails.filter(e => {
        if (e.archived) return false;
        const ed = new Date(e.date);
        return ed.getMonth() === targetMonth && ed.getFullYear() === targetYear;
      }).length;
      months.push({ label: monthNames[targetMonth], monthIndex: targetMonth, count });
    }
    return months;
  },

  search(query) {
    this.init();
    if (!query) return this.getActive();
    const q = query.toLowerCase();
    return this.emails.filter(e =>
      !e.archived && (
        (e.sender && e.sender.toLowerCase().includes(q)) ||
        (e.senderEmail && e.senderEmail.toLowerCase().includes(q)) ||
        (e.subject && e.subject.toLowerCase().includes(q)) ||
        (e.preview && e.preview.toLowerCase().includes(q)) ||
        (e.body && e.body.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q)) ||
        (e.priority && e.priority.toLowerCase().includes(q)) ||
        (e.studentName && e.studentName.toLowerCase().includes(q)) ||
        (e.className && e.className.toLowerCase().includes(q))
      )
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  filter(filterType) {
    this.init();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = todayStart - (6 * 24 * 60 * 60 * 1000);

    const active = this.emails.filter(e => !e.archived);

    switch (filterType) {
      case 'today':
        return active.filter(e => new Date(e.date).getTime() >= todayStart);
      case 'week':
        return active.filter(e => new Date(e.date).getTime() >= weekStart);
      case 'unread':
        return active.filter(e => !e.read);
      case 'read':
        return active.filter(e => e.read);
      case 'starred':
        return active.filter(e => e.starred);
      case 'important':
        return active.filter(e => e.starred || e.priority === 'high' || e.category === 'urgent');
      case 'attachments':
        return active.filter(e => e.hasAttachment);
      case 'high':
        return active.filter(e => e.priority === 'high');
      case 'medium':
        return active.filter(e => e.priority === 'medium');
      case 'low':
        return active.filter(e => e.priority === 'low');
      default:
        if (SIS_CONFIG.categories.includes(filterType)) {
          return active.filter(e => e.category === filterType);
        }
        return active;
    }
  },

  markRead(id) {
    const e = this.emails.find(em => em.id === id);
    if (e) {
      e.read = true;
      this.save();
      window.dispatchEvent(new CustomEvent('sis:email-updated', { detail: { id, read: true } }));
    }
  },

  markUnread(id) {
    const e = this.emails.find(em => em.id === id);
    if (e) {
      e.read = false;
      this.save();
      window.dispatchEvent(new CustomEvent('sis:email-updated', { detail: { id, read: false } }));
    }
  },

  toggleStar(id) {
    const e = this.emails.find(em => em.id === id);
    if (e) {
      e.starred = !e.starred;
      this.save();
      window.dispatchEvent(new CustomEvent('sis:email-updated', { detail: { id, starred: e.starred } }));
    }
  },

  archive(id) {
    const e = this.emails.find(em => em.id === id);
    if (e) {
      e.archived = true;
      e.read = true;
      this.save();
      window.dispatchEvent(new CustomEvent('sis:email-updated', { detail: { id, archived: true } }));
    }
  },

  getActive() {
    this.init();
    return this.emails.filter(e => !e.archived).sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /* Alerts System */
  getDismissedAlertIds() {
    try {
      const raw = localStorage.getItem(SIS_CONFIG.storageKeys.dismissedAlerts);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },

  dismissAlert(id) {
    const list = this.getDismissedAlertIds();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(SIS_CONFIG.storageKeys.dismissedAlerts, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('sis:alerts-updated'));
    }
  },

  getAlerts() {
    this.init();
    const dismissed = new Set(this.getDismissedAlertIds());
    const now = new Date();
    const slaDays = SIS_CONFIG.alertSlaDays || 5;

    // Real alerts from Gmail timestamps: unread high priority or urgent or complaint emails
    const candidates = this.emails.filter(e => 
      !e.read && !e.archived && !dismissed.has(e.id) &&
      (e.priority === 'high' || e.category === 'urgent' || e.category === 'complaint')
    );

    return candidates.map(e => {
      const emailDate = new Date(e.date);
      const diffMs = Math.max(0, now.getTime() - emailDate.getTime());
      const daysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const daysRemaining = slaDays - daysElapsed;
      const isOverdue = daysElapsed >= slaDays;

      let countdownText = '';
      if (isOverdue) {
        countdownText = `Overdue (${daysElapsed}d ago)`;
      } else if (daysRemaining === 0) {
        countdownText = 'Due Today';
      } else {
        countdownText = `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`;
      }

      return {
        ...e,
        daysElapsed,
        daysRemaining,
        isOverdue,
        countdownText
      };
    }).sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return b.daysElapsed - a.daysElapsed;
    });
  },

  getOverdueAlertCount() {
    return this.getAlerts().filter(a => a.isOverdue).length;
  },

  getActiveAlertCount() {
    return this.getAlerts().length;
  },

  async refresh() {
    this.init();
    // Strictly NO fake increments!
    if (window.Gmail && typeof window.Gmail.isSignedIn === 'function' && window.Gmail.isSignedIn()) {
      try {
        await window.Gmail.onSignIn();
      } catch (err) {
        console.warn('Gmail sync on refresh error:', err);
      }
    }
    // Return empty array so caller does not append fake emails
    return [];
  },

  resetSampleData() {
    this.emails = SampleData.generate();
    this.save();
    window.dispatchEvent(new CustomEvent('sis:emails-reset'));
  },

  clearCache() {
    this.emails = [];
    this.save();
    window.dispatchEvent(new CustomEvent('sis:emails-cleared'));
  },

  async loadDemoData(url = SIS_CONFIG.demoDataUrl) {
    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Demo data request failed (${response.status}).`);
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error('Demo data is empty.');
      this.emails = data;
    } catch (error) {
      ErrorSystem.report('Demo data load failed', error);
      this.emails = SampleData.generate();
    }
    this.initialized = true;
    this.save();
    return this.emails.length;
  },

  mergeGmailEmails(gmailEmails) {
    const incomingById = new Map(gmailEmails.map(email => [email.gmailId, email]));
    let newCount = 0;
    this.emails = this.emails.map(existing => {
      const incoming = existing.gmailId ? incomingById.get(existing.gmailId) : null;
      if (!incoming) return existing;
      return { ...existing, ...incoming, read: incoming.read, starred: incoming.starred, archived: existing.archived };
    });
    const existingIds = new Set(this.emails.filter(e => e.gmailId).map(e => e.gmailId));
    const newOnes = gmailEmails.filter(e => !existingIds.has(e.gmailId));
    newCount = newOnes.length;
    this.emails = [...newOnes, ...this.emails];
    this.save();
    return newCount;
  }
};

/* ---------- Notification store (Reliable, Gmail-driven) ---------- */
const NotificationStore = {
  init() {
    // Initialized
  },

  getDismissedIds() {
    try {
      const raw = localStorage.getItem(SIS_CONFIG.storageKeys.dismissedNotifs);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },

  dismiss(id) {
    const dismissed = this.getDismissedIds();
    if (!dismissed.includes(id)) {
      dismissed.push(id);
      localStorage.setItem(SIS_CONFIG.storageKeys.dismissedNotifs, JSON.stringify(dismissed));
      window.dispatchEvent(new CustomEvent('sis:notifications-updated'));
    }
  },

  getAll() {
    const dismissed = new Set(this.getDismissedIds());
    const alerts = EmailStore.getAlerts();
    const systemNotifs = this.getSystemNotifications();

    const emailNotifs = alerts.map(a => ({
      id: 'notif-' + a.id,
      emailId: a.id,
      title: a.isOverdue ? 'Overdue School Inquiry' : 'High Priority Email',
      desc: `${a.sender}: ${a.subject}`,
      time: a.countdownText,
      icon: a.isOverdue ? 'alertCircle' : 'zap',
      color: a.isOverdue ? '#ef4444' : '#f59e0b',
      isOverdue: a.isOverdue,
      read: false
    }));

    const all = [...systemNotifs, ...emailNotifs].filter(n => !dismissed.has(n.id));
    return all;
  },

  getUnread() {
    return this.getAll().filter(notification => !notification.read);
  },

  getUnreadCount() {
    // Badges must equal real unread emails!
    return EmailStore.getUnreadCount();
  },

  getSystemNotifications() {
    try {
      const raw = localStorage.getItem(SIS_CONFIG.storageKeys.notifications);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },

  add(notif) {
    const existing = this.getSystemNotifications();
    const id = notif.id || ('sys-' + Date.now());
    if (existing.some(e => e.id === id || (e.title === notif.title && e.desc === notif.desc))) {
      return;
    }
    existing.unshift({
      id,
      time: 'Just now',
      read: false,
      ...notif
    });
    localStorage.setItem(SIS_CONFIG.storageKeys.notifications, JSON.stringify(existing.slice(0, 30)));
    window.dispatchEvent(new CustomEvent('sis:notifications-updated'));
  },

  clearAll() {
    const current = this.getAll();
    const dismissed = this.getDismissedIds();
    current.forEach(n => {
      if (!dismissed.includes(n.id)) dismissed.push(n.id);
    });
    localStorage.setItem(SIS_CONFIG.storageKeys.dismissedNotifs, JSON.stringify(dismissed));
    localStorage.removeItem(SIS_CONFIG.storageKeys.notifications);
    window.dispatchEvent(new CustomEvent('sis:notifications-updated'));
  },

  markAllRead() {
    this.clearAll();
  }
};

window.Classifier = Classifier;
window.avatarColor = avatarColor;
window.avatarGradient = avatarGradient;
window.initials = initials;
window.EmailStore = EmailStore;
window.NotificationStore = NotificationStore;
