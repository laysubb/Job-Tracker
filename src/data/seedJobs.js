export const initialJobs = [
  {
    id: "job-1",
    company: "Standard Chartered Bank",
    role: "International Graduate - Software Engineering & Cloud",
    category: "Software Engineering",
    programType: "Graduate Program",
    location: "Kuala Lumpur, Malaysia",
    status: "final_round",
    appliedDate: "2026-08-01",
    portalUrl: "https://scb.taleo.net/careersection/ex/jobdetail.ftl?job=24000189",
    salaryRange: "RM 6,500 - RM 8,500 / mo",
    notes: "Taleo Job ID: 24000189. Completed Pymetrics & HackerRank OA (100%). Final panel interview scheduled with Head of Technology.",
    resumeVersion: "SWE_Resume_v2.pdf",
    reminders: [
      {
        id: "rem-1",
        title: "Final Panel Interview - SCB Graduate",
        date: "2026-08-28",
        time: "10:30",
        durationMinutes: 90,
        type: "Final Round Interview",
        locationOrLink: "https://scb.zoom.us/j/9847291823",
        notes: "Prepare behavioral STAR stories on bank modernization and cloud resilience."
      }
    ],
    history: [
      { stage: "applied", date: "2026-08-01", note: "Submitted online application & resume." },
      { stage: "assessment", date: "2026-08-05", note: "Completed HackerRank 90min coding test & Pymetrics." },
      { stage: "first_interview", date: "2026-08-12", note: "Video interview with Talent Acquisition Partner." },
      { stage: "second_interview", date: "2026-08-19", note: "Technical deep-dive on microservices & Spring Boot." },
      { stage: "final_round", date: "2026-08-23", note: "Invited to final panel presentation." }
    ]
  },
  {
    id: "job-2",
    company: "Grab",
    role: "Full Stack Engineer (Transport & Deliveries)",
    category: "Software Engineering",
    programType: "Entry Level",
    location: "Petaling Jaya, Selangor",
    status: "second_interview",
    appliedDate: "2026-08-03",
    portalUrl: "https://grab.careers/jobs/view/7439999",
    salaryRange: "RM 6,000 - RM 7,800 / mo",
    notes: "Applied via Workday. Passed initial phone screen. Next up: 60-min live pair programming on Go & React state architecture.",
    resumeVersion: "SWE_FullStack_2026.pdf",
    reminders: [
      {
        id: "rem-2",
        title: "Grab Pair Programming Round",
        date: "2026-08-26",
        time: "14:00",
        durationMinutes: 60,
        type: "Technical Interview",
        locationOrLink: "https://meet.google.com/qwe-rtyu-iop",
        notes: "Review concurrency in Go, Redux toolkit, and system design patterns."
      }
    ],
    history: [
      { stage: "applied", date: "2026-08-03", note: "Applied through Grab Careers portal." },
      { stage: "first_interview", date: "2026-08-10", note: "Screening with hiring manager." },
      { stage: "second_interview", date: "2026-08-18", note: "Scheduled for live coding session." }
    ]
  },
  {
    id: "job-3",
    company: "Shopee (Sea Group)",
    role: "Software Engineer - Backend (SeaPay)",
    category: "Fintech & Analytics",
    programType: "Entry Level",
    location: "Kuala Lumpur, Malaysia",
    status: "offer",
    appliedDate: "2026-08-02",
    portalUrl: "https://careers.shopee.com.my/job-detail/74401",
    salaryRange: "RM 7,500 / mo + Stock Bonus",
    notes: "Offer received! Need to respond by August 30. High throughput payment routing team.",
    resumeVersion: "SWE_Backend_Focus.pdf",
    reminders: [
      {
        id: "rem-3",
        title: "Decision Deadline - Shopee Offer",
        date: "2026-08-30",
        time: "17:00",
        durationMinutes: 30,
        type: "Offer Deadline",
        locationOrLink: "email: hr-offers@sea.com",
        notes: "Review benefits package and compare against Standard Chartered."
      }
    ],
    history: [
      { stage: "applied", date: "2026-08-02", note: "Applied directly on Sea Careers." },
      { stage: "assessment", date: "2026-08-06", note: "Scored 100% on Online Assessment (Algorithms)." },
      { stage: "first_interview", date: "2026-08-11", note: "Round 1 Tech Interview on Data Structures & Kafka." },
      { stage: "second_interview", date: "2026-08-15", note: "Round 2 High-throughput architecture." },
      { stage: "final_round", date: "2026-08-20", note: "HR & Engineering Director Fit call." },
      { stage: "offer", date: "2026-08-22", note: "Official offer letter received via email." }
    ]
  },
  {
    id: "job-4",
    company: "Micron Technology",
    role: "Data & AI Solutions Engineer",
    category: "Data & AI",
    programType: "Graduate Program",
    location: "Batu Kawan, Penang (Hybrid)",
    status: "assessment",
    appliedDate: "2026-08-05",
    portalUrl: "https://micron.wd1.myworkdayjobs.com/career/job/JR-49102",
    salaryRange: "RM 5,200 - RM 6,800 / mo",
    notes: "Workday ID: JR-49102. Smart manufacturing yield optimization using Python, PyTorch, and SQL pipelines.",
    resumeVersion: "Data_AI_Resume_v2.pdf",
    reminders: [
      {
        id: "rem-4",
        title: "Micron AI Take-Home Test Due",
        date: "2026-08-27",
        time: "23:59",
        durationMinutes: 45,
        type: "Take Home Assignment",
        locationOrLink: "https://hackerrank.com/test/micron-ai-2026",
        notes: "Build XGBoost model for anomaly detection in semiconductor wafer data."
      }
    ],
    history: [
      { stage: "applied", date: "2026-08-05", note: "Applied on Micron Workday portal." },
      { stage: "assessment", date: "2026-08-16", note: "Received link for AI technical assessment." }
    ]
  },
  {
    id: "job-5",
    company: "Maybank",
    role: "Global Maybank Apprentice (Technology & Digital)",
    category: "Fintech & Analytics",
    programType: "Graduate Program",
    location: "Menara Maybank, Kuala Lumpur",
    status: "rejected",
    appliedDate: "2026-08-04",
    portalUrl: "https://www.maybank.com/careers/gmap",
    salaryRange: "RM 5,800 - RM 7,000 / mo",
    notes: "Role filled internally. Received friendly rejection email with feedback to reapply for Q1 cycle.",
    resumeVersion: "General_Tech_Grad.pdf",
    reminders: [],
    history: [
      { stage: "applied", date: "2026-08-04", note: "Submitted GMAP application." },
      { stage: "assessment", date: "2026-08-08", note: "Completed situational judgement test." },
      { stage: "rejected", date: "2026-08-17", note: "Not selected for assessment center." }
    ]
  },
  {
    id: "job-6",
    company: "Amazon Web Services (AWS)",
    role: "Cloud Associate Solutions Architect",
    category: "Cloud Architecture",
    programType: "Entry Level",
    location: "Kuala Lumpur, Malaysia",
    status: "first_interview",
    appliedDate: "2026-08-07",
    portalUrl: "https://amazon.jobs/en/jobs/2658190",
    salaryRange: "RM 7,000 - RM 9,500 / mo",
    notes: "Amazon Jobs ID: 2658190. Recruiter reached out on LinkedIn. Phone screen focusing on AWS 16 Leadership Principles.",
    resumeVersion: "Cloud_Arch_Resume.pdf",
    reminders: [
      {
        id: "rem-5",
        title: "AWS Recruiter Phone Screen",
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
