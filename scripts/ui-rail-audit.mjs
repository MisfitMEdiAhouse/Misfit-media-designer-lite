import fs from 'node:fs';
import path from 'node:path';

const strict = process.argv.includes('--strict');
const roots = ['src/pages', 'src/components'];
const extensions = new Set(['.jsx', '.js', '.tsx', '.ts']);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const findings = [];
const add = (severity, file, line, rule, detail) => findings.push({ severity, file, line, rule, detail });

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
      add('error', file, number, 'long-token-rail', 'Long URL/endpoint is truncated without an explicit shrink/bounds rail.');
    }

    // Fixed widths are not forbidden, but they deserve a breakpoint review.
    const fixedWidth = line.match(/\bw-\[(\d{3,})px\]/);
    if (fixedWidth && !/sm:|md:|lg:|xl:|2xl:|hidden/.test(line)) {
      add('warn', file, number, 'fixed-pixel-width', `${fixedWidth[0]} should be verified behind a responsive composition.`);
    }

    // White-space locks can create mobile overflow. They are allowed only after review.
    if (/\bwhitespace-nowrap\b/.test(line) && !/overflow|truncate|sm:whitespace|md:whitespace|lg:whitespace/.test(line)) {
      add('warn', file, number, 'nowrap-mobile-risk', 'Unbounded whitespace-nowrap can force horizontal overflow on small screens.');
    }
  });
}

const errors = findings.filter((finding) => finding.severity === 'error');
const warnings = findings.filter((finding) => finding.severity === 'warn');

if (findings.length) {
  console.log(`Misfit UI rail audit: ${errors.length} error(s), ${warnings.length} warning(s)`);
  for (const finding of findings) {
    console.log(`[${finding.severity.toUpperCase()}] ${finding.file}:${finding.line} ${finding.rule} — ${finding.detail}`);
  }
} else {
  console.log('Misfit UI rail audit: clean');
}

if (strict && errors.length) process.exit(1);
