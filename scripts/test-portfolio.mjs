import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

const CHROME_PATH =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://127.0.0.1:4173/';

async function runTests() {
  console.log('🚀 Starting end-to-end tests for Bahar Ayazi portfolio website...\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const consoleErrors = [];
    const consoleWarnings = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(err.toString());
    });

    // 1. Initial Page Load & Auto-Typing Test
    console.log('Test 1: Initial page load and auto-typing');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Wait for auto-typing "whoami" to finish and display output
    await page.waitForFunction(
      () => document.querySelector('h1')?.textContent?.includes('Bahar Ayazi'),
      { timeout: 5000 }
    );

    const heading = await page.$eval('h1', (el) => el.textContent?.trim());
    assert.equal(heading, 'Bahar Ayazi');
    console.log('  ✔ Heading rendered: "Bahar Ayazi"');

    const whoamiText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(whoamiText.includes('Software engineer · MASc ECE student at the University of Victoria'));
    assert(whoamiText.includes('Backend and distributed systems, moving toward machine learning, AI and security.'));
    assert(whoamiText.includes('Type help, or tap a command below.'));
    console.log('  ✔ whoami initial output matches specifications exactly');

    // Helper to send command
    async function sendCommand(cmd) {
      const input = await page.$('#terminal-command-input');
      assert(input, 'Input element must exist');
      await input.click();
      await page.evaluate(() => {
        const el = document.querySelector('#terminal-command-input');
        if (el) {
          el.value = '';
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await input.type(cmd);
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 80));
    }

    // 2. Test Commands
    console.log('\nTest 2: Testing all interactive commands');

    // about
    await sendCommand('about');
    let logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('I am a software engineer turned graduate researcher.'));
    assert(logText.includes('Today I am moving toward machine learning and security.'));
    assert(logText.includes('I am looking for internships and collaborations in ML, AI and security.'));
    console.log('  ✔ "about" command passed');

    // experience
    await sendCommand('experience');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('Dotin'));
    assert(logText.includes('ActiveCleaners'));
    assert(logText.includes('Tradido'));
    assert(logText.includes('SnappCarfix'));
    assert(logText.includes('Refactored a legacy internal platform into a modular architecture.'));
    assert(logText.includes('Designed a concurrency-safe wallet and payment architecture'));
    console.log('  ✔ "experience" command passed');

    // projects
    await sendCommand('projects');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('Selected work'));
    assert(logText.includes('One wallet across two systems'));
    assert(logText.includes('Inventory API, minutes to milliseconds'));
    assert(logText.includes('Automated refunds'));
    assert(logText.includes('More on github.com/baharayazi.'));
    console.log('  ✔ "projects" command passed');

    // research
    await sendCommand('research');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('MASc research, University of Victoria'));
    assert(logText.includes('Anomaly detection in cybersecurity.'));
    assert(logText.includes('machine learning, AI, cybersecurity and distributed systems.'));
    assert(logText.includes('Papers and project write-ups will be added here.'));
    console.log('  ✔ "research" command passed');

    // skills
    await sendCommand('skills');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('Languages:'));
    assert(logText.includes('Python, SQL'));
    assert(logText.includes('Frameworks:'));
    assert(logText.includes('Kafka, Redis, Zookeeper, Consul, ActiveMQ, Celery'));
    assert(logText.includes('PostgreSQL, MySQL, MSSQL'));
    assert(logText.includes('English (C1), Persian (native)'));
    console.log('  ✔ "skills" command passed');

    // education
    await sendCommand('education');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('MASc, Electrical and Computer Engineering — University of Victoria · 2026 – present'));
    assert(logText.includes('BSc, Mechanical Engineering (Biosystems) — Isfahan University of Technology · 2018 – 2022'));
    console.log('  ✔ "education" command passed');

    // contact
    await sendCommand('contact');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('bahar@baharayazi.com'));
    assert(logText.includes('https://www.linkedin.com/in/baharayazi'));
    assert(logText.includes('https://github.com/baharayazi'));
    console.log('  ✔ "contact" command passed');

    // cv
    await sendCommand('cv');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('Download my CV (PDF)'));
    console.log('  ✔ "cv" command passed');

    // ls
    await sendCommand('ls');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('about'));
    assert(logText.includes('cv.pdf'));
    console.log('  ✔ "ls" command passed');

    // help
    await sendCommand('help');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('Available commands:'));
    assert(logText.includes('whoami'));
    assert(logText.includes('Aliases:'));
    console.log('  ✔ "help" command passed');

    // sudo
    await sendCommand('sudo apt update');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('Nice try. There is no root access here.'));
    console.log('  ✔ "sudo" response passed');

    // unknown command
    await sendCommand('unknowncmdtest');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('command not found: unknowncmdtest. Type help for the list.'));
    console.log('  ✔ unknown command handling passed');

    // clear command
    await sendCommand('clear');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent.trim());
    assert.equal(logText, '', 'Clear must empty the terminal history without echoing');
    console.log('  ✔ "clear" command emptied the screen cleanly');

    // 3. Test Aliases
    console.log('\nTest 3: Testing aliases');
    await sendCommand('resume');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('Download my CV (PDF)'));

    await sendCommand('work');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('ActiveCleaners'));

    await sendCommand('email');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('bahar@baharayazi.com'));

    await sendCommand('?');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('Available commands:'));

    await sendCommand('info');
    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('Bahar Ayazi'));
    console.log('  ✔ All command aliases verified');

    // 4. Test Theme Toggling and Persistence
    console.log('\nTest 4: Testing theme toggle and localStorage');
    const initialTheme = await page.$eval('html', (el) => el.getAttribute('data-theme'));
    assert.equal(initialTheme, 'dark');

    // Toggle via command
    await sendCommand('theme');
    const lightTheme = await page.$eval('html', (el) => el.getAttribute('data-theme'));
    assert.equal(lightTheme, 'light');
    let themeMsg = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(themeMsg.includes('Switched to light theme.'));

    let savedTheme = await page.evaluate(() => localStorage.getItem('bahar_theme_preference'));
    assert.equal(savedTheme, 'light');

    // Toggle via button
    const toggleButton = await page.$('button[title*="theme"]');
    assert(toggleButton);
    await toggleButton.click();
    const darkTheme = await page.$eval('html', (el) => el.getAttribute('data-theme'));
    assert.equal(darkTheme, 'dark');
    savedTheme = await page.evaluate(() => localStorage.getItem('bahar_theme_preference'));
    assert.equal(savedTheme, 'dark');
    console.log('  ✔ Theme toggle via CLI and button works and persists in localStorage');

    // 5. Test Keyboard Shortcuts: History Navigation & Autocomplete
    console.log('\nTest 5: Keyboard history (ArrowUp/ArrowDown) and Tab autocomplete');
    const input = await page.$('#terminal-command-input');

    // Clear screen
    await sendCommand('clear');
    await sendCommand('skills');
    await sendCommand('projects');

    // ArrowUp once should yield "projects"
    await input.click();
    await page.keyboard.press('ArrowUp');
    let val = await page.$eval('#terminal-command-input', (el) => el.value);
    assert.equal(val, 'projects');

    // ArrowUp again should yield "skills"
    await page.keyboard.press('ArrowUp');
    val = await page.$eval('#terminal-command-input', (el) => el.value);
    assert.equal(val, 'skills');

    // ArrowDown once should yield "projects"
    await page.keyboard.press('ArrowDown');
    val = await page.$eval('#terminal-command-input', (el) => el.value);
    assert.equal(val, 'projects');

    // ArrowDown again should restore empty/pending input
    await page.keyboard.press('ArrowDown');
    val = await page.$eval('#terminal-command-input', (el) => el.value);
    assert.equal(val, '');
    console.log('  ✔ ArrowUp and ArrowDown history navigation works');

    // Test Tab autocomplete
    await input.type('who');
    await page.keyboard.press('Tab');
    val = await page.$eval('#terminal-command-input', (el) => el.value);
    assert.equal(val, 'whoami');

    // Clear input
    await page.evaluate(() => {
      const el = document.querySelector('#terminal-command-input');
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await input.type('exp');
    await page.keyboard.press('Tab');
    val = await page.$eval('#terminal-command-input', (el) => el.value);
    assert.equal(val, 'experience');
    console.log('  ✔ Tab autocomplete works');

    // 6. Test Command Chips
    console.log('\nTest 6: Command chips interaction');
    const chipButtons = await page.$$('nav[aria-label="Quick command shortcuts"] button');
    assert(chipButtons.length === 12, `Expected 12 chip buttons, got ${chipButtons.length}`);

    // Click "education" chip
    const educationChip = (
      await Promise.all(
        chipButtons.map(async (btn) => {
          const txt = await btn.evaluate((el) => el.textContent?.trim());
          return txt === 'education' ? btn : null;
        })
      )
    ).find(Boolean);

    assert(educationChip);
    await educationChip.click();
    await new Promise((r) => setTimeout(r, 100));

    logText = await page.$eval('div[role="log"]', (el) => el.textContent);
    assert(logText.includes('Isfahan University of Technology'));
    console.log('  ✔ Command chips successfully execute commands');

    // 7. Test prefers-reduced-motion
    console.log('\nTest 7: prefers-reduced-motion behavior');
    const pageMotion = await browser.newPage();
    await pageMotion.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
    await pageMotion.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    // In reduced-motion mode, typing must be skipped and output immediately visible
    await new Promise((r) => setTimeout(r, 100));
    const reducedMotionHeading = await pageMotion.$eval('h1', (el) => el.textContent?.trim());
    assert.equal(reducedMotionHeading, 'Bahar Ayazi');
    console.log('  ✔ prefers-reduced-motion immediately renders without typing delays');
    await pageMotion.close();

    // 8. Test 360px-wide viewport responsiveness
    console.log('\nTest 8: Mobile 360px viewport test');
    const pageMobile = await browser.newPage();
    await pageMobile.setViewport({ width: 360, height: 640 });
    await pageMobile.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Wait for auto-typing to finish so real input is rendered
    await pageMobile.waitForSelector('#terminal-command-input', { timeout: 5000 });

    // Check no horizontal scrollbar overflow
    const hasHorizontalOverflow = await pageMobile.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    assert.equal(hasHorizontalOverflow, false, 'Mobile view must have no horizontal overflow');

    // Check input font-size >= 16px to prevent iOS zoom
    const fontSize = await pageMobile.$eval('#terminal-command-input', (el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    assert(fontSize >= 16, `Input font-size must be >= 16px on mobile, got ${fontSize}px`);
    console.log(`  ✔ Mobile 360px viewport: no overflow, input font-size is ${fontSize}px (>= 16px)`);
    await pageMobile.close();

    // 9. External Links Verification
    console.log('\nTest 9: External links security attributes');
    await sendCommand('projects');
    await sendCommand('contact');
    await sendCommand('cv');

    const externalLinks = await page.$$eval('a[target="_blank"]', (anchors) =>
      anchors.map((a) => ({
        href: a.href,
        rel: a.getAttribute('rel'),
        target: a.getAttribute('target'),
        text: a.textContent?.trim(),
      }))
    );
    assert(externalLinks.length >= 4, `Expected at least 4 external links, got ${externalLinks.length}`);
    for (const link of externalLinks) {
      assert.equal(link.target, '_blank');
      assert(link.rel?.includes('noopener'), `Link ${link.href} missing noopener`);
      assert(link.rel?.includes('noreferrer'), `Link ${link.href} missing noreferrer`);
    }
    console.log(`  ✔ All ${externalLinks.length} external links have target="_blank" and rel="noopener noreferrer"`);

    // 10. Check Noscript Fallback
    console.log('\nTest 10: Noscript tag inspection');
    const noscriptContent = await page.$eval('noscript', (el) => el.innerHTML);
    assert(noscriptContent.includes('Bahar Ayazi'), 'Noscript must contain Bahar Ayazi');
    assert(noscriptContent.includes('Software engineer'), 'Noscript must contain role');
    assert(noscriptContent.includes('mailto:bahar@baharayazi.com'), 'Noscript must contain email');
    assert(noscriptContent.includes('https://www.linkedin.com/in/baharayazi'), 'Noscript must contain LinkedIn');
    assert(noscriptContent.includes('https://github.com/baharayazi'), 'Noscript must contain GitHub');
    console.log('  ✔ Noscript fallback contains full identity and contact links');

    // 10. Check Console Errors and Warnings
    console.log('\nTest 10: Console inspection');
    assert.equal(consoleErrors.length, 0, `Expected 0 console errors, got: ${JSON.stringify(consoleErrors)}`);
    console.log('  ✔ 0 console errors');

    console.log('\n✨ ALL AUTOMATED TESTS PASSED SUCCESSFULLY! ✨\n');
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
