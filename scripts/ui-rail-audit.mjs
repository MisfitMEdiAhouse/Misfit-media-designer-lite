import fs from 'node:fs';
import path from 'node:path';

const strict = process.argv.includes('--strict');
const roots = ['src/pages', 'src/components'];
const extensions = new Set(['.jsx', '.js', '.tsx', '.ts']);

// Reviewed exceptions are explicit so the audit does not decay into ignored warning noise.
// If the surrounding breakpoint/composition changes, remove the exception and re-audit.
const reviewedExceptions = [
  {
    file: 'src/pages/AgentControlPlane.jsx',
    rule: 'fixed-pixel-width',
    token: 'w-[280px]',
    reason: 'Dual-stat rail is 280px, which fits the canonical 320px mobile viewport inside the page gutters; global grid/flex min-width rails prevent child expansion.',
  },
  {
    file: 'src/pages/GoldenEssence.jsx',
    rule: 'nowrap-mobile-risk',
    token: 'whitespace-nowrap',
    reason: 'This control exists only inside the desktop artwork navigation guarded by hidden + md:block; the mobile route uses a separate navigation composition.',
  },
  {
    file: 'src/pages/GoldenEssence.jsx',
    rule: 'fixed-pixel-width',
    token: 'w-[1024px]',
    reason: '1024px is a max-width desktop rail inside hidden + md:block navigation, not a forced width; the element remains width:auto below the cap.',
  },
  {
    file: 'src/components/Navbar.jsx',
    rule: 'fixed-pixel-width',
    token: 'w-[680px]',
    reason: 'Desktop Explore flyout is nested inside the md-only navigation and never renders in the mobile menu composition.',
  },
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

function reviewedReason(file, rule, line) {
  return reviewedExceptions.find((item) => item.file === file && item.rule === rule && line.includes(item.token))?.reason || '';
}

const findings = [];
const add = (severity, file, line, rule, detail) => {
  const safe = reviewedReason(file, rule, detail.source || '');
  findings.push({ severity: safe ? 'safe' : severity, file, line, rule, detail: safe || detail.message });
};

for (const file of roots.flatMap((root) => walk(root))) {
  const source = fs.readFileSync(file, 'utf8');
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    const number = index + 1;

    // Long technical identifiers must never define a card's min-content width.
    const rendersLongToken = /\{\s*(url|href|endpoint|api|mcp|a2a)\s*\}/i.test(line);
    const truncates = /\btruncate\b/.test(line);
    const bounded = /min-w-0|max-w-full|misfit-url-rail|misfit-card-rail|break-all|break-words/.test(line);
    if (rendersLongToken && truncates && !bounded) {
      add('error', file, number, 'long-token-rail', { source: line, message: 'Long URL/endpoint is truncated without an explicit shrink/bounds rail.' });
    }

    // Fixed widths are not forbidden, but they deserve a breakpoint review.
    const fixedWidth = line.match(/\bw-\[(\d{3,})px\]/);
    if (fixedWidth && !/sm:|md:|lg:|xl:|2xl:|hidden/.test(line)) {
      add('warn', file, number, 'fixed-pixel-width', { source: line, message: `${fixedWidth[0]} should be verified behind a responsive composition.` });
    }

    // White-space locks can create mobile overflow. They are allowed only after review.
    if (/\bwhitespace-nowrap\b/.test(line) && !/overflow|truncate|sm:whitespace|md:whitespace|lg:whitespace/.test(line)) {
      add('warn', file, number, 'nowrap-mobile-risk', { source: line, message: 'Unbounded whitespace-nowrap can force horizontal overflow on small screens.' });
    }
  });
}

const errors = findings.filter((finding) => finding.severity === 'error');
const warnings = findings.filter((finding) => finding.severity === 'warn');
const safe = findings.filter((finding) => finding.severity === 'safe');

console.log(`Misfit UI rail audit: ${errors.length} error(s), ${warnings.length} warning(s), ${safe.length} reviewed exception(s)`);
for (const finding of findings) {
  console.log(`[${finding.severity.toUpperCase()}] ${finding.file}:${finding.line} ${finding.rule} — ${finding.detail}`);
}

if (strict && errors.length) process.exit(1);
