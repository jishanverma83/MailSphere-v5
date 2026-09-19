/* MailSphere V6.2 local school reply template engine. */
const MailSphereTemplates = (() => {
  const templates = {
    homework: [
      'Thank you. I have submitted the homework successfully.',
      'The homework has been completed and submitted.',
      'Homework has been uploaded as requested.',
      "I have completed today's homework.",
      'The assignment has been submitted before the deadline.',
      'Thank you for the reminder. It has been submitted.',
      'Homework is attached for your review.',
      'The work has been completed carefully.'
    ],
    assignment: [
      'Thank you. I have received the assignment.', "Assignment received. I'll start working on it.",
      'Thank you for sharing the assignment.', 'I have noted the instructions.',
      'The assignment has been received successfully.', "I'll complete it before the deadline."
    ],
    leave: [
      'Kindly grant me leave for today.', 'I request leave due to illness.', 'Please approve my leave request.',
      "I won't be able to attend school today.", "I request one day's leave.", 'Thank you for considering my leave request.',
      'I will resume classes tomorrow.', 'Please excuse my absence.'
    ],
    leaveApproval: ['Thank you for approving my leave.', 'I appreciate your approval.', 'Thank you for your understanding.', "I'll return on the mentioned date.", 'Thank you for your support.', 'Grateful for your approval.'],
    fees: ['The fee will be paid before the deadline.', 'Thank you for the reminder.', 'Payment will be completed soon.', 'The fee has been noted.', "We'll ensure timely payment.", 'Thank you for informing us.', 'Payment will be made today.', 'We appreciate the reminder.'],
    feeConfirmation: ['The fee has been paid successfully.', 'Payment has been completed.', 'Kindly confirm receipt.', 'Thank you.', 'Please acknowledge the payment.', 'Payment is complete.'],
    ptm: ["We'll attend the PTM.", 'Thank you for the invitation.', "We'll be present.", 'Looking forward to meeting.', "We'll attend at the scheduled time.", 'Thank you for informing us.'],
    exam: ["Thank you. I've noted the schedule.", "I'll prepare accordingly.", 'Schedule received.', 'Thank you for sharing.', "I'll be present.", 'Preparation has started.'],
    circular: ["Thank you. I've read the circular.", 'Information received.', 'Noted with thanks.', 'Thank you for sharing.', 'I understand the instructions.', "We'll follow the guidelines."],
    holiday: ['Thank you for informing us.', 'Holiday noted.', "We'll follow the schedule.", 'Thanks for the update.', 'Information received.', 'Noted.'],
    transport: ['Thank you for the update.', "I'll follow the revised timing.", 'Transport information received.', 'Thanks for informing.', "I'll reach accordingly.", 'Noted.'],
    emergency: ['Thank you for informing us immediately.', 'We have received the message.', "We'll follow the instructions.", 'Information acknowledged.', "We'll stay updated.", 'Thank you for the quick update.'],
    event: ["I'd like to participate.", 'Thank you for the opportunity.', 'Please consider my participation.', 'Looking forward to the event.', "I'll attend.", 'Thank you.'],
    competition: ['Please register my participation.', "I'm interested in joining.", 'Thank you for organizing.', 'Kindly confirm registration.', "I'll participate.", 'Looking forward.'],
    certificate: ['Kindly provide the certificate.', 'Thank you for your assistance.', 'Please share the certificate.', 'I appreciate your help.', 'Thank you.'],
    document: ['The document has been submitted.', 'Kindly confirm receipt.', 'Thank you.', 'Submission completed successfully.', 'Please let me know if anything else is required.']
  };

  const categoryKeywords = [
    ['homework', ['homework', 'assignment', 'submit', 'submission', 'worksheet']],
    ['leave', ['leave', 'absent', 'absence', 'illness', 'sick']],
    ['fees', ['fee', 'fees', 'payment', 'paid', 'due', 'tuition', 'reminder']],
    ['ptm', ['ptm', 'parent teacher', 'parent-teacher', 'parent meeting']],
    ['exam', ['exam', 'test', 'quiz', 'marks', 'schedule']],
    ['circular', ['circular', 'notice', 'announcement', 'guidelines']],
    ['holiday', ['holiday', 'vacation', 'school closed']],
    ['transport', ['bus', 'transport', 'route', 'pickup', 'pick-up']],
    ['emergency', ['urgent', 'emergency', 'immediately', 'critical']],
    ['event', ['event', 'function', 'festival', 'participate']],
    ['competition', ['competition', 'contest', 'register']],
    ['certificate', ['certificate']],
    ['document', ['document', 'form', 'attachment']]
  ];
  const categoryLabels = {
    homework: 'homework', assignment: 'assignment', leave: 'leave request', leaveApproval: 'leave approval',
    fees: 'fee payment', feeConfirmation: 'fee payment', ptm: 'parent-teacher meeting', exam: 'exam schedule',
    circular: 'circular', holiday: 'holiday schedule', transport: 'transport update', emergency: 'urgent notice',
    event: 'event', competition: 'competition registration', certificate: 'certificate request', document: 'document submission'
  };
  const blockSeeds = {
    greetings: [
      'Thank you for reaching out about {event}.', 'Thank you for the update about {event}.',
      'I appreciate you sharing the details about {event}.', 'We have received your message about {event}.',
      'I have read your message regarding {event}.', 'Thank you for keeping us informed about {event}.',
      'Your message about {event} is noted.', 'I am writing in response to your message about {event}.'
    ],
    acknowledgements: [
      'I have noted the information carefully.', 'We understand the instructions and will follow them.',
      'The details are clear and have been recorded.', 'I have taken note of the request.',
      'We appreciate the clear instructions.', 'I understand what needs to be done.',
      'The information has been received and noted.', 'I have reviewed the details.'
    ],
    closings: [
      'Please let me know if anything else is required.', 'We will keep you updated.',
      'I will get back to you if I need any clarification.', 'Thank you for your guidance.',
      'I appreciate your support.', 'We will make sure this is handled promptly.',
      'Please feel free to share any further instructions.', 'Looking forward to your confirmation.'
    ]
  };
  const categoryActions = {
    homework: ['I have completed and submitted the homework.', 'I will submit the homework as requested.', 'The homework has been uploaded for review.', 'I will make sure the homework is completed carefully.', 'The completed work is attached for your review.', 'I have submitted the assignment before the deadline.', 'I will complete the work and share it shortly.', 'The homework submission is taken care of.'],
    assignment: ['I have received the assignment and noted the instructions.', 'I will start working on the assignment shortly.', 'I will complete the assignment before the deadline.', 'The assignment details are clear and noted.', 'I will review the requirements and proceed accordingly.', 'I have recorded the submission instructions.', 'I will share the completed assignment once it is ready.', 'The assignment has been received successfully.'],
    leave: ['Kindly grant me leave for the requested day.', 'I will not be able to attend school due to illness.', 'Please approve my leave request.', 'I request one day of leave and will resume classes afterward.', 'Please excuse my absence on the mentioned date.', 'I will share any required supporting information.', 'I have informed you about my absence in advance.', 'I will return to school as soon as I am well.'],
    leaveApproval: ['Thank you for approving my leave request.', 'I appreciate your understanding and approval.', 'I will return on the date mentioned.', 'Thank you for supporting my leave request.', 'I have noted the approved leave dates.', 'I am grateful for your consideration.', 'I will resume classes as scheduled.', 'Thank you for confirming the approval.'],
    fees: ['We will ensure that the fee is paid on time.', 'The payment will be completed before the deadline.', 'I have noted the fee reminder and payment details.', 'We will arrange the payment shortly.', 'The fee payment is being handled.', 'I will make the payment as requested.', 'We have recorded the payment deadline.', 'I will share the confirmation after payment.'],
    feeConfirmation: ['The fee has been paid successfully.', 'Payment has been completed.', 'Kindly confirm receipt of the payment.', 'Please acknowledge the payment once received.', 'The payment is complete and the receipt can be shared.', 'We have completed the fee payment.', 'I am sharing the payment confirmation for your records.', 'The fee payment has been taken care of.'],
    ptm: ['We will attend the PTM at the scheduled time.', 'We look forward to meeting you at the parent-teacher meeting.', 'I confirm our attendance for the PTM.', 'We will be present for the meeting.', 'Thank you for inviting us to the PTM.', 'I have noted the meeting schedule and will attend.', 'We would be happy to attend and discuss the student’s progress.', 'Please confirm if any additional information is needed before the meeting.'],
    exam: ['I have noted the exam schedule and will prepare accordingly.', 'The schedule has been received and recorded.', 'I will be present for the examination.', 'Preparation will begin according to the shared schedule.', 'Thank you for sharing the examination details.', 'I have noted the date and time carefully.', 'We will follow the examination instructions.', 'I will make the necessary preparations in advance.'],
    circular: ['I have read the circular and noted the instructions.', 'We will follow the guidelines in the circular.', 'The circular has been received and understood.', 'I have shared the information with the relevant family members.', 'We will act according to the notice.', 'The instructions are clear and noted.', 'I will make sure the required steps are followed.', 'The circular has been acknowledged.'],
    holiday: ['The holiday schedule has been noted.', 'We will follow the revised school schedule.', 'Thank you for sharing the holiday information.', 'I have recorded the vacation dates.', 'The school closure notice is understood.', 'We will plan accordingly around the holiday.', 'The update has been shared with the family.', 'I have noted when classes will resume.'],
    transport: ['I have noted the revised transport timing.', 'We will follow the updated bus route information.', 'The transport update has been received.', 'I will adjust the pickup arrangement accordingly.', 'Thank you for informing us about the bus schedule.', 'We will be ready at the revised time.', 'The route and timing have been recorded.', 'I will reach the pickup point according to the update.'],
    emergency: ['We have received the urgent message and will follow the instructions immediately.', 'I have noted the emergency information and will act promptly.', 'We are following the directions provided in the notice.', 'The message has been acknowledged and shared with the concerned people.', 'We will stay updated and respond as required.', 'I understand the urgency and will take the necessary action.', 'The emergency instructions are being followed carefully.', 'We have received the update and are proceeding accordingly.'],
    event: ['I would like to participate in the event.', 'Thank you for the opportunity to take part.', 'Please consider my participation for the event.', 'I look forward to attending the event.', 'I confirm that I will attend.', 'The event details are noted and appreciated.', 'I would be glad to participate in the programme.', 'Please let me know if registration details are required.'],
    competition: ['Please register my participation in the competition.', 'I am interested in joining the competition.', 'Thank you for organizing this opportunity.', 'Kindly confirm my registration.', 'I will participate in the competition.', 'I look forward to taking part.', 'Please share any preparation instructions.', 'I would be happy to represent the school.'],
    certificate: ['Kindly provide the requested certificate.', 'Please share the certificate when convenient.', 'I would appreciate your assistance with the certificate request.', 'Please let me know when the certificate is ready.', 'I am following up on the certificate request.', 'Kindly confirm the required documents for the certificate.', 'Thank you for helping with this request.', 'I would be grateful if the certificate could be issued soon.'],
    document: ['The requested document has been submitted.', 'I have completed the document submission.', 'Kindly confirm receipt of the document.', 'The form has been shared for your review.', 'Please let me know if another document is required.', 'I have attached the requested information.', 'The submission has been completed successfully.', 'I will provide any missing details promptly.']
  };
  const blockCatalog = Object.keys(templates).reduce((catalog, category) => {
    catalog[category] = {
      greeting: blockSeeds.greetings,
      acknowledgement: blockSeeds.acknowledgements,
      action: categoryActions[category] || categoryActions.circular,
      closing: blockSeeds.closings
    };
    return catalog;
  }, {});
  let lastChoice = {};
  const cache = new Map();
  const recentReplies = [];

  function textOf(email) { return `${email?.subject || ''} ${email?.body || ''}`.toLowerCase(); }
  function detectCategory(email) {
    const text = textOf(email);
    if (/science exhibition|registration|event|function|festival|programme|program/i.test(text)) return /competition|contest|register/i.test(text) && !/science exhibition/i.test(text) ? 'competition' : 'event';
    if (/competition|contest/i.test(text)) return 'competition';
    let best = 'circular';
    let score = 0;
    categoryKeywords.forEach(([category, words]) => {
      const current = words.reduce((total, word) => total + (text.includes(word) ? word.includes(' ') ? 2 : 1 : 0), 0);
      if (current > score) { score = current; best = category; }
    });
    if (/(paid|payment complete|fee has been paid)/i.test(text)) return 'feeConfirmation';
    if (/(approved|approval|approve.*leave)/i.test(text) && text.includes('leave')) return 'leaveApproval';
    if (score === 0) return 'circular';
    return best;
  }
  function detectTone(email) {
    const role = detectRole(email);
    if (role === 'Principal') return 'formal';
    if (role === 'Teacher' || role === 'Office') return 'professional';
    if (role === 'Parent') return 'respectful';
    if (role === 'Student') return 'friendly';
    return 'professional';
  }
  function detectRole(email) {
    const sender = `${email?.sender || ''} ${email?.senderEmail || ''}`.toLowerCase();
    if (/principal|headmaster|headmistress/.test(sender)) return 'Principal';
    if (/teacher|faculty|professor|class teacher/.test(sender)) return 'Teacher';
    if (/parent|guardian|father|mother/.test(sender)) return 'Parent';
    if (/student|pupil|learner/.test(sender)) return 'Student';
    if (/office|admin|school|accounts|admission|transport/.test(sender)) return 'Office';
    return 'Office';
  }
  function detectLanguage(text) {
    const value = String(text || '');
    if (/[ -]/.test(value) && /[ -]/.test(value.replace(/[\s\d\p{P}]/gu, ''))) {
      if (/(\b(?:hai|hain|kab|kal|bhar|dena|kar|diya|ke|liye|aap|please)\b)/i.test(value)) return 'Hinglish';
      return 'English';
    }
    return /[\u0900-\u097f]/.test(value) ? 'Hindi' : 'English';
  }
  function firstMatch(text, pattern) { const match = text.match(pattern); return match ? match[0] : ''; }
  function details(email) {
    const text = `${email?.subject || ''} ${email?.body || ''}`;
    const sender = email?.sender || email?.senderEmail || 'there';
    const name = sender.replace(/<.*?>/g, '').trim() || 'there';
    const subject = email?.subject || 'your message';
    const detectedCategory = detectCategory(email);
    const deadline = firstMatch(text, /\b(?:before|by|due(?:\s+on)?|last date(?: is)?|deadline(?: is)?)\s+((?:\d{1,2}(?:st|nd|rd|th)?[\s-]+)?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+\d{1,2}(?:st|nd|rd|th)?)?|\d{1,2}(?:st|nd|rd|th)?\s+\w+|\d{1,2}[/-]\d{1,2})/i);
    const eventText = subject.replace(/^(re|fwd|fw)\s*[:\-]\s*/i, '').trim();
    return {
      name, sender, subject, senderRole: detectRole(email), category: detectedCategory,
      date: firstMatch(text, /\b(?:\d{1,2}(?:st|nd|rd|th)?[\s-]+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))\b/i),
      deadline: deadline.replace(/^(before|by|due(?:\s+on)?|last date(?: is)?|deadline(?: is)?)\s+/i, '').trim(),
      time: firstMatch(text, /\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b/i),
      amount: firstMatch(text, /(?:₹|Rs\.?|INR)\s*[\d,]+(?:\.\d{1,2})?|\b\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?\b/i).trim(),
      className: firstMatch(text, /\b(?:class|grade)\s*[-:]?\s*[A-Za-z0-9-]+/i).replace(/^(class|grade)\s*[-:]?\s*/i, ''),
      event: eventText || categoryLabels[detectedCategory] || 'the event',
      urgency: /urgent|emergency|immediately|asap|critical|today|right away/i.test(text) ? 'high' : 'normal',
      language: detectLanguage(text)
    };
  }
  function fill(template, values) {
    return template.replace(/\{(name|sender|deadline|date|time|amount|class|subject|event)\}/gi, (_, key) => values[key] || '').replace(/\s{2,}/g, ' ').trim();
  }
  function personalize(reply, values, category, sourceText) {
    let output = reply;
    if (category === 'fees' && (values.amount || values.deadline || values.date)) {
      if (values.amount && !output.includes(values.amount)) output = `${output.replace(/[.]$/, '')} The ${values.amount} fee will be handled${values.deadline || values.date ? ` before ${values.deadline || values.date}` : ''}.`;
      else if (values.deadline && !output.includes(values.deadline)) output = `${output.replace(/[.]$/, '')} We have noted the deadline of ${values.deadline}.`;
    }
    if (values.amount && category === 'fees' && output.includes('the fee')) output = output.replace(/the fee/i, `${values.amount} fee`);
    if (values.deadline && /deadline|before the deadline/i.test(output) && !output.includes(values.deadline)) output = output.replace(/before the deadline/i, `before ${values.deadline}`);
    if (values.time && /scheduled time|timing/i.test(output) && !output.includes(values.time)) output = `${output.replace(/[.]$/, '')} at ${values.time}.`;
    if (values.className && /class|grade/i.test(sourceText) && !output.includes(values.className)) output = `${output.replace(/[.]$/, '')} for Class ${values.className}.`;
    return output;
  }
  function choose(list, key) {
    const options = list && list.length ? list : blockSeeds.acknowledgements;
    let index = Math.floor(Math.random() * options.length);
    if (options.length > 1 && index === lastChoice[key]) index = (index + 1) % options.length;
    lastChoice[key] = index;
    return options[index];
  }
  function relationshipGreeting(context) {
    if (context.senderRole === 'Principal') return 'Respected Principal Sir/Madam,';
    if (context.senderRole === 'Teacher') return 'Dear Ma’am,';
    if (context.senderRole === 'Office') return 'Dear School Office,';
    if (context.senderRole === 'Parent') return 'Dear Parent,';
    return '';
  }
  function conversationText(email) {
    return [email?.threadMessages, email?.previousReplies, email?.threadHistory, email?.body]
      .flatMap(value => Array.isArray(value) ? value : [value]).filter(Boolean).join(' ').toLowerCase();
  }
  function isAcknowledgementOnly(context, email) {
    const messages = Array.isArray(email?.threadMessages) ? email.threadMessages : [];
    const latest = String(messages.length ? messages[messages.length - 1] : email?.body || '').toLowerCase();
    return /\b(thank you|thanks|received|noted)\b/.test(latest) && !/\b(submit|pay|attend|request|please|deadline|due|register|provide)\b/.test(latest) && context.urgency === 'normal';
  }
  function ensureContext(reply, context) {
    let output = reply.trim();
    if (!output.toLowerCase().includes(context.event.toLowerCase())) {
      output += ` This is regarding ${context.event}.`;
    }
    if (context.deadline && !output.toLowerCase().includes(context.deadline.toLowerCase())) {
      output += ` We have noted the deadline of ${context.deadline}.`;
    }
    if (context.amount && !output.includes(context.amount)) {
      output += ` The amount involved is ${context.amount}.`;
    }
    return output.replace(/\s{2,}/g, ' ').trim();
  }
  function naturalReply(email, context, mode) {
    if (isAcknowledgementOnly(context, email)) {
      const address = context.senderRole === 'Teacher' ? ' Ma’am' : context.senderRole === 'Principal' ? ' Sir/Madam' : '';
      return `You're welcome${address}. I'm happy to help with ${context.event}.`;
    }
    const blocks = blockCatalog[context.category] || blockCatalog.circular;
    const greeting = relationshipGreeting(context);
    const opening = choose(blocks.greeting, `${context.category}:greeting`);
    const acknowledgement = choose(blocks.acknowledgement, `${context.category}:acknowledgement`);
    const action = choose(blocks.action, `${context.category}:action`);
    const closing = choose(blocks.closing, `${context.category}:closing`);
    const assembled = `${greeting ? `${greeting}\n\n` : ''}${fill(opening, context)} ${fill(acknowledgement, context)} ${fill(action, context)} ${fill(closing, context)}`;
    let result = personalize(assembled, context, context.category, conversationText(email));
    result = ensureContext(result, context);
    if (mode === 'draft' && !greeting) result = `Hello ${context.name},\n\n${result}`;
    const words = result.split(/\s+/);
    return words.length > 120 ? `${words.slice(0, 118).join(' ')}...` : result;
  }
  function generateReply(email, mode = 'reply') {
    const context = details(email);
    const key = `${mode}:${context.category}:${context.subject}:${context.amount}:${context.deadline}`;
    cache.set(key, context);
    let result = naturalReply(email, context, mode);
    let attempts = 0;
    while (recentReplies[recentReplies.length - 1] === result && attempts < 3) {
      result = naturalReply(email, context, mode);
      attempts += 1;
    }
    recentReplies.push(result);
    if (recentReplies.length > 8) recentReplies.shift();
    return { text: result, context, category: context.category, tone: detectTone(email), source: 'template' };
  }

  const hindiRules = [
    [/\bkal\s+fee\s+bhar\s+dena\b/gi, 'कृपया कल फीस जमा कर दें'],
    [/\bhomework\s+submit\s+kar\s+diya\b/gi, 'होमवर्क जमा कर दिया गया है'],
    [/\bbus\s+late\s+hai\b/gi, 'बस देर से आ रही है'],
    [/\bptm\s+kab\s+hai\b/gi, 'PTM कब है'],
    [/\bhomework\b/gi, 'होमवर्क'], [/\bassignment\b/gi, 'असाइनमेंट'], [/\bfee[s]?\b/gi, 'फीस'],
    [/\bsubmit\b/gi, 'जमा करें'], [/\bpayment\b/gi, 'भुगतान'], [/\bteacher\b/gi, 'शिक्षक'],
    [/\bstudent[s]?\b/gi, 'छात्र'], [/\bholiday\b/gi, 'छुट्टी'], [/\btomorrow\b/gi, 'कल'],
    [/\btoday\b/gi, 'आज'], [/\bplease\b/gi, 'कृपया'], [/\bthank you\b/gi, 'धन्यवाद']
  ];
  const englishRules = [
    [/कृपया\s+कल\s+फीस\s+जमा\s+कर\s+दें/gi, 'Please submit the fee tomorrow'],
    [/होमवर्क\s+जमा\s+कर\s+दिया\s+गया\s+है/gi, 'The homework has been submitted'],
    [/बस\s+देर\s+से\s+आ\s+रही\s+है/gi, 'The bus is running late'],
    [/PTM\s+कब\s+है/gi, 'When is the PTM'], [/होमवर्क/gi, 'homework'], [/फीस/gi, 'fee'],
    [/जमा\s+करें/gi, 'submit'], [/भुगतान/gi, 'payment'], [/शिक्षक/gi, 'teacher'],
    [/छात्र/gi, 'student'], [/छुट्टी/gi, 'holiday'], [/कल/gi, 'tomorrow'],
    [/आज/gi, 'today'], [/कृपया/gi, 'please'], [/धन्यवाद/gi, 'thank you']
  ];
  function translate(text, target = 'Hindi') {
    let output = String(text || '');
    if (target.toLowerCase() === 'english') {
      englishRules.forEach(([pattern, replacement]) => { output = output.replace(pattern, replacement); });
      return output;
    }
    if (target.toLowerCase() !== 'hindi') return output;
    hindiRules.forEach(([pattern, replacement]) => { output = output.replace(pattern, replacement); });
    if (/\b(students are hereby instructed|students are informed)\b/i.test(output)) output = output.replace(/students are hereby instructed/ig, 'सभी छात्रों को यह जानकारी दी जाती है कि');
    return output;
  }
  return { templates, detectCategory, detectTone, generateReply, translate };
})();
window.MailSphereTemplates = MailSphereTemplates;
