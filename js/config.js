/* ============================================================
   MailSphere S – App configuration
   by Jishan Verma
   ============================================================ */

const origin = window.location.origin;

const SIS_CONFIG = {
  appName: 'MailSphere S',
  appTagline: 'by Jishan Verma',
  appVersion: '6.1 (Production)',

  // Google OAuth config
  googleClientId: '486905889991-hft0oso75u10d8bf3t73alj8cmptq830.apps.googleusercontent.com',
  oauthOrigin: origin,
  oauthRedirectUri: `${origin}/auth/callback`,
  gmailScopes: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
  gmailMessagesUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=25',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
  demoDataUrl: '/data/sampleEmails.json',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],

  // Auto refresh interval (ms)
  defaultRefreshInterval: 60000,

  // Alert SLA threshold in days (emails older than this escalate)
  alertSlaDays: 5,

  // Sample data count
  sampleEmailCount: 100,

  // Categories
  categories: [
    'homework', 'leave', 'fees', 'parent', 'teacher', 'circular',
    'admission', 'transport', 'exam', 'event', 'complaint',
    'urgent', 'general', 'spam'
  ],

  // Priority keywords
  priorityKeywords: {
    high: ['urgent', 'principal', 'emergency', 'deadline', 'asap', 'immediately', 'critical', 'important', 'action required', 'immediate attention'],
    medium: ['meeting', 'fee', 'leave', 'schedule', 'reminder', 'request', 'application', 'review', 'notice']
  },

  // LocalStorage keys
  storageKeys: {
    settings: 'mailsphere_settings',
    emails: 'mailsphere_emails',
    starred: 'mailsphere_starred',
    readState: 'mailsphere_read_state',
    archived: 'mailsphere_archived',
    profile: 'mailsphere_profile',
    notifications: 'mailsphere_notifications',
    dismissedNotifs: 'mailsphere_dismissed_notifs',
    dismissedAlerts: 'mailsphere_dismissed_alerts',
    gmailToken: 'sis_gmail_access_token', // preserved for auth compatibility
    googleUser: 'sis_google_user',         // preserved for auth compatibility
    lastSync: 'mailsphere_last_sync',
    sidebarCollapsed: 'mailsphere_sidebar_collapsed'
  }
};

// Category metadata
const CATEGORY_META = {
  homework: { label: 'Homework', color: '#8b5cf6', icon: 'bookOpen' },
  leave: { label: 'Leave', color: '#f59e0b', icon: 'leave' },
  fees: { label: 'Fees', color: '#10b981', icon: 'fees' },
  parent: { label: 'Parent', color: '#3b82f6', icon: 'parents' },
  teacher: { label: 'Teacher', color: '#06b6d4', icon: 'teachers' },
  circular: { label: 'Circular', color: '#6366f1', icon: 'fileText' },
  admission: { label: 'Admission', color: '#ec4899', icon: 'userPlus' },
  transport: { label: 'Transport', color: '#14b8a6', icon: 'truck' },
  exam: { label: 'Exam', color: '#f43f5e', icon: 'clipboard' },
  event: { label: 'Event', color: '#a855f7', icon: 'event' },
  complaint: { label: 'Complaint', color: '#ef4444', icon: 'alertCircle' },
  urgent: { label: 'Emergency', color: '#dc2626', icon: 'zap' },
  general: { label: 'General', color: '#64748b', icon: 'mail' },
  spam: { label: 'Spam', color: '#94a3b8', icon: 'ban' }
};

// Avatar color palette
const AVATAR_COLORS = [
  ['#2563eb', '#06b6d4'],
  ['#8b5cf6', '#ec4899'],
  ['#10b981', '#14b8a6'],
  ['#f59e0b', '#ef4444'],
  ['#6366f1', '#a855f7'],
  ['#0ea5e9', '#3b82f6'],
  ['#f43f5e', '#f97316'],
  ['#14b8a6', '#22c55e']
];

window.SIS_CONFIG = SIS_CONFIG;
window.CATEGORY_META = CATEGORY_META;
window.AVATAR_COLORS = AVATAR_COLORS;
