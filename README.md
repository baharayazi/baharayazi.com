# Bahar Ayazi — Terminal Portfolio

A terminal-style personal website for **Bahar Ayazi** (Software Engineer & MASc ECE Student at the University of Victoria).
Designed to feel like a lightweight, clean, interactive Unix command line, built with Next.js App Router and Tailwind CSS, fully static, and optimized for deployment to Cloudflare Pages at [https://baharayazi.com](https://baharayazi.com).

---

## Features

- **Terminal UX**: Real command execution, auto-typing introduction on load, tab completion, bash-style command history (`ArrowUp` / `ArrowDown`), and quick-run command chips.
- **Dark & Light Themes**: Dark theme by default, accessible WCAG AA contrast in both modes, persisted across sessions in `localStorage`, respecting system preferences.
- **Commands & Aliases**:
  - Commands: `whoami`, `about`, `experience`, `projects`, `research`, `skills`, `education`, `contact`, `cv`, `ls`, `help`, `theme`, `clear`
  - Aliases: `resume` → `cv`, `work`/`jobs` → `experience`, `email`/`links`/`github`/`linkedin` → `contact`, `?`/`man` → `help`, `info` → `whoami`
  - Easter eggs: `sudo ...` ("Nice try. There is no root access here.")
- **Accessibility (a11y)**:
  - Live region with `role="log"` and `aria-live="polite"`
  - Full keyboard accessibility and visible focus rings
  - Responsive down to 320px with minimum 16px font-size to prevent mobile iOS zoom
  - Respects `prefers-reduced-motion` (skips typing effect immediately)
  - `<noscript>` fallback with full identity, about, and contact links
- **Static Export**: 100% static HTML/CSS/JS output via Next.js `output: 'export'`. Zero backend, zero database, zero external fonts or trackers.

---

## Note on `public/cv.pdf`

> **Note:** A placeholder PDF file is currently placed at `public/cv.pdf`. To update your resume, replace `public/cv.pdf` with your real curriculum vitae PDF. The `cv` command and download links will automatically point to it.

---

## How to Edit Content

All text content is decoupled from components and stored as strictly typed TypeScript data in:

```
src/content/profile.ts
```

To update your bio, work experience, projects, skills, education, or contact links, simply modify `src/content/profile.ts`. No component edits are required.

---

## How to Run Locally

### Prerequisites
- Node.js 20+ (see `.nvmrc`)
- npm 10+

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/baharayazi/baharayazi.com.git
   cd baharayazi.com
   ```

2. **Use the recommended Node version**:
   ```bash
   nvm use
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Typecheck & Lint**:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```

6. **Build static production site**:
   ```bash
   npm run build
   ```
   The static files will be exported to the `out` directory.

7. **Preview the production build**:
   ```bash
   npx serve out
   ```

---

## Cloudflare Pages Deployment Settings

To deploy this site on Cloudflare Pages connected to your GitHub repository:

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository (`baharayazi.com`).
3. Set the build configuration:
   - **Framework preset**: `Next.js (Static HTML Export)` or `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (or leave blank if repository root)
4. Set Environment Variables:
   - Variable name: `NODE_VERSION`
   - Value: `20` (or `22`)
5. Click **Save and Deploy**.
6. Set up your custom domain:
   - Go to **Custom domains** tab in the Pages project
   - Add `baharayazi.com` and `www.baharayazi.com`
   - Cloudflare will configure the DNS and SSL automatically.
