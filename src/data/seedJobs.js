export const INITIAL_JOBS = [
  {
    id: "job-1",
    company: "Seek",
    role: "Software Engineering Graduate Program",
    category: "Software Engineering",
    programType: "Graduate Program",
    location: "Kuala Lumpur, Malaysia (Hybrid)",
    status: "applied", // applied, assessment, first_interview, second_interview, final_round, offer, accepted, declined, rejected, ghosted
    appliedDate: "2026-08-01",
    portalUrl: "https://www.seek.com.au/",
    salaryRange: "RM 4,500 - RM 6,000 / mo",
    notes: "Applied for graduate engineering cohort. Focus on modern full-stack web and backend microservices.",
    resumeVersion: "SWE_Resume_v2.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-01", note: "Application submitted via company career portal." }
    ]
  },
  {
    id: "job-2",
    company: "Capital Dynamics",
    role: "Job Application (Graduate / Associate)",
    category: "Fintech & Analytics",
    programType: "Entry Level",
    location: "Kuala Lumpur, Malaysia",
    status: "applied",
    appliedDate: "2026-08-03",
    portalUrl: "https://forms.zohopublic.com/fwahidahhiskandargm1/form/JobApplication/thankyou/formperma/nePineonpjxCalvxHByzzOoV5wEf3E4yVmRIY4sMY0c",
    salaryRange: "Competitive",
    notes: "Applied via Zoho Form link. Fund management & financial services group.",
    resumeVersion: "General_Tech_Resume.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-03", note: "Submitted application via Zoho public form." }
    ]
  },
  {
    id: "job-3",
    company: "Shopee & Monee",
    role: "Graduate Development Program (GDP) Malaysia - 2027 Intake",
    category: "Product & Engineering",
    programType: "Graduate Program",
    location: "Kuala Lumpur, Malaysia",
    status: "assessment",
    appliedDate: "2026-08-04",
    portalUrl: "https://careers.shopee.com.my/",
    salaryRange: "RM 6,000 - RM 8,500 / mo",
    notes: "Prestigious GDP track across tech and business operations.",
    resumeVersion: "SWE_Leadership_Resume.pdf",
    reminders: [
      {
        id: "rem-shopee-1",
        title: "Shopee GDP Online Assessment / Hackerrank",
        date: "2026-08-20",
        time: "14:00",
        durationMinutes: 90,
        type: "Online Assessment",
        locationOrLink: "https://hackerrank.com/test",
        notes: "Prepare DSA: Graphs, DP, and SQL optimization."
      }
    ],
    history: [
      { stage: "applied", date: "2026-08-04", note: "Applied for GDP 2027 intake." },
      { stage: "assessment", date: "2026-08-10", note: "Invited to Online Assessment round." }
    ]
  },
  {
    id: "job-4",
    company: "Accenture",
    role: "Talent Advancement Program",
    category: "Consulting & Tech",
    programType: "Graduate Program",
    location: "Kuala Lumpur, Malaysia",
    status: "first_interview",
    appliedDate: "2026-08-05",
    portalUrl: "https://www.accenture.com/my-en/careers",
    salaryRange: "RM 4,800 - RM 6,200 / mo",
    notes: "Consulting & Digital Transformation accelerated career track.",
    resumeVersion: "Consulting_Tech_Resume.pdf",
    reminders: [
      {
        id: "rem-acn-1",
        title: "Accenture 1st Round HR & Case Screen",
        date: "2026-08-22",
        time: "10:30",
        durationMinutes: 45,
        type: "1st Round Interview",
        locationOrLink: "https://teams.microsoft.com/l/meetup-join/sample",
        notes: "Prepare behavioral STAR stories and agile transformation case study."
      }
    ],
    history: [
      { stage: "applied", date: "2026-08-05", note: "Applied for Talent Advancement Program." },
      { stage: "first_interview", date: "2026-08-12", note: "Scheduled for Round 1 Interview." }
    ]
  },
  {
    id: "job-5",
    company: "Lenovo",
    role: "2026 Campus Recruitment - Data & AI Engineer",
    category: "Data & AI",
    programType: "Campus Recruitment",
    location: "Petaling Jaya / Cyberjaya, Malaysia",
    status: "applied",
    appliedDate: "2026-08-06",
    portalUrl: "https://jobs.lenovo.com/en_US/careers/JobDetail/2026-Campus-Recruitment-Data-AI-Engineer/74718",
    salaryRange: "RM 5,000 - RM 7,000 / mo",
    notes: "Job ID: 74718. Work on LLM deployment, ML pipelines, and data infrastructure.",
    resumeVersion: "Data_AI_Resume_v2.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-06", note: "Submitted application on Lenovo Career Portal." }
    ]
  },
  {
    id: "job-6",
    company: "AWS (Amazon Web Services)",
    role: "Solutions Architect, APJ Early Career Talent",
    category: "Cloud Architecture",
    programType: "Early Career",
    location: "Kuala Lumpur, Malaysia (Amazon HQ)",
    status: "first_interview",
    appliedDate: "2026-08-07",
    portalUrl: "https://account.amazon.jobs/en-US/applicant",
    salaryRange: "RM 7,000 - RM 9,500 / mo",
    notes: "Amazon Jobs Application portal. Review Amazon 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action).",
    resumeVersion: "Cloud_SWE_Resume.pdf",
    reminders: [
      {
        id: "rem-aws-1",
        title: "AWS Solutions Architect Technical Screening",
        date: "2026-08-25",
        time: "15:00",
        durationMinutes: 60,
        type: "1st Round Interview",
        locationOrLink: "https://chime.aws/meeting-code",
        notes: "Prepare system design basics (VPC, S3, RDS, Lambda) & LP stories."
      }
    ],
    history: [
      { stage: "applied", date: "2026-08-07", note: "Application submitted to Amazon Jobs." },
      { stage: "first_interview", date: "2026-08-14", note: "Passed initial resume review, phone screen booked." }
    ]
  },
  {
    id: "job-7",
    company: "TNG Digital (Touch 'n Go)",
    role: "Quality Assurance Engineer",
    category: "QA & Testing",
    programType: "Entry Level",
    location: "Bangsar South, Kuala Lumpur",
    status: "applied",
    appliedDate: "2026-08-08",
    portalUrl: "https://www.tngdigital.com.my/careers/job/978",
    salaryRange: "RM 4,200 - RM 5,500 / mo",
    notes: "Job ID: 978. Fintech e-wallet automated testing, Appium/Selenium and API tests with Postman.",
    resumeVersion: "QA_SWE_Resume.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-08", note: "Applied on TNG Digital official career site." }
    ]
  },
  {
    id: "job-8",
    company: "Bank Negara Malaysia",
    role: "Kijang Graduate Programme",
    category: "Central Banking & FinTech",
    programType: "Graduate Program",
    location: "Kuala Lumpur, Malaysia",
    status: "applied",
    appliedDate: "2026-08-09",
    portalUrl: "https://www.bnm.gov.my/careers",
    salaryRange: "RM 5,500 - RM 7,000 / mo",
    notes: "Prestigious central bank graduate program. Focus on monetary stability, financial tech regulation, and digital payment systems.",
    resumeVersion: "Academic_Grad_Resume.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-09", note: "Applied for Kijang Graduate track." }
    ]
  },
  {
    id: "job-9",
    company: "Ant International",
    role: "Site Reliability Engineer (SRE)",
    category: "SRE & Infrastructure",
    programType: "Entry Level",
    location: "Kuala Lumpur, Malaysia",
    status: "applied",
    appliedDate: "2026-08-10",
    portalUrl: "https://www.linkedin.com/jobs/view/4453524734/",
    salaryRange: "RM 6,000 - RM 8,500 / mo",
    notes: "Applied via LinkedIn (Job 4453524734). Global payment infrastructure, Kubernetes, Linux internals, microservice monitoring.",
    resumeVersion: "SRE_Cloud_Resume.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-10", note: "Application submitted via LinkedIn Jobs." }
    ]
  },
  {
    id: "job-10",
    company: "Allianz",
    role: "Executive, AI & Automation",
    category: "Data & AI",
    programType: "Entry Level",
    location: "Kuala Lumpur, Malaysia",
    status: "applied",
    appliedDate: "2026-08-11",
    portalUrl: "https://careers.allianz.com/global/en/job/104170/Executive-AI-Automation",
    salaryRange: "RM 4,500 - RM 6,000 / mo",
    notes: "Job ID: 104170. Automate insurance workflows with RPA (UiPath/PowerAutomate) and NLP/GenAI bots.",
    resumeVersion: "Data_AI_Resume_v2.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-11", note: "Applied via Allianz global career portal." }
    ]
  },
  {
    id: "job-11",
    company: "Oliver Wyman",
    role: "Entry Level Consultant",
    category: "Management Consulting",
    programType: "Graduate Program",
    location: "Kuala Lumpur, Malaysia",
    status: "applied",
    appliedDate: "2026-08-12",
    portalUrl: "https://mmc.wd1.myworkdayjobs.com/en-US/MMC/userHome?Job_Application_ID=560fc86cf8779001fc55bfe9c7bb0000",
    salaryRange: "RM 8,000 - RM 11,000 / mo",
    notes: "Marsh McLennan Workday ID: 560fc86cf8779001fc55bfe9c7bb0000. Top tier strategy consulting. Case interview prep needed.",
    resumeVersion: "Consulting_Resume_v3.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-12", note: "Submitted application via MMC Workday portal." }
    ]
  },
  {
    id: "job-12",
    company: "Western Digital (WD)",
    role: "Firmware Engineer",
    category: "Embedded & Firmware",
    programType: "Entry Level",
    location: "Petaling Jaya, Selangor, Malaysia",
    status: "applied",
    appliedDate: "2026-08-13",
    portalUrl: "https://jobs.smartrecruiters.com/WesternDigital/744000136954354-firmware-engineer?scriptId=IHLvMkybr",
    salaryRange: "RM 5,000 - RM 6,800 / mo",
    notes: "SmartRecruiters link. Embedded C/C++, SSD/HDD memory controller firmware, low-level debugging.",
    resumeVersion: "Embedded_SWE_Resume.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-13", note: "Application submitted on SmartRecruiters." }
    ]
  },
  {
    id: "job-13",
    company: "McKinsey & Company",
    role: "Consultant Analyst",
    category: "Management Consulting",
    programType: "Graduate Program",
    location: "Kuala Lumpur, Malaysia",
    status: "assessment",
    appliedDate: "2026-08-14",
    portalUrl: "https://jobs.mckinsey.com/en_US/careers/AppDiversityInterests?folderId=65221",
    salaryRange: "RM 9,000 - RM 13,000 / mo",
    notes: "Folder ID: 65221. Prepare for Solve / Imbellus game-based problem solving assessment.",
    resumeVersion: "Consulting_Resume_v3.pdf",
    reminders: [
      {
        id: "rem-mck-1",
        title: "McKinsey Solve (Imbellus) Game Assessment",
        date: "2026-08-21",
        time: "11:00",
        durationMinutes: 75,
        type: "Online Assessment",
        locationOrLink: "https://jobs.mckinsey.com/solve",
        notes: "Ecosystem building and plant protection scenarios."
      }
    ],
    history: [
      { stage: "applied", date: "2026-08-14", note: "Applied on McKinsey Career Portal." },
      { stage: "assessment", date: "2026-08-15", note: "Received Solve Game Assessment invitation." }
    ]
  },
  {
    id: "job-14",
    company: "CapBay",
    role: "Software Engineer",
    category: "Software Engineering",
    programType: "Entry Level",
    location: "Kuala Lumpur, Malaysia",
    status: "applied",
    appliedDate: "2026-08-15",
    portalUrl: "https://capbay.careers-page.com/jobs/b5b6515b-7193-42ce-8e4b-317d5ca71281/apply",
    salaryRange: "RM 4,500 - RM 6,200 / mo",
    notes: "P2P Supply chain financing platform. Full-stack TypeScript, Node.js, and React.",
    resumeVersion: "SWE_Resume_v2.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-15", note: "Application submitted via Capbay careers page." }
    ]
  }
];

