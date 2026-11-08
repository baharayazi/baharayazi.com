/**
 * Easter eggs: playful replies for "dangerous" commands and a few geeky extras.
 * Nothing here runs anything. The site is static, so these only print text.
 * Edit freely.
 */

/* ------------------------------------------------------------------ */
/* Mischief: commands people type hoping something bad will happen.    */
/* ------------------------------------------------------------------ */

export interface MischiefRule {
  pattern: RegExp;
  /** Printed in red, like the shell error they were hoping not to see. */
  error: string;
  /** The punchline. */
  quip: string;
}

/** Checked in order against the whole command (lowercased); first match wins. */
export const MISCHIEF_RULES: MischiefRule[] = [
  {
    // :(){ :|:& };:
    pattern: /:\s*\(\s*\)\s*\{.*\|.*&.*\}/,
    error: 'bash: fork: retry: Resource temporarily unavailable',
    quip: 'You brought a fork bomb to a static website. It has zero processes. Zero. I respect the commitment, though.',
  },
  {
    pattern: /\brm\s+(-[a-z-]*\s+)*/,
    error: "rm: cannot remove '/': Read-only file system",
    quip: 'Oh, you really thought I left rm -rf open on my own website? Adorable. The only thing deleted today is your plan.',
  },
  {
    pattern: /(\bdrop\s+(table|database)\b|'\s*or\s*'?1'?\s*=\s*'?1|\bunion\s+select\b|;\s*--)/,
    error: 'ERROR 1049: Unknown database',
    quip: "Hi, Little Bobby Tables. 1 = 1, sure, but there is no database here to agree with you. Your injection has nowhere to go.",
  },
  {
    pattern: /(<\s*script|javascript:|onerror\s*=|<\s*img[^>]*src|<\s*svg[^>]*onload)/,
    error: 'XSS payload received. Rendering it... as plain text.',
    quip: 'Your payload just became a very sad string. React escaped it before it could even say hello.',
  },
  {
    pattern: /(\.\.\/|\/etc\/(passwd|shadow|hosts)|~\/\.ssh|id_rsa|\.env\b)/,
    error: 'cat: /etc/passwd: No such file or directory',
    quip: 'Looking for secrets? There is no server, no /etc and no .env. The only secret here is how much coffee I drink.',
  },
  {
    pattern: /\b(curl|wget)\b.*\|\s*(sudo\s+)?(ba|z)?sh\b/,
    error: 'curl | bash: blocked by common sense',
    quip: 'You tried to pipe the internet into my shell. On a security student’s website. The confidence is honestly inspiring.',
  },
  {
    pattern: /^(hack|hackerman|hack the planet|hack\s.*)$/,
    error: 'Hacking baharayazi.com... 0%... 0%... 0%...',
    quip: 'Hacking this site is like breaking into a glass box: you can already see everything inside. Try ls instead.',
  },
  {
    pattern: /^(nmap|masscan|nikto|sqlmap|hydra|msfconsole|metasploit|gobuster|dirb)\b/,
    error: 'Nmap scan report for baharayazi.com: 443/tcp open https',
    quip: 'Congratulations, you found the front door. It is this page. There is no back door. There is, however, a contact command.',
  },
  {
    pattern: /^(ssh|telnet|nc|netcat|ftp)\b/,
    error: 'ssh: connect to host baharayazi.com port 22: Connection refused',
    quip: 'No shell for you. The only way into this server is a well-written email: run contact.',
  },
  {
    pattern: /^(chmod|chown|chattr)\b/,
    error: "chmod: changing permissions of '/': Operation not permitted",
    quip: 'chmod 777 on my website? I don’t even give my coffee mug that much access.',
  },
  {
    pattern: /^(dd|mkfs(\.\w+)?|format|fdisk|wipefs)\b/,
    error: 'mkfs: no disks found',
    quip: 'Formatting a website that lives on a CDN? Ambitious. You would have to format the internet first.',
  },
  {
    pattern: /^(shutdown|reboot|halt|poweroff|init\s+0)\b/,
    error: 'shutdown: Permission denied',
    quip: 'You can’t shut me down. I am a static site: I don’t sleep, I don’t crash, I just wait for recruiters.',
  },
  {
    pattern: /^(kill|killall|pkill)\b/,
    error: 'kill: (1) - Operation not permitted',
    quip: 'PID 1 is me, and I am not going anywhere. Save your kill -9 for your own bugs.',
  },
];

