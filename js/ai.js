/* MailSphere V6 AI tools. The endpoint must be a server-side proxy; no API key is stored here. */
const MailSphereAI = {
  endpoint: window.MAILSPHERE_RUNTIME?.geminiEndpoint || '/api/gemini',
  maxAttempts: 3,

  cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  },

  localResult(action, email, language = 'English') {
    const body = this.cleanText(email.body);
    const subject = this.cleanText(email.subject);
    const firstSentence = body.split(/(?<=[.!?])\s+/)[0] || body.slice(0, 180);
    const points = body.split(/[.!?]\s+/).filter(Boolean).slice(0, 3);
    if ((action === 'reply' || action === 'draft') && window.MailSphereTemplates) {
      return MailSphereTemplates.generateReply(email, action).text;
    }
    if (action === 'translate' && window.MailSphereTemplates) {
      return MailSphereTemplates.translate(email.body || email.subject, language);
    }
    if (action === 'reply') return `Hello ${email.sender || 'there'},\n\nThank you for your email about "${subject}". I have noted the details and will follow up shortly.\n\nBest regards`;
    if (action === 'draft') return `Hello ${email.sender || 'there'},\n\nThank you for sharing the information about "${subject}". I will review this and get back to you with the next steps.\n\nBest regards`;
    if (action === 'translate') return `The main subject of this email is "${subject}". ${firstSentence}`;
    if (action === 'explain') return `In simple language: ${firstSentence || 'This email contains school information that needs your attention.'}`;
    return `Summary: ${firstSentence}\n\nKey points:\n${points.map(point => `- ${point}`).join('\n') || '- Review the email for next steps.'}\n\nAction required: ${/action|reply|submit|pay|deadline|due/i.test(body) ? 'Yes, review the requested action and its deadline.' : 'No immediate action detected.'}`;
  },

  async generate(action, email, options = {}) {
    const prompt = `You are MailSphere, a careful school email assistant. ${action} this email without inventing facts. Preserve names, dates, amounts, and requested actions.\n\nSubject: ${email.subject}\nFrom: ${email.senderEmail || email.sender}\nBody:\n${email.body}`;
    let lastError;
    for (let attempt = 1; attempt <= this.maxAttempts; attempt += 1) {
      try {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ prompt, action, language: options.language || 'English' })
        });
        if (!response.ok) throw new Error(`AI service unavailable (${response.status}).`);
        const payload = await response.json();
        const text = payload.text || payload.output || payload.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('AI service returned an empty response.');
        return { text, source: 'ai' };
      } catch (error) {
        lastError = error;
        if (attempt < this.maxAttempts) await new Promise(resolve => setTimeout(resolve, 350 * attempt));
      }
    }
    console.warn('AI endpoint unavailable; using local fallback.', lastError);
    return { text: this.localResult(action, email, options.language), source: 'local', error: lastError };
  }
};

const AIReader = {
  email: null,
  sheet: null,
  result: null,

  escape(value) {
    return String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  },

  mount(email) {
    this.email = email;
    const reader = document.getElementById('emailReader');
    if (!reader || document.getElementById('aiReaderButton')) return;
    const button = document.createElement('button');
    button.id = 'aiReaderButton';
    button.className = 'ai-reader-button';
    button.type = 'button';
    button.title = 'Open AI email tools';
    button.innerHTML = `${Icons.sparkle}<span>AI tools</span>`;
    button.addEventListener('click', () => this.open());
    reader.appendChild(button);
  },

  open() {
    if (!this.email) return;
    if (!this.sheet) {
      this.sheet = document.createElement('div');
      this.sheet.className = 'ai-sheet-backdrop';
      this.sheet.innerHTML = `<section class="ai-sheet glass-strong" role="dialog" aria-modal="true" aria-labelledby="aiSheetTitle"><div class="ai-sheet-handle"></div><div class="ai-sheet-header"><div><div class="ai-sheet-kicker">MailSphere AI</div><h2 id="aiSheetTitle">Work with this email</h2></div><button class="btn-icon" type="button" data-ai-close aria-label="Close">${Icons.x}</button></div><div class="ai-sheet-actions">${[['reply','Quick Reply'],['summary','Summarize'],['translate','Translate'],['explain','Explain Simply'],['draft','Draft Reply']].map(([id, label]) => `<button class="ai-action" type="button" data-ai-action="${id}">${Icons.sparkle}<span>${label}</span></button>`).join('')}</div><div class="ai-result" data-ai-result hidden></div></section>`;
      document.body.appendChild(this.sheet);
      this.sheet.querySelector('[data-ai-close]').addEventListener('click', () => this.close());
      this.sheet.addEventListener('click', event => {
        if (event.target === this.sheet) this.close();
        const action = event.target.closest('[data-ai-action]')?.dataset.aiAction;
        if (action) this.run(action);
      });
    }
    this.sheet.classList.add('is-open');
  },

  close() {
    this.sheet?.classList.remove('is-open');
  },

  async run(action) {
    const result = this.sheet.querySelector('[data-ai-result]');
    result.hidden = false;
    result.innerHTML = `<div class="ai-loading"><span></span><span></span><span></span> Thinking carefully...</div>`;
    const options = action === 'translate' ? { language: 'Hindi' } : {};
    const output = await MailSphereAI.generate(action, this.email, options);
    const notice = output.source === 'local' ? '<div class="ai-local-note">AI service is unavailable, so this is an on-device draft.</div>' : '';
    result.innerHTML = `${notice}<label for="aiOutput">${action === 'reply' || action === 'draft' ? 'Edit before opening Gmail' : 'Result'}</label><textarea id="aiOutput" class="ai-output" rows="8">${this.escape(output.text)}</textarea><div class="ai-result-actions"><button class="btn btn-ghost" type="button" data-ai-copy>${Icons.clipboard} Copy</button>${action === 'reply' || action === 'draft' ? `<button class="btn btn-primary" type="button" data-ai-compose>${Icons.mail} Open Gmail compose</button>` : ''}</div>`;
    result.querySelector('[data-ai-copy]').addEventListener('click', async () => {
      await navigator.clipboard?.writeText(result.querySelector('#aiOutput').value);
      Toast.show('Copied', 'The AI result is on your clipboard.', 'success');
    });
    result.querySelector('[data-ai-compose]')?.addEventListener('click', () => {
      const body = encodeURIComponent(result.querySelector('#aiOutput').value);
      const to = encodeURIComponent(this.email.senderEmail || '');
      const subject = encodeURIComponent(`Re: ${this.email.subject || ''}`);
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`, '_blank', 'noopener');
    });
  }
};

window.MailSphereAI = MailSphereAI;
window.AIReader = AIReader;
