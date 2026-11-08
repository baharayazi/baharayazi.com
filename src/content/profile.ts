export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface ProjectItem {
  title: string;
  /** Short context line, e.g. "Team lead · UVic Data Mining · Fall 2026". */
  meta?: string;
  description: string;
  /** Optional result or detail shown under the description. */
  highlight?: string;
  stack: string[];
  /** Public source link; leave out for private or course repositories. */
  href?: string;
}

export interface SkillCategory {
  label: string;
  skills: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  details?: string[];
}

export interface HelpCommand {
  command: string;
  description: string;
}

export interface WhoamiFact {
  label: string;
  value: string;
}

export interface ProfileData {
  meta: {
    title: string;
    description: string;
    canonicalUrl: string;
    prompt: string;
    windowTitle: string;
    ogImage: string;
  };
  whoami: {
    name: string;
    line1: string;
    line2: string;
    facts: WhoamiFact[];
    hint: string;
  };
  about: {
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
  };
  experience: ExperienceItem[];
  projects: {
    header: string;
    items: ProjectItem[];
    coursework: string;
    footerText: string;
    githubUrl: string;
  };
  research: {
    header: string;
    title: string;
    period: string;
    bullets: string[];
    interests: string;
  };
  skills: SkillCategory[];
  education: EducationItem[];
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
  cv: {
    text: string;
    href: string;
  };
  ls: string[];
  help: HelpCommand[];
  aliases: string;
  notFound: (input: string) => string;
}

