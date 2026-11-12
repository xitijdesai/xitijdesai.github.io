async function loadData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error loading data.json:", error);
    return null;
  }
}

const THEME_KEY = 'kd-portfolio-theme';
const html = document.documentElement;

function getInitialTheme() {
  return localStorage.getItem(THEME_KEY) || 'terminal';
}

function setTheme(theme) {
  html.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

document.addEventListener('click', (e) => {
  if (e.target.closest('#themeToggleTerminal') || e.target.closest('#themeToggleModern')) {
    setTheme(html.dataset.theme === 'terminal' ? 'modern' : 'terminal');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'm') {
    e.preventDefault();
    setTheme(html.dataset.theme === 'terminal' ? 'modern' : 'terminal');
  }
});

// Terminal Engine
class TerminalEngine {
  constructor(data) {
    this.data = data;
    this.output = document.getElementById('terminalOutput');
    this.input = document.getElementById('terminalInput');
    this.cursorPos = document.getElementById('cursorPosition');
    this.history = [];
    this.historyIndex = -1;
    this.isAnimating = false;
    this.commandMap = this.buildCommandMap();
    this.init();
  }

  buildCommandMap() {
    return {
      help: () => this.showHelp(),
      whoami: () => this.showWhoami(),
      experience: (args) => this.showExperience(args),
      exp: (args) => this.showExperience(args),
      skills: (args) => this.showSkills(args),
      projects: () => this.showProjects(),
      certs: () => this.showCerts(),
      certifications: () => this.showCerts(),
      contact: () => this.showContact(),
      resume: () => this.downloadResume(),
      theme: () => this.toggleTheme(),
      clear: () => this.clear(),
      cls: () => this.clear(),
      ls: () => this.showSections(),
      exit: () => this.showExit(),
    };
  }

  init() {
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.input.addEventListener('input', () => this.updateCursorPos());
    this.output.addEventListener('click', () => this.input.focus());
    this.bootSequence();
  }

  async bootSequence() {
    this.isAnimating = true;
    this.printLine('', 'raw');
    await this.typeLine(this.data.terminal.welcome, 'term-welcome', 25);
    await this.typeLine(this.data.terminal.motd, 'term-motd', 15);
    this.printLine('');
    this.printLine(`Type <span class="term-command">help</span> for available commands.`, 'term-hint');
    this.printLine('');
    this.isAnimating = false;
    this.input.focus();
  }

  printLine(content, className = 'term-output-text') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = content;
    this.output.appendChild(line);
    this.scrollToBottom();
    return line;
  }

  async typeLine(text, className = 'term-output-text', speed = 20) {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    this.output.appendChild(line);
    for (let i = 0; i <= text.length; i++) {
      line.textContent = text.slice(0, i);
      this.scrollToBottom();
      await new Promise(r => setTimeout(r, speed));
    }
  }

  scrollToBottom() {
    this.output.scrollTop = this.output.scrollHeight;
  }

  updateCursorPos() {
    const lines = this.input.value.split('\n').length;
    const cols = this.input.value.split('\n').pop().length + 1;
    if (this.cursorPos) {
      this.cursorPos.textContent = `Ln ${lines}, Col ${cols}`;
    }
  }

  handleKeydown(e) {
    if (this.isAnimating) { e.preventDefault(); return; }

    if (e.key === 'Enter') {
      e.preventDefault();
      const val = this.input.value.trim();
      this.input.value = '';
      this.executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length > 0 && this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    }
  }

  executeCommand(rawInput) {
    if (!rawInput) return;
    this.history.push(rawInput);
    this.historyIndex = this.history.length;

    this.printLine(`<span class="term-prompt-line"><span class="prompt">kd@secops:~$</span> <span class="term-command">${rawInput}</span></span>`, 'raw');
    const parts = rawInput.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (this.commandMap[cmd]) {
      this.commandMap[cmd](args);
    } else {
      this.printLine(`Command not found: ${cmd}. Type <span class="term-command">help</span> for available commands.`, 'term-error');
    }
    this.input.focus();
  }

  showHelp() {
    this.printLine('<span class="term-section-header">Available Commands</span>');
    this.printLine('help, whoami, experience, skills, projects, certs, contact, clear');
  }

  showWhoami() {
    this.printLine(this.data.profile.summary);
  }

  showExperience() {
    this.printLine('<span class="term-section-header">Professional Experience</span>');
    this.data.experience.forEach(comp => {
      comp.roles.forEach(role => {
        this.printLine(`• <b>${role.title}</b> at <i>${comp.company}</i> (${role.start} - ${role.end}) [${role.location}]`);
      });
    });
  }

  showSkills() {
    this.printLine('<span class="term-section-header">Technical Skills</span>');
    Object.entries(this.data.skills).forEach(([cat, list]) => {
      this.printLine(`<b>${cat}:</b> ${list.join(', ')}`);
    });
  }

  showProjects() {
    this.printLine('<span class="term-section-header">Key Projects</span>');
    this.data.projects.forEach(proj => {
      this.printLine(`• <b>${proj.title}</b>: ${proj.description}`);
    });
  }

  showCerts() {
    this.printLine('<span class="term-section-header">Certifications</span>');
    this.data.certifications.forEach(cert => {
      this.printLine(`• ${cert.name} (${cert.issuer})`);
    });
  }

  showContact() {
    this.printLine(`Email: [${this.data.profile.email}](mailto:${this.data.profile.email}) | LinkedIn: [Profile](${this.data.profile.linkedin})`);
  }

  downloadResume() {
    window.open('resume.pdf', '_blank');
  }

  toggleTheme() {
    setTheme(html.dataset.theme === 'terminal' ? 'modern' : 'terminal');
  }

  clear() {
    this.output.innerHTML = '';
    this.bootSequence();
  }

  showSections() {
    this.printLine('Available sections: experience, skills, projects, certs, contact, whoami');
  }

  showExit() {
    this.printLine('Session terminated.');
    this.input.disabled = true;
  }
}