export const STATUS_COLUMNS = [
  { id: "applied", label: "Applied", color: "#6366f1", bg: "rgba(99, 102, 241, 0.12)", border: "rgba(99, 102, 241, 0.3)" },
  { id: "assessment", label: "Assessment / OA", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.12)", border: "rgba(56, 189, 248, 0.3)" },
  { id: "first_interview", label: "1st Round Interview", color: "#eab308", bg: "rgba(234, 179, 8, 0.12)", border: "rgba(234, 179, 8, 0.3)" },
  { id: "second_interview", label: "2nd / Tech Interview", color: "#f97316", bg: "rgba(249, 115, 22, 0.12)", border: "rgba(249, 115, 22, 0.3)" },
  { id: "final_round", label: "Final Round", color: "#a855f7", bg: "rgba(168, 85, 247, 0.12)", border: "rgba(168, 85, 247, 0.3)" },
  { id: "offer", label: "Offer Received 🎉", color: "#22c55e", bg: "rgba(34, 197, 94, 0.12)", border: "rgba(34, 197, 94, 0.3)" },
  { id: "accepted", label: "Accepted 🚀", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.35)" },
  { id: "declined", label: "Declined / Withdrawn", color: "#94a3b8", bg: "rgba(148, 163, 184, 0.12)", border: "rgba(148, 163, 184, 0.3)" },
  { id: "rejected", label: "Rejected", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.3)" },
  { id: "ghosted", label: "No Answer (Ghosted)", color: "#f43f5e", bg: "rgba(244, 63, 94, 0.12)", border: "rgba(244, 63, 94, 0.3)" }
];

export const CATEGORIES = [
  "All Categories",
  "Software Engineering",
  "Data & AI",
  "Cloud Architecture",
  "Management Consulting",
  "Fintech & Analytics",
  "SRE & Infrastructure",
  "QA & Testing",
  "Embedded & Firmware",
  "Central Banking & FinTech",
  "Product & Engineering"
];
