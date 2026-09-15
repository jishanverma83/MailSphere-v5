/* ============================================================
   ProjectSIS – Sample data generator (100 realistic school emails)
   ============================================================ */

const SampleData = {
  senders: {
    parents: [
      'Mrs. Jennifer Johnson', 'Mr. Robert Smith', 'Mrs. Emily Davis', 'Mr. Michael Brown',
      'Mrs. Sarah Wilson', 'Dr. James Martinez', 'Mrs. Linda Anderson', 'Mr. Charles Thomas',
      'Mrs. Patricia Jackson', 'Mr. Daniel White', 'Mrs. Barbara Harris', 'Mr. Richard Lewis',
      'Mrs. Susan Walker', 'Mr. Joseph Hall', 'Mrs. Nancy Allen', 'Mr. Kevin Young',
      'Mrs. Betty King', 'Mr. George Wright', 'Mrs. Sandra Lopez', 'Mr. Ronald Hill'
    ],
    teachers: [
      'Ms. Rebecca Taylor', 'Mr. David Moore', 'Mrs. Maria Garcia', 'Mr. Thomas Lee',
      'Ms. Jennifer Clark', 'Mr. Anthony Rodriguez', 'Mrs. Sandra Lewis', 'Mr. Mark Robinson',
      'Ms. Donna Walker', 'Mr. Steven Perez', 'Mrs. Karen Hall', 'Mr. Paul Young',
      'Ms. Elizabeth Allen', 'Mr. Donald Sanchez', 'Mrs. Carol Wright', 'Mr. Stephen King'
    ],
    staff: [
      'Principal Office', 'Admin Office', 'Accounts Department', 'Transport Office',
      'Library', 'Health Center', 'Cafeteria', 'Sports Department'
    ],
    students: [
      'Emma Johnson', 'Liam Smith', 'Olivia Davis', 'Noah Brown', 'Ava Wilson',
      'Lucas Martinez', 'Sophia Anderson', 'Mason Thomas', 'Isabella Jackson', 'Ethan White'
    ],
    spam: [
      'Lottery Winner', 'Free Offers', 'Discount Deals', 'Prize Notification'
    ]
  },

  subjectTemplates: {
    homework: [
      'Homework submission for {subject} - {class}',
      'Math assignment completed by {student}',
      'Science project submission - {class}',
      'English essay homework - {student}',
      'Worksheet completion update - {class}',
      'Classwork submission - {subject}'
    ],
    leave: [
      'Leave application for {student} - {class}',
      'Medical leave request for 3 days',
      'Sick leave application - {student}',
      'Vacation leave request for {student}',
      'Leave of absence - {class} - {student}',
      'Emergency leave request'
    ],
    fees: [
      'Term 2 fee payment reminder',
      'Fee structure for academic year 2024-25',
      'Pending fee payment - {student}',
      'Fee receipt for {student}',
      'Tuition payment confirmation',
      'Transport fee reminder - {student}'
    ],
    parent: [
      'Parent-Teacher meeting request',
      'Concern regarding {student} progress',
      'PTA meeting scheduled for next week',
      'Parent inquiry about admission',
      'Discussion about {student} behavior',
      'Request for meeting with class teacher'
    ],
    teacher: [
      'Grade report for {class} - {subject}',
      'Lesson plan submission for review',
      'Report card feedback - {student}',
      'Subject teacher feedback required',
      'Faculty meeting reminder',
      'Class teacher update - {class}'
    ],
    circular: [
      'School circular: Annual day celebration',
      'Important notice for all parents',
      'School announcement: Holiday schedule',
      'Memo regarding school timing change',
      'Bulletin: New library resources',
      'Newsletter - September edition'
    ],
    admission: [
      'Admission inquiry for Grade 5',
      'New student enrollment - {student}',
      'Admission form submission',
      'Open house event invitation',
      'Admission process inquiry'
    ],
    transport: [
      'Bus route change notification',
      'Transport fee pending - {student}',
      'Bus pickup time update for Route 7',
      'Vehicle breakdown notice - Route 3',
      'Transport request for {student}'
    ],
    exam: [
      'Exam schedule for Midterm 2024',
      'Test results - {class} - {subject}',
      'Quiz notification for {class}',
      'Final exam timetable released',
      'Marks update for {student}'
    ],
    event: [
      'Sports Day event - Registration open',
      'Annual day celebration invitation',
      'Cultural festival announcement',
      'Fundraiser event next Friday',
      'School picnic - Permission required'
    ],
    complaint: [
      'Complaint regarding bus delay',
      'Issue with cafeteria food quality',
      'Bullying concern - {student}',
      'Grievance about teacher behavior',
      'Problem with classroom facilities'
    ],
    urgent: [
      'URGENT: Emergency staff meeting called by Principal',
      'EMERGENCY: Medical situation in {class}',
      'URGENT: Deadline for fee submission today',
      'CRITICAL: Safety concern reported',
      'URGENT: Immediate parent meeting required'
    ],
    spam: [
      'Congratulations! You have won a prize',
      'Limited time offer - 50% discount',
      'Click here to claim your reward',
      'Free gift with subscription'
    ],
    general: [
      'General inquiry about school hours',
      'Thank you note from {student} family',
      'Update on school renovation',
      'Question about uniform policy',
      'Feedback on recent parent meeting'
    ]
  },

  classes: ['Grade 5-A', 'Grade 5-B', 'Grade 6-A', 'Grade 6-B', 'Grade 7-A', 'Grade 7-B', 'Grade 8-A', 'Grade 8-B', 'Grade 9-A', 'Grade 10-A'],
  subjects: ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education'],

  bodies: {
    homework: [
      'Dear {teacher},\n\nPlease find attached the homework submission for {subject}. The assignment has been completed by {student} from {class}.\n\nThe worksheet covers chapters 5-7 and all problems have been solved. Kindly review and provide feedback.\n\nBest regards,\n{parent}',
      'Hello,\n\nThis is to inform you that {student} has completed the {subject} project. The submission includes all required components as per the guidelines provided.\n\nPlease let us know if any additional information is needed.\n\nThank you,\n{parent}'
    ],
    leave: [
      'Respected Principal,\n\nI am writing to request a leave of absence for {student} from {class} for 3 days due to medical reasons. {student} has been advised rest by the doctor.\n\nKindly grant the leave and arrange for any missed assignments.\n\nSincerely,\n{parent}',
      'Dear Class Teacher,\n\nThis is to inform you that {student} will be absent from school for 2 days due to a family emergency. Please excuse the absence and share any homework that needs to be completed.\n\nThank you for understanding.\n\nRegards,\n{parent}'
    ],
    fees: [
      'Dear Parent,\n\nThis is a reminder that the Term 2 fee payment for {student} is now due. The total amount is $1,250 including tuition and transport.\n\nPlease complete the payment at your earliest convenience to avoid late charges.\n\nRegards,\nAccounts Department',
      'Dear Parent,\n\nWe acknowledge receipt of your fee payment for {student}. The transaction has been processed successfully. Please find the receipt attached.\n\nThank you,\nAccounts Department'
    ],
    parent: [
      'Respected Teacher,\n\nI would like to schedule a parent-teacher meeting to discuss {student}\'s recent academic performance in {class}. I am available on Tuesday or Thursday after 3 PM.\n\nPlease let me know a suitable time.\n\nBest regards,\n{parent}',
      'Dear Principal,\n\nI am writing to express my concern regarding the recent changes in the homework policy for {class}. I believe {student} is finding it difficult to cope with the increased workload.\n\nCould we discuss this matter at your convenience?\n\nSincerely,\n{parent}'
    ],
    teacher: [
      'Dear Principal,\n\nPlease find attached the grade report for {class} - {subject} for the current term. Overall, the class has shown improvement with an average of 78%.\n\n{student} has particularly excelled, scoring 95% in the latest assessment.\n\nRegards,\n{teacher}',
      'Respected Coordinator,\n\nI have submitted the lesson plans for the upcoming week. The focus will be on interactive learning and group projects for {class}.\n\nPlease review and provide your feedback.\n\nBest,\n{teacher}'
    ],
    circular: [
      'Dear Parents and Staff,\n\nWe are pleased to announce that the Annual Day Celebration will be held on September 25th at 5 PM in the school auditorium. All students from Grade 5 to Grade 10 are expected to participate.\n\nPlease confirm your child\'s attendance by September 20th.\n\nPrincipal Office',
      'Important Notice:\n\nPlease be informed that school timings will change effective October 1st. The new timings will be 8:00 AM to 3:30 PM for all grades.\n\nTransport routes will be adjusted accordingly.\n\nAdmin Office'
    ],
    admission: [
      'Dear Admissions Team,\n\nI would like to inquire about the admission process for Grade 5 for my child. Could you please share the admission form and fee structure?\n\nWe are also interested in attending the open house event.\n\nThank you,\n{parent}'
    ],
    transport: [
      'Dear Parents,\n\nPlease note that Bus Route 7 will have a new pickup time of 7:15 AM starting Monday. The change is due to road construction on the main highway.\n\nPlease adjust your schedules accordingly.\n\nTransport Office',
      'Dear Parent,\n\nThis is to inform you that the transport fee for {student} is pending for this term. The amount due is $180.\n\nPlease clear the dues at your earliest convenience.\n\nTransport Office'
    ],
    exam: [
      'Dear Students and Parents,\n\nThe midterm examination schedule for 2024 has been released. Exams will commence from October 10th. The detailed timetable is attached.\n\nPlease ensure regular attendance and preparation.\n\nExamination Department',
      'Dear Parent,\n\n{student} has scored 88% in the recent {subject} test for {class}. The detailed marks breakdown is attached for your reference.\n\nRegards,\n{teacher}'
    ],
    event: [
      'Dear Parents,\n\nWe are excited to announce the Annual Sports Day on October 15th. Registration is now open for various track and field events.\n\nPlease encourage your child to participate and submit the consent form by October 8th.\n\nSports Department',
      'Dear Parents and Staff,\n\nYou are cordially invited to the Cultural Festival on September 30th. The event will feature performances by students from all grades.\n\nWe look forward to your presence.\n\nPrincipal Office'
    ],
    complaint: [
      'Respected Principal,\n\nI am writing to bring to your attention that the school bus for Route 3 has been consistently late for the past week. My child {student} has been reaching home 30 minutes late.\n\nKindly look into this matter urgently.\n\nSincerely,\n{parent}',
      'Dear Principal,\n\nI would like to file a complaint regarding the quality of food in the cafeteria. {student} has reported that the food served yesterday was stale.\n\nI request you to investigate this matter.\n\nRegards,\n{parent}'
    ],
    urgent: [
      'URGENT NOTICE TO ALL STAFF,\n\nAn emergency staff meeting has been called by the Principal for today at 4 PM in the conference room. All teachers and department heads must attend without fail.\n\nThis is regarding a critical safety matter that requires immediate discussion.\n\nPrincipal Office',
      'URGENT: Dear Parent,\n\nThis is to inform you that there has been a medical situation in {class}. {student} has been taken to the health center. Please contact the school office immediately.\n\nPrincipal Office'
    ],
    spam: [
      'Congratulations! You have been selected as the winner of our annual lottery. Click here to claim your prize of $10,000. This offer is valid for 24 hours only.\n\nDo not miss this opportunity!',
      'Limited time offer! Get 50% discount on all school supplies. Click the link below to avail this exclusive deal. Offer ends soon!'
    ],
    general: [
      'Dear School Office,\n\nI would like to know the school timings for the upcoming academic year. Also, is there a change in the uniform policy?\n\nThank you,\n{parent}',
      'Dear Principal,\n\nThank you for organizing the recent parent meeting. It was very informative and we appreciate the efforts of the school in keeping parents updated.\n\nBest regards,\n{parent}'
    ]
  },

  attachments: [
    [{ name: 'homework.pdf', size: '245 KB' }],
    [{ name: 'leave_letter.pdf', size: '120 KB' }],
    [{ name: 'fee_receipt.pdf', size: '89 KB' }],
    [{ name: 'grade_report.xlsx', size: '156 KB' }],
    [{ name: 'circular.pdf', size: '340 KB' }],
    [{ name: 'exam_schedule.pdf', size: '210 KB' }],
    [{ name: 'event_consent.pdf', size: '78 KB' }],
    [{ name: 'admission_form.pdf', size: '450 KB' }],
    [],
    [],
    []
  ],

  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  pickSome(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  },

  fillTemplate(template, ctx) {
    return template
      .replace(/{student}/g, ctx.student)
      .replace(/{class}/g, ctx.className)
      .replace(/{subject}/g, ctx.subject)
      .replace(/{parent}/g, ctx.parent)
      .replace(/{teacher}/g, ctx.teacher);
  },

  generateEmail(index) {
    // Distribute categories across 100 emails
    const categoryDistribution = [
      ...Array(15).fill('homework'),
      ...Array(12).fill('parent'),
      ...Array(10).fill('teacher'),
      ...Array(8).fill('fees'),
      ...Array(8).fill('leave'),
      ...Array(7).fill('circular'),
      ...Array(6).fill('exam'),
      ...Array(5).fill('event'),
      ...Array(5).fill('complaint'),
      ...Array(5).fill('admission'),
      ...Array(4).fill('transport'),
      ...Array(5).fill('urgent'),
      ...Array(5).fill('general'),
      ...Array(5).fill('spam')
    ];

    const category = categoryDistribution[index % categoryDistribution.length];
    const student = this.pick(this.senders.students);
    const className = this.pick(this.classes);
    const subject = this.pick(this.subjects);
    const parent = this.pick(this.senders.parents);
    const teacher = this.pick(this.senders.teachers);
    const ctx = { student, className, subject, parent, teacher };

    let sender, senderEmail;
    if (category === 'parent' || category === 'complaint' || category === 'leave' || category === 'admission' || category === 'general') {
      sender = parent;
      senderEmail = parent.toLowerCase().replace(/[^a-z]/g, '.') + '@gmail.com';
    } else if (category === 'teacher' || category === 'homework' || category === 'exam') {
      sender = teacher;
      senderEmail = teacher.toLowerCase().replace(/[^a-z]/g, '.') + '@school.edu';
    } else if (category === 'spam') {
      sender = this.pick(this.senders.spam);
      senderEmail = 'noreply@' + sender.toLowerCase().replace(/[^a-z]/g, '') + '.com';
    } else {
      sender = this.pick(this.senders.staff);
      senderEmail = sender.toLowerCase().replace(/[^a-z]/g, '.') + '@school.edu';
    }

    const subjectTemplate = this.pick(this.subjectTemplates[category] || this.subjectTemplates.general);
    const emailSubject = this.fillTemplate(subjectTemplate, ctx);
    const bodyTemplate = this.pick(this.bodies[category] || this.bodies.general);
    const body = this.fillTemplate(bodyTemplate, ctx);
    const attachments = this.pick(this.attachments);
    const hasAttachment = attachments.length > 0;

    // Generate date within last 30 days
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);

    const priority = Classifier.detectPriority(emailSubject, body, category);
    const read = Math.random() > 0.4;
    const starred = Math.random() > 0.85;

    return {
      id: 'email-' + (index + 1),
      gmailId: null,
      sender,
      senderEmail,
      subject: emailSubject,
      preview: body.slice(0, 120).replace(/\n/g, ' '),
      body,
      category,
      priority,
      date: date.toISOString(),
      read,
      starred,
      hasAttachment,
      attachments,
      studentName: student,
      className,
      archived: false
    };
  },

  generate(count = SIS_CONFIG.sampleEmailCount, random = false) {
    const emails = [];
    const n = random ? count : SIS_CONFIG.sampleEmailCount;
    for (let i = 0; i < n; i++) {
      emails.push(this.generateEmail(i));
    }
    return emails;
  }
};
