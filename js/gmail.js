/* ============================================================
   ProjectSIS – Gmail API integration (OAuth + fetch + display)
   ============================================================ */

const OAuthAccessRequest = {
  setupGuide: './setup-guide.html',

  isTestUserError(response) {
    const details = [
      response?.error,
      response?.error_description,
      response?.error_subtype,
      response?.message
    ].filter(Boolean).join(' ').toLowerCase();
    return response?.status === 403 || /access blocked|test user|test mode|not verified|isn't verified|isn't authorized|not authorized|unauthorized|disallowed user/.test(details);
  },

  show() {
    if (document.getElementById('oauthAccessModal')) return;

    const modal = document.createElement('div');
    modal.id = 'oauthAccessModal';
    modal.className = 'oauth-access-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'oauthAccessTitle');
    modal.innerHTML = `
      <div class="oauth-access-backdrop" data-oauth-close></div>
      <section class="oauth-access-card glass-strong">
        <button class="oauth-access-close" type="button" aria-label="Close" data-oauth-close>${Icons.x}</button>
        <div class="oauth-access-icon">${Icons.shield}</div>
        <p class="oauth-access-eyebrow">Google OAuth Test Mode</p>
        <h2 id="oauthAccessTitle">Request Gmail Access</h2>
        <p class="oauth-access-message">MailSphere is currently in Google OAuth Test Mode. Your Gmail account must be added to the approved Test Users list before you can sign in.</p>
        <div class="oauth-access-info">${Icons.info}<span>See the <a href="${this.setupGuide}">Setup Guide</a> for OAuth access instructions.</span></div>
        <div class="oauth-access-actions">
          <a class="btn btn-primary" href="${this.setupGuide}">${Icons.book} Open Setup Guide</a>
        </div>
      </section>
    `;
    document.body.appendChild(modal);

    const handleEscape = event => {
      if (event.key === 'Escape') close();
    };
    const close = () => {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    };
    modal.querySelectorAll('[data-oauth-close]').forEach(element => element.addEventListener('click', close));
    document.addEventListener('keydown', handleEscape);
  }
};