export const profile: ProfileData = {
  meta: {
    title: 'Bahar Ayazi — Software engineer and MASc researcher',
    description:
      'Bahar Ayazi is a software engineer and MASc student in Computer Engineering at the University of Victoria, with a background in backend systems and a growing interest in machine learning and security.',
    canonicalUrl: 'https://baharayazi.com/',
    prompt: 'bahar@baharayazi.com:~$',
    windowTitle: 'bahar@baharayazi.com',
    ogImage: '/og-image.png',
  },
  whoami: {
    name: 'Bahar Ayazi',
    line1: 'Software engineer · MASc student in Computer Engineering at the University of Victoria',
    line2:
      'Backend systems and APIs, now exploring machine learning and security in grad school.',
    facts: [
      { label: 'role', value: 'Software engineer, 3+ years in backend' },
      { label: 'study', value: 'MASc Computer Engineering · University of Victoria' },
      { label: 'exploring', value: 'Machine learning · security · systems' },
      { label: 'shipped', value: 'APIs at 1.2M+ requests/day · banking middleware · payments' },
      { label: 'speaks', value: 'English · Persian' },
    ],
    hint: 'Type help, or tap a command below.',
  },
  about: {
    paragraph1:
      'I am a software engineer with 3+ years of experience building reliable backend systems, APIs and data pipelines, now an MASc student in Computer Engineering at the University of Victoria.',
    paragraph2:
      'In industry I optimized slow APIs and databases, automated manual financial workflows, and integrated new platforms with legacy systems. In grad school I am exploring machine learning and security through research and coursework, and I care about reproducible, well-tested work.',
    paragraph3:
      'I work closely with product, business and data teams to turn requirements into practical solutions.',
  },
  experience: [
    {
      role: 'Software Engineer',
      company: 'Dotin',
      period: 'Sep 2025 – Jul 2026',
      bullets: [
        'Developed application-layer services and internal APIs for a middleware platform supporting infrastructure operations in a large-scale banking environment, integrating Kafka, Redis, Consul, ZooKeeper, ActiveMQ and Elasticsearch.',
        'Investigated the legacy architecture and refactored components into a modular structure.',
        'Worked on security-sensitive banking infrastructure involving access control, authentication, auditability and reliability.',
      ],
    },
    {
      role: 'Back-End Developer',
      company: 'ActiveCleaners',
      period: 'Nov 2024 – Sep 2025',
      bullets: [
        'Developed data-driven backend workflows for service estimation, pricing, scheduling, provider assignment and order management on a platform combining online laundry and on-site cleaning.',
        'Designed a concurrency-safe shared wallet and payment architecture connecting a new Django application with a legacy .NET application across separate databases.',
        'Reverse-engineered business rules from the legacy .NET application and reimplemented them in Python/Django while preserving data integrity.',
      ],
    },
    {
      role: 'Back-End Developer (Remote, Contract)',
      company: 'Tradido',
      period: 'Mar 2024 – Nov 2024',
      bullets: [
        'Developed backend APIs for a real-time cryptocurrency social platform with high-frequency market-data flows and performance-sensitive endpoints.',
        'Proposed and shipped a lightweight keyword-based search for an immediate product need, keeping a migration path to Elasticsearch.',
        'Contributed to migrating a monolithic application toward microservices in a high-concurrency environment.',
      ],
    },
    {
      role: 'Back-End Developer',
      company: 'SnappCarfix',
      period: 'Jan 2023 – Nov 2024',
      bullets: [
        'Developed and maintained backend services across B2B, B2C, service-center and agent-facing products handling over 1.2 million API requests per day.',
        'Brought a product-inventory API from several minutes to the millisecond range in production with caching, query optimization and targeted SQL.',
        'Designed an automated refund workflow with business-rule validation, payment-gateway integration and safeguards against duplicate refunds, cutting processing time from about one week to 24–72 hours.',
        'Built asynchronous synchronization services with Celery and mentored junior backend developers.',
      ],
    },
  ],
  projects: {
    header: 'Selected projects',
    items: [
      {
        title: 'RAFE: Reliability-Aware Fraud Evidence Fusion',
        meta: 'Team lead (4 members) · UVic Data Mining · Fall 2026',
        description:
          'A multi-agent fraud detector that splits each transaction into transaction, identity and behavioral feature sub-spaces, scores each with a lightweight agent, and fuses the scores with validation-measured reliability weights.',
        highlight:
          'On 590K IEEE-CIS transactions: matched a centralized XGBoost baseline (PR-AUC 0.521 vs 0.517) at 2.8 ms per transaction, and improved PR-AUC by 20% on the 79% of transactions that lack identity data.',
        stack: ['Python', 'scikit-learn', 'XGBoost', 'pandas', 'pytest'],
      },
      {
        title: 'Paper2Slides',
        description:
          'A multi-agent system that turns research-paper PDFs into editable PowerPoint presentations, with agents for reading, narrative planning, slide writing, figure matching and factual review. Runs on a local model through Ollama.',
        stack: ['Python', 'FastAPI', 'Ollama', 'PyMuPDF'],
        href: 'https://github.com/baharayazi/Paper2Slides',
      },
      {
        title: 'CrediChain',
        description:
          'A B2B credit and charging system with race-condition-safe wallets, atomic transactions, audit logging, and concurrency tests for parallel charges.',
        stack: ['Django', 'DRF', 'MySQL', 'pytest'],
        href: 'https://github.com/baharayazi/credichain',
      },
      {
        title: 'ZooTask',
        description:
          'A controlled REST API for working with ZooKeeper instead of giving teams direct cluster access, with thread-safe connection pooling and a modular design for adding other services.',
        stack: ['Django', 'DRF', 'Kazoo', 'ZooKeeper', 'Docker'],
        href: 'https://github.com/baharayazi/zootask',
      },
      {
        title: 'Task Manager Microservices',
        description:
          'An event-driven task system: a Django REST API publishes task events to Kafka, and a Node.js service consumes them for notifications.',
        stack: ['Django', 'PostgreSQL', 'Kafka', 'Node.js', 'Docker'],
        href: 'https://github.com/baharayazi/task-manager',
      },
    ],
    coursework:
      'Also: a blockchain from scratch with vanity addresses, proof-of-work mining and a 3-node P2P network (ECE 519C), and stateless firewall ACLs across Staff, DMZ and Outside zones (ECE 519B).',
    footerText: 'More on github.com/baharayazi.',
    githubUrl: 'https://github.com/baharayazi',
  },
  research: {
    header: 'MASc research, University of Victoria',
    title: 'Machine learning for system security',
    period: 'Fall 2026 – present',
    bullets: [
      'Exploring how machine learning can help keep real-world systems safe and reliable.',
      'Early days: more details will be shared as the work takes shape.',
    ],
    interests: 'machine learning, security, distributed systems, and whatever turns out to be interesting along the way.',
  },
  skills: [
    { label: 'Languages', skills: 'Python, SQL' },
    { label: 'Frameworks', skills: 'Django, Flask, FastAPI' },
    { label: 'ML & data', skills: 'scikit-learn, XGBoost, Pandas, NumPy' },
    {
      label: 'Messaging',
      skills: 'Kafka, Redis, ZooKeeper, Consul, ActiveMQ, Elasticsearch, Celery',
    },
    { label: 'Databases', skills: 'PostgreSQL, MySQL, MSSQL' },
    { label: 'DevOps', skills: 'Docker, Linux, Git, GitHub, GitLab CI/CD' },
    { label: 'Security', skills: 'JWT, OAuth2, OpenID Connect, LDAP, Cisco ACLs' },
    { label: 'Testing', skills: 'Pytest, performance testing, end-to-end testing' },
    { label: 'Spoken', skills: 'English (C1 / IELTS 7.0), Persian (native)' },
  ],
  education: [
    {
      degree: 'MASc, Computer Engineering',
      institution: 'University of Victoria',
      period: 'Sep 2026 – present',
      details: [
        'Co-supervised by Dr. Ardeshir Shojaeinasab and Dr. Homayoun Najjaran',
        'Coursework: Data Mining, Firewalls and Intrusion Prevention, Blockchain',
      ],
    },
    {
      degree: 'BSc, Mechanical Engineering (Biosystems)',
      institution: 'Isfahan University of Technology',
      period: '2018 – 2022',
      details: [
        'Relevant coursework: Fundamentals of Computer Engineering (A), Engineering Mathematics (A+), Numerical Methods (A)',
      ],
    },
  ],
  contact: {
    email: 'bahar@baharayazi.com',
    linkedin: 'https://www.linkedin.com/in/baharayazi',
    github: 'https://github.com/baharayazi',
  },
  cv: {
    text: 'Download my CV (PDF)',
    href: '/cv.pdf',
  },
  ls: [
    'about',
    'experience',
    'projects',
    'research',
    'skills',
    'education',
    'contact',
    'cv.pdf',
    'bahar.txt',
  ],
  help: [
    { command: 'whoami', description: 'Who I am, in one screen' },
    { command: 'about', description: 'Background and current direction' },
    { command: 'experience', description: 'Work history and key achievements' },
    { command: 'projects', description: 'Research, course and GitHub projects' },
    { command: 'research', description: 'What I am exploring in my MASc' },
    { command: 'skills', description: 'Languages, frameworks, systems and tooling' },
    { command: 'education', description: 'Degrees and coursework' },
    { command: 'contact', description: 'Email, GitHub and LinkedIn' },
    { command: 'cv', description: 'Download my CV' },
    { command: 'ls', description: 'List the sections' },
    { command: 'theme', description: 'Switch between dark and light' },
    { command: 'clear', description: 'Clear the screen' },
    { command: 'help', description: 'Show this list' },
  ],
  aliases:
    'resume → cv, work/jobs → experience, email/links/github/linkedin → contact, ?/man → help, info → whoami. cd, cat and open work too (try: cat about).',
  notFound: (input: string) => {
    const truncated = input.length > 40 ? input.slice(0, 40) + '...' : input;
    return `command not found: ${truncated}. Type help for the list.`;
  },
};