// ==================== Modern View Renderer ====================
function renderModernView(data) {
  if (!data) return;

  const aboutSummary = document.getElementById('aboutSummary');
  if (aboutSummary) aboutSummary.textContent = data.profile.summary;

  // Render About Highlights Cards
  const highlights = [
    { icon: 'shield', title: 'Threat Detection', desc: 'Custom detection rules, KQL & LogScale CQL' },
    { icon: 'terminal', title: 'Automation', desc: 'SOC playbooks, API integrations, Python' },
    { icon: 'users', title: 'Leadership', desc: 'Mentored 10+ analysts, SOP development' },
    { icon: 'cloud', title: 'Cloud Security', desc: 'AWS, Azure, CSPM (Wiz, Aqua)' },
  ];

  const highlightsContainer = document.getElementById('aboutHighlights');
  if (highlightsContainer) {
    highlightsContainer.innerHTML = highlights.map(h => `
      <div class="highlight-card">
        <div class="highlight-icon">${getIcon(h.icon)}</div>
        <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 4px;">${h.title}</h3>
        <p style="font-size: 13px; color: var(--fg-subtle);">${h.desc}</p>
      </div>
    `).join('');
  }

  // Timeline / Experience
  const timeline = document.getElementById('timeline');
  if (timeline) {
    timeline.innerHTML = data.experience.flatMap(company =>
      company.roles.map(role => `
        <article class="timeline-item">
          <div class="timeline-content">
            <div class="timeline-header">
              <div>
                <h3 class="timeline-role">${role.title}</h3>
                <p class="timeline-company">${company.company}</p>
              </div>
              <span class="timeline-date">${role.start} – ${role.end}</span>
            </div>
            <p class="timeline-location" style="color:var(--fg-subtle); font-size:13px; margin-bottom:12px;">${role.location}</p>
            <ul class="timeline-bullets">
              ${role.bullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        </article>
      `).join('')
    ).join('');
  }

  // Skills
  const skillsGrid = document.getElementById('skillsGrid');
  if (skillsGrid) {
    skillsGrid.innerHTML = Object.entries(data.skills).map(([category, items]) => `
      <div class="skill-category">
        <h3 class="skill-category-title">${category}</h3>
        <ul class="skill-list">
          ${items.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  // Projects
  const projectsGrid = document.getElementById('projectsGrid');
  if (projectsGrid) {
    projectsGrid.innerHTML = data.projects.map(project => `
      <article class="project-card">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </article>
    `).join('');
  }

  // Certifications
  const certGrid = document.getElementById('certGrid');
  if (certGrid) {
    certGrid.innerHTML = data.certifications.map(cert => `
      <div class="cert-card">
        <h3>${cert.name} ${cert.year ? `(${cert.year})` : ''}</h3>
        <p style="color: var(--fg-muted); margin-top: 8px;">${cert.issuer}</p>
      </div>
    `).join('');
  }

  // Contact Links
  const contactLinks = document.getElementById('contactLinks');
  if (contactLinks) {
    const p = data.profile;
    contactLinks.innerHTML = `
      <a class="contact-link" href="mailto:${p.email}">Email: ${p.email}</a>
      <a class="contact-link" href="tel:${p.phone.replace(/\s/g, '')}">Phone: ${p.phone}</a>
      <a class="contact-link" href="${p.linkedin}" target="_blank" rel="noopener">LinkedIn Profile</a>
      <a class="contact-link" href="${p.github}" target="_blank" rel="noopener">GitHub Profile</a>
    `;
  }
}

// Helper for card icons
function getIcon(name) {
  const icons = {
    shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    terminal: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><line x1="6" y1="9" x2="18" y2="9"/><line x1="6" y1="13" x2="16" y2="13"/></svg>',
    users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    cloud: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>'
  };
  return icons[name] || icons.shield;
}
// ==================== Init ====================
async function initialize() {
  const appData = await loadData();
  if (!appData) return;

  window.terminal = new TerminalEngine(appData);
  setTheme(getInitialTheme());

  window.addEventListener('themechange', (e) => {
    if (e.detail.theme === 'modern' && !window.modernViewRendered) {
      renderModernView(appData);
      window.modernViewRendered = true;
    }
  });

  if (html.dataset.theme === 'modern') {
    renderModernView(appData);
    window.modernViewRendered = true;
  }
}

document.addEventListener('DOMContentLoaded', initialize);

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  if (!data.name || !data.email || !data.subject || !data.message) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Opening Mail App...';

  // Construct and launch the mailto client with user parameters
  const recipient = 'xitijdesai.work@gmail.com';
  const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`)}`;
  
  window.location.href = mailtoLink;
  showToast('Opening your email client...', 'info');

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = originalText;
    form.reset();
  }, 1000);
}

const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', handleContactSubmit);