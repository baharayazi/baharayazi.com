export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
}

export interface SkillCategory {
  label: string;
  skills: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export interface HelpCommand {
  command: string;
  description: string;
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
    footerText: string;
    githubUrl: string;
  };
  research: {
    header: string;
    topic: string;
    interests: string;
    note: string;
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
  sudo: string;
  notFound: (input: string) => string;
}

export const profile: ProfileData = {
  meta: {
    title: 'Bahar Ayazi — Software engineer and MASc researcher',
    description:
      'Terminal portfolio of Bahar Ayazi, software engineer and MASc ECE researcher at the University of Victoria. Specializing in backend systems, machine learning, AI, and cybersecurity.',
    canonicalUrl: 'https://baharayazi.com/',
    prompt: 'bahar@baharayazi.com:~$',
    windowTitle: 'bahar@baharayazi.com',
    ogImage: '/og-image.png',
  },
  whoami: {
    name: 'Bahar Ayazi',
    line1: 'Software engineer · MASc ECE student at the University of Victoria',
    line2: 'Backend and distributed systems, moving toward machine learning, AI and security.',
    hint: 'Type help, or tap a command below.',
  },
  about: {
    paragraph1:
      'I am a software engineer turned graduate researcher. Before starting my MASc at the University of Victoria, I built backend platforms across banking infrastructure, e-commerce and a crypto social app.',
    paragraph2:
      'Today I am moving toward machine learning and security. My research looks at anomaly detection in cybersecurity, and I enjoy turning messy real-world systems into ones that are fast, safe and easy to reason about.',
    paragraph3:
      'I am looking for internships and collaborations in ML, AI and security.',
  },
  experience: [
    {
      role: 'Software Engineer',
      company: 'Dotin',
      period: 'Sep 2025 – Jul 2026',
      bullets: [
        'Refactored a legacy internal platform into a modular architecture.',
        'Built middleware services and internal APIs managing Kafka, Redis, Consul, Zookeeper, ActiveMQ and Elasticsearch.',
        'Worked on security-sensitive banking infrastructure: access control, authentication and auditability.',
      ],
    },
    {
      role: 'Back-End Developer',
      company: 'ActiveCleaners',
      period: 'Nov 2024 – Sep 2025',
      bullets: [
        'Built the backend for a new online laundry and on-site cleaning platform.',
        'Designed a concurrency-safe wallet and payment architecture linking a new Django app with a legacy .NET app, so customers keep a single wallet across separate databases.',
        'Reverse-engineered legacy .NET business rules into Python and Django.',
      ],
    },
    {
      role: 'Back-End Developer',
      company: 'Tradido',
      period: 'Mar 2024 – Nov 2024',
      bullets: [
        'Built APIs for a real-time cryptocurrency social platform, including market data ingestion and engagement features.',
        'Implemented keyword search, with a path to Elasticsearch.',
        'Contributed to a monolith-to-microservices migration.',
      ],
    },
    {
      role: 'Back-End Developer',
      company: 'SnappCarfix',
      period: 'Jan 2023 – Nov 2024',
      bullets: [
        'Worked on B2B, B2C, service-center and agent products handling 1.2M+ API requests per day.',
        'Cut a product-inventory API from minutes to milliseconds.',
        'Automated the refund workflow, reducing processing time from about a week to 24–72 hours.',
        'Built Celery sync services and mentored junior backend developers.',
      ],
    },
  ],
  projects: {
    header: 'Selected work',
    items: [
      {
        title: 'One wallet across two systems',
        description:
          'A concurrency-safe wallet and payment layer linking a Django app with a legacy .NET app (ActiveCleaners).',
      },
      {
        title: 'Inventory API, minutes to milliseconds',
        description:
          'Reworked a product-inventory API serving B2B and B2C products (SnappCarfix).',
      },
      {
        title: 'Automated refunds',
        description:
          'Replaced a manual refund process so it completes in 24–72 hours instead of about a week (SnappCarfix).',
      },
    ],
    footerText: 'More on github.com/baharayazi.',
    githubUrl: 'https://github.com/baharayazi',
  },
  research: {
    header: 'MASc research, University of Victoria',
    topic: 'Anomaly detection in cybersecurity.',
    interests: 'machine learning, AI, cybersecurity and distributed systems.',
    note: 'Papers and project write-ups will be added here.',
  },
  skills: [
    { label: 'Languages', skills: 'Python, SQL' },
    { label: 'Frameworks', skills: 'Django, Flask, FastAPI, Pandas, NumPy' },
    { label: 'Messaging', skills: 'Kafka, Redis, Zookeeper, Consul, ActiveMQ, Celery' },
    { label: 'Search', skills: 'Elasticsearch' },
    { label: 'Databases', skills: 'PostgreSQL, MySQL, MSSQL' },
    { label: 'DevOps', skills: 'Docker, Linux, Git, GitLab CI/CD' },
    { label: 'Auth', skills: 'JWT, OAuth2, OIDC, LDAP' },
    { label: 'Testing', skills: 'Pytest, performance and end-to-end testing' },
    { label: 'Spoken', skills: 'English (C1), Persian (native)' },
  ],
  education: [
    {
      degree: 'MASc, Electrical and Computer Engineering',
      institution: 'University of Victoria',
      period: '2026 – present',
    },
    {
      degree: 'BSc, Mechanical Engineering (Biosystems)',
      institution: 'Isfahan University of Technology',
      period: '2018 – 2022',
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
  ],
  help: [
    { command: 'whoami', description: 'Display identity and concise summary' },
    { command: 'about', description: 'Background, research focus, and current direction' },
    { command: 'experience', description: 'Work history and key achievements' },
    { command: 'projects', description: 'Selected engineering and architectural work' },
    { command: 'research', description: 'Graduate research and research interests' },
    { command: 'skills', description: 'Languages, frameworks, systems, and tooling' },
    { command: 'education', description: 'Academic degrees and institutions' },
    { command: 'contact', description: 'Email, GitHub, and LinkedIn links' },
    { command: 'cv', description: 'Download or view my curriculum vitae' },
    { command: 'ls', description: 'List available content files/sections' },
    { command: 'theme', description: 'Toggle between dark and light terminal theme' },
    { command: 'clear', description: 'Clear terminal screen history' },
    { command: 'help', description: 'Show this list of available commands' },
  ],
  sudo: 'Nice try. There is no root access here.',
  notFound: (input: string) => {
    const truncated = input.length > 40 ? input.slice(0, 40) + '...' : input;
    return `command not found: ${truncated}. Type help for the list.`;
  },
};