const Gmail = {
  tokenClient: null,
  gapiInited: false,
  gisInited: false,
  accessToken: sessionStorage.getItem(SIS_CONFIG.storageKeys.gmailToken) || localStorage.getItem(SIS_CONFIG.storageKeys.gmailToken) || null,
  signedIn: !!(sessionStorage.getItem(SIS_CONFIG.storageKeys.gmailToken) || localStorage.getItem(SIS_CONFIG.storageKeys.gmailToken)),
  user: null,
  isAuthenticating: false,
  isSyncing: false,

  showOAuthConfigurationError(title, description, actionLabel = 'Open Setup Guide', actionHref = './setup-guide.html') {
    Toast.show(title, description, 'error');
    const toast = document.querySelector('.toast-container .toast:last-child');
    if (!toast || toast.querySelector('[data-open-setup-guide]')) return;

    const setupLink = document.createElement('a');
    setupLink.href = actionHref;
    setupLink.textContent = actionLabel;
    setupLink.dataset.openSetupGuide = 'true';
    setupLink.className = 'btn btn-ghost';
    setupLink.style.cssText = 'display:inline-flex;margin-top:8px;padding:5px 9px;font-size:0.75rem;';
    toast.querySelector('.toast-content')?.appendChild(setupLink);
  },

  init() {
    return new Promise((resolve, reject) => {
      if (!SIS_CONFIG.googleClientId || SIS_CONFIG.googleClientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
        resolve({ configured: false });
        return;
      }

      const savedUser = sessionStorage.getItem(SIS_CONFIG.storageKeys.googleUser) || localStorage.getItem(SIS_CONFIG.storageKeys.googleUser);
      if (this.accessToken && savedUser) {
        try {
          this.user = JSON.parse(savedUser);
          Profile.applyGoogleUser(this.user);
        } catch (error) {
          console.warn('Saved Google user data is invalid:', error);
        }
      }

      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        this.gisInited = true;
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: SIS_CONFIG.googleClientId,
          scope: SIS_CONFIG.gmailScopes,
          callback: (response) => this.handleTokenResponse(response)
        });
        this.warnForUnexpectedOrigin();
        resolve({ configured: true, ready: true });
        return;
      }

      const gisScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (gisScript) {
        this.initTokenClient(resolve);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.initTokenClient(resolve);
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  },

  initTokenClient(resolve) {
    try {
      if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
        resolve({ configured: true, ready: false });
        return;
      }

      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: SIS_CONFIG.googleClientId,
        scope: SIS_CONFIG.gmailScopes,
        callback: (response) => this.handleTokenResponse(response)
      });
      this.gisInited = true;
      this.warnForUnexpectedOrigin();
      this.checkReady(resolve);
    } catch (err) {
      console.error('GIS init error:', err);
      resolve({ configured: true, ready: false });
    }
  },

  checkReady(resolve) {
    if (this.gisInited) {
      resolve({ configured: true, ready: true });
    }
  },

  warnForUnexpectedOrigin() {
    const currentOrigin = window.location.origin;
    const supportedOrigins = [
      'https://mail-sphere-v5.vercel.app',
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5174',
      'http://localhost:5174'
    ];
    if (!supportedOrigins.includes(currentOrigin)) {
      this.showOAuthConfigurationError('OAuth origin check', `Authorize ${currentOrigin} in Google Cloud before signing in.`);
    }
  },

  handleTokenResponse(response) {
    this.isAuthenticating = false;
    if (response.error) {
      ErrorSystem.report('OAuth error response', response);
      const oauthError = String(response.error).toLowerCase();
      if (oauthError === 'origin_mismatch') {
        this.showOAuthConfigurationError('Google OAuth origin is not authorized', `Add ${SIS_CONFIG.oauthOrigin} to the OAuth client's authorized JavaScript origins.`);
      } else if (oauthError === 'redirect_uri_mismatch') {
        this.showOAuthConfigurationError('Google OAuth redirect URI is not authorized', `Add ${SIS_CONFIG.oauthRedirectUri} to the OAuth client's authorized redirect URIs.`);
      } else if (oauthError === 'access_denied') {
        this.showOAuthConfigurationError('Your Gmail is not in the OAuth Testing Audience', 'Review the Setup Guide for access instructions.', 'Open Setup Guide', OAuthAccessRequest.setupGuide);
      } else if (OAuthAccessRequest.isTestUserError(response)) {
        Toast.show('Gmail access unavailable', "Your Gmail account isn't currently authorized to use MailSphere during testing.", 'warning');
        OAuthAccessRequest.show();
      } else {
        Toast.show('Sign-in cancelled or failed', ErrorSystem.friendly(response), 'error');
      }
      return;
    }

    if (!response.access_token) {
      const error = new Error('Google did not return an access token.');
      ErrorSystem.report('OAuth token missing', error);
      Toast.show('Sign-in failed', ErrorSystem.friendly(error), 'error');
      return;
    }

    this.accessToken = response.access_token;
    this.signedIn = true;
    localStorage.removeItem('signed_out');
    sessionStorage.setItem(SIS_CONFIG.storageKeys.gmailToken, this.accessToken);
    localStorage.setItem(SIS_CONFIG.storageKeys.gmailToken, this.accessToken);
    Toast.show('Signed in to Gmail', 'Successfully connected to your Gmail account', 'success');
    this.onSignIn().then(() => {
      if (document.body.classList.contains('landing-body')) {
        window.location.replace('dashboard.html');
      }
    });
  },

  signIn(prompt = '') {
    if (this.isAuthenticating) {
      Toast.show('Sign-in window already open', 'Complete the Google authentication prompt.', 'info');
      return;
    }
    if (!this.tokenClient) {
      Toast.show('Gmail not configured', 'Please set up your Google Client ID first. See the Setup Guide.', 'warning');
      return;
    }
    this.isAuthenticating = true;
    try {
      this.tokenClient.requestAccessToken({ prompt });
    } catch (err) {
      this.isAuthenticating = false;
      throw err;
    }
  },

  async signOut() {
    const token = this.accessToken;
    if (token && window.google?.accounts?.oauth2?.revoke) {
      try {
        await new Promise(resolve => window.google.accounts.oauth2.revoke(token, resolve));
      } catch (error) {
        console.warn('Revoke token failed', error);
      }
    }

    await this.clearSession();
  localStorage.setItem('signed_out', 'true');
    window.location.replace('./index.html');
  },

  async clearSession() {
    this.accessToken = null;
    this.signedIn = false;
    this.user = null;
    this.isAuthenticating = false;
    this.isSyncing = false;
    const authKeys = [
      'gmail_token', 'gmail_profile', 'gmail_user', 'gmail_email', 'gmail_session',
      'sis_session', 'access_token', 'refresh_token', 'userProfile',
      SIS_CONFIG.storageKeys.gmailToken,
      SIS_CONFIG.storageKeys.googleUser,
      SIS_CONFIG.storageKeys.profile,
      SIS_CONFIG.storageKeys.lastSync,
      'lastSync',
      'signed_out'
    ];
    authKeys.forEach(key => {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    });

    if (window.indexedDB?.databases) {
      const databases = await window.indexedDB.databases();
      await Promise.all(databases
        .filter(database => /^(auth|gmail|oauth|token|session)([-_]|$)/i.test(database.name || ''))
        .map(database => new Promise(resolve => {
          const request = window.indexedDB.deleteDatabase(database.name);
          request.onsuccess = request.onerror = request.onblocked = resolve;
        })));
    }

    window.dispatchEvent(new CustomEvent('sis:signed-out'));
  },

  isSignedIn() {
    return this.signedIn && !!this.accessToken;
  },

  async validateSession() {
    if (!this.accessToken) return false;
    try {
      const response = await fetch(SIS_CONFIG.userInfoUrl, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      if (!response.ok) {
        await this.clearSession();
        return false;
      }
      const user = await response.json();
      this.user = user;
      sessionStorage.setItem(SIS_CONFIG.storageKeys.googleUser, JSON.stringify(user));
      localStorage.setItem(SIS_CONFIG.storageKeys.googleUser, JSON.stringify(user));
      Profile.applyGoogleUser(user);
      return true;
    } catch (error) {
      ErrorSystem.report('Session validation failed', error);
      await this.clearSession();
      return false;
    }
  },

  async fetchUserProfile() {
    if (!this.accessToken) {
      throw new Error('Google access token is missing.');
    }

    const response = await fetch(SIS_CONFIG.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json'
      }
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch (error) {
      payload = await response.text();
      console.error('Google userinfo JSON parse error:', error, payload);
    }

    if (!response.ok) {
      ErrorSystem.report('Google userinfo API error', new Error('Profile request failed'), { ...response, payload });
      const error = new Error(ErrorSystem.friendly(payload?.error || payload, response.status));
      error.status = response.status;
      throw error;
    }

    const user = payload || {};
    this.user = user;
    sessionStorage.setItem(SIS_CONFIG.storageKeys.googleUser, JSON.stringify(user));
    localStorage.setItem(SIS_CONFIG.storageKeys.googleUser, JSON.stringify(user));
    Profile.applyGoogleUser(user);
    window.dispatchEvent(new CustomEvent('sis:google-user-updated', { detail: user }));
    return user;
  },

  async onSignIn() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      let user = this.user || Profile.get();
      try {
        user = await this.fetchUserProfile();
      } catch (profileError) {
        ErrorSystem.report('Profile load failed', profileError);
        Toast.show('Profile note', 'Using local profile information.', 'info');
      }

      Toast.show('Syncing Gmail', `Loading inbox messages for ${user.name || 'your account'}...`, 'info');
      const messages = await this.fetchInbox(25);
      const emailDetails = await Promise.all(messages.map(m => this.fetchMessageDetails(m.id)));
      const processed = emailDetails.filter(e => e !== null).map(e => this.processGmailMessage(e));
      const newCount = EmailStore.mergeGmailEmails(processed);
      
      const nowIso = new Date().toISOString();
      localStorage.setItem(SIS_CONFIG.storageKeys.lastSync, nowIso);

      Toast.show('Inbox synchronized', `${processed.length} Gmail emails loaded (${newCount} new)`, 'success');
      window.dispatchEvent(new CustomEvent('sis:gmail-synced', { detail: { count: newCount, total: processed.length, time: nowIso } }));
    } catch (err) {
      ErrorSystem.report('Gmail sync failed', err);
      await this.loadDemoMode(err);
    } finally {
      this.isSyncing = false;
    }
  },

  async loadDemoMode(error) {
    const loaded = await EmailStore.loadDemoData(SIS_CONFIG.demoDataUrl);
    Toast.show('Demo Mode', `${ErrorSystem.friendly(error)} Using sample inbox data.`, 'warning');
    window.dispatchEvent(new CustomEvent('sis:demo-mode', { detail: { error, loaded } }));
  },

  async requestJson(url, context) {
    if (!this.accessToken) throw new Error('Google access token is missing.');
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json'
      }
    });
    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = await response.text();
    }
    if (!response.ok) {
      const error = new Error(payload?.error?.message || `${context} failed (${response.status}).`);
      error.status = response.status;
      error.reason = payload?.error?.errors?.[0]?.reason || payload?.error || '';
      ErrorSystem.report(context, error, { ...response, payload });
      if (response.status === 401) this.clearSession();
      throw error;
    }
    return payload;
  },

  async fetchInbox(max = 25) {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${max}`;
    const payload = await this.requestJson(url, 'Gmail messages request');
    return payload && payload.messages ? payload.messages : [];
  },

  async fetchMessageDetails(messageId) {
    try {
      // Use format=full to retrieve headers, body parts, and attachments
      const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`;
      return await this.requestJson(url, `Gmail message ${messageId} request`);
    } catch (err) {
      ErrorSystem.report('Message fetch error', err);
      return null;
    }
  },

  getHeader(headers, name) {
    if (!headers || !Array.isArray(headers)) return '';
    const h = headers.find(h => h.name && h.name.toLowerCase() === name.toLowerCase());
    return h ? h.value : '';
  },

  decodeBase64Url(data) {
    if (!data) return '';
    try {
      const clean = data.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(clean);
      return decodeURIComponent(escape(decoded));
    } catch {
      try {
        return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
      } catch {
        return '';
      }
    }
  },

  getBody(payload) {
    if (!payload) return '(No preview available)';
    let plainBody = '';
    let htmlBody = '';

    const walkParts = (parts) => {
      if (!parts || !Array.isArray(parts)) return;
      for (const part of parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data && !plainBody) {
          plainBody = this.decodeBase64Url(part.body.data);
        } else if (part.mimeType === 'text/html' && part.body && part.body.data && !htmlBody) {
          htmlBody = this.decodeBase64Url(part.body.data);
        }
        if (part.parts) {
          walkParts(part.parts);
        }
      }
    };

    if (payload.body && payload.body.data) {
      plainBody = this.decodeBase64Url(payload.body.data);
    } else if (payload.parts) {
      walkParts(payload.parts);
    }

    if (plainBody && plainBody.trim().length > 0) {
      return plainBody.trim();
    }

    if (htmlBody && htmlBody.trim().length > 0) {
      const cleaned = htmlBody
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s+\n/g, '\n\n')
        .trim();
      return cleaned;
    }

    return payload.snippet || '(No body content available)';
  },

  getAttachments(payload) {
    const attachments = [];
    const walkParts = (parts) => {
      if (!parts || !Array.isArray(parts)) return;
      for (const part of parts) {
        if (part.filename && part.filename.length > 0) {
          const sizeBytes = part.body && part.body.size ? part.body.size : 0;
          const formattedSize = sizeBytes > 1048576 
            ? (sizeBytes / 1048576).toFixed(1) + ' MB'
            : (sizeBytes / 1024).toFixed(0) + ' KB';
          attachments.push({
            name: part.filename,
            size: formattedSize,
            mimeType: part.mimeType || 'application/octet-stream',
            attachmentId: part.body ? part.body.attachmentId : null
          });
        }
        if (part.parts) {
          walkParts(part.parts);
        }
      }
    };
    walkParts(payload?.parts);
    return attachments;
  },

  processGmailMessage(msg) {
    const headers = msg.payload?.headers || [];
    const sender = this.getHeader(headers, 'From') || 'Unknown Sender';
    const senderMatch = sender.match(/^(.+?)\s*<(.+?)>$/);
    const senderName = senderMatch ? senderMatch[1].replace(/"/g, '').trim() : sender;
    const senderEmail = senderMatch ? senderMatch[2] : sender;
    const subject = this.getHeader(headers, 'Subject') || '(No subject)';
    const date = msg.internalDate ? new Date(parseInt(msg.internalDate, 10)).toISOString() : new Date().toISOString();
    const body = this.getBody(msg.payload);
    const attachments = this.getAttachments(msg.payload);
    const category = Classifier.classify(subject, body);
    const priority = Classifier.detectPriority(subject, body, category);

    return {
      id: 'gmail-' + msg.id,
      gmailId: msg.id,
      sender: senderName,
      senderEmail,
      subject,
      preview: body.slice(0, 140).replace(/\n/g, ' ').trim(),
      body,
      category,
      priority,
      date,
      read: !msg.labelIds || !msg.labelIds.includes('UNREAD'),
      starred: !!(msg.labelIds && (msg.labelIds.includes('STARRED') || msg.labelIds.includes('IMPORTANT'))),
      hasAttachment: attachments.length > 0,
      attachments,
      studentName: '',
      className: '',
      archived: false
    };
  },

  openInGmail(messageId) {
    const gmailId = (() => {
      const e = EmailStore.getById(messageId);
      return e && e.gmailId ? e.gmailId : '';
    })();
    if (gmailId) {
      window.open(`https://mail.google.com/mail/u/0/#inbox/${gmailId}`, '_blank');
    } else {
      Toast.show('Demo Email', 'This is a sample school email. Connect your Gmail account to open directly in Gmail.', 'info');
    }
  }
};

window.Gmail = Gmail;