/** Shown under the reply once someone keeps trying. */
export const PERSISTENCE_NOTE =
  'Attempt #{n}. Persistent, aren’t you? That is a great trait in a security engineer. Seriously, run contact. Let’s talk.';
export const PERSISTENCE_THRESHOLD = 3;

export const SUDO_LINES = {
  error: 'visitor is not in the sudoers file. This incident will be reported.',
  quip: 'Reported to: absolutely no one. Nice try. There is no root access here.',
};

export function findMischief(command: string): MischiefRule | undefined {
  const normalized = command.trim().toLowerCase().replace(/\s+/g, ' ');
  return MISCHIEF_RULES.find((rule) => rule.pattern.test(normalized));
}

/* ------------------------------------------------------------------ */
/* Fun one-liners: editors, exits and other small jokes.               */
/* ------------------------------------------------------------------ */

export interface FunReply {
  lines: string[];
}

export const FUN_REPLIES: Record<string, FunReply> = {
  vim: {
    lines: [
      'You are now stuck in vim.',
      'Don’t panic. This is a website, so closing the tab works. Nobody here knows how to exit vim either.',
    ],
  },
  vi: { lines: ['vi: did you mean vim? Either way, you are stuck now. Try :q! (it won’t help).'] },
  nvim: { lines: ['Neovim user spotted. Respect. Sadly, this file system is read-only.'] },
  nano: { lines: ['nano: the friendliest editor, on the least editable file system. Read-only, sorry.'] },
  emacs: { lines: ['emacs: a great operating system, lacking only a decent text editor. Also lacking here: write access.'] },
  ':q': { lines: ['E37: No write since last change. Kidding. You were never in vim.'] },
  ':q!': { lines: ['Quit without saving. Good choice; there was nothing to save anyway.'] },
  ':wq': { lines: ['E45: readonly option is set. Nice reflexes, though.'] },
  exit: { lines: ['There is no exit. You live here now.', 'Well, you could close the tab. But first: run contact.'] },
  logout: { lines: ['logout: you were never logged in. Welcome anyway.'] },
  quit: { lines: ['This is a terminal, not a text adventure. Try exit (it won’t work either).'] },
  tea: {
    lines: [
      'Error 418: I’m a teapot?',
      'Not here. This is strictly a coffee household. Try coffee.',
    ],
  },
  hello: { lines: ['Hi there! Thanks for stopping by. Type help to look around, or contact to say hello properly.'] },
  hi: { lines: ['Hi! Type help to see what you can do here.'] },
  pwd: { lines: ['/home/bahar'] },
  echo: { lines: ['echo echo echo... (it’s a static site, the acoustics are great)'] },
  git: { lines: ['usage: git log', 'That is the only git command here. It is a good one, though.'] },
};

/* ------------------------------------------------------------------ */
/* coffee                                                              */
/* ------------------------------------------------------------------ */

export const COFFEE_ART = [
  '      ( (    ',
  '       ) )   ',
  '    .______. ',
  '    |      |]',
  '    \\      / ',
  "     `----'  ",
];

export const COFFEE_LINES = {
  brewing: 'Brewing a fresh cup',
  done: 'Coffee level: 100%. Bahar is now fully operational.',
  quip: 'No day starts here before the first cup. Bugs get fixed after the second.',
  invite: 'Up for a (virtual) coffee chat? Run contact.',
};

/* ------------------------------------------------------------------ */
/* cat bahar.txt                                                       */
/* ------------------------------------------------------------------ */

export const BAHAR_TXT = [
  'bahar (n.)',
  '  1. Persian for "spring": the season when everything starts to bloom.',
  '  2. A software engineer who keeps growing, one commit at a time.',
];

/* ------------------------------------------------------------------ */
/* uptime / date                                                       */
/* ------------------------------------------------------------------ */

/** Start of the first professional backend role (SnappCarfix). */
export const CAREER_START = { year: 2023, month: 1 };
export const HOME_TIMEZONE = 'America/Vancouver';
export const HOME_CITY = 'Victoria, BC';

/* ------------------------------------------------------------------ */
/* Konami code                                                         */
/* ------------------------------------------------------------------ */

export const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const KONAMI_LINES = [
  'Konami code accepted. +30 lives.',
  'Spring mode unlocked: bahar means spring, so here are some blossoms.',
];
