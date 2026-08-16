/**
 * NexusBuild – Playwright → Word (.docx) Report Generator
 * ─────────────────────────────────────────────────────────
 * Usage:
 *   node generate-docx-report.cjs
 *
 * Prerequisites (already installed, or run once):
 *   npm install docx --save-dev
 *
 * Reads  : test-results/results.json  (produced by the Playwright JSON reporter)
 * Writes : NexusBuild-Test-Report.docx  (in the project root)
 * Cleans : test-results/results.json  is deleted when the docx is written
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, ShadingType,
  BorderStyle, VerticalAlign,
} = require('docx');

// ─── Paths ───────────────────────────────────────────────────────────────────
const JSON_PATH = path.join(__dirname, 'test-results', 'results.json');
const OUT_PATH  = path.join(__dirname, 'NexusBuild-Test-Report.docx');

// ─── Guard ───────────────────────────────────────────────────────────────────
if (!fs.existsSync(JSON_PATH)) {
  console.error(
    '\n❌  test-results/results.json not found.\n' +
    '    Run:  npx playwright test\n' +
    '    Then: node generate-docx-report.cjs\n'
  );
  process.exit(1);
}

// ─── Load JSON ───────────────────────────────────────────────────────────────
const raw = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ms2str = (ms) => {
  if (!ms && ms !== 0) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const STATUS_COLOR = {
  passed:  '166534', // green
  failed:  '991B1B', // red
  skipped: '92400E', // amber
  flaky:   '1E40AF', // blue
  timedOut:'991B1B',
};

const STATUS_BG = {
  passed:  'DCFCE7',
  failed:  'FEE2E2',
  skipped: 'FEF3C7',
  flaky:   'DBEAFE',
  timedOut:'FEE2E2',
};

const BRAND = '1A4B9C'; // NexusBuild navy

// ── colour cells ──────────────────────────────────────────────────────────────
const shading = (fill) => ({ type: ShadingType.CLEAR, fill });

const hdrCell = (text, widthDXA) => new TableCell({
  width: { size: widthDXA, type: WidthType.DXA },
  shading: shading(BRAND),
  verticalAlign: VerticalAlign.CENTER,
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, bold: true, size: 17, color: 'FFFFFF' })],
  })],
});

const bodyCell = (text, widthDXA, opts = {}) => new TableCell({
  width: { size: widthDXA, type: WidthType.DXA },
  ...(opts.shade ? { shading: shading(opts.shade) } : {}),
  verticalAlign: VerticalAlign.CENTER,
  children: [new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: 40, after: 40 },
    children: [new TextRun({
      text: String(text ?? ''),
      size: opts.size ?? 16,
      bold: opts.bold ?? false,
      color: opts.color ?? '111827',
      italics: opts.italic ?? false,
    })],
  })],
});

const para = (text, opts = {}) => new Paragraph({
  heading: opts.heading,
  spacing: { before: opts.before ?? 80, after: opts.after ?? 80 },
  alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
  children: [new TextRun({
    text,
    bold: opts.bold ?? false,
    size: opts.size ?? 20,
    color: opts.color ?? '111827',
    italics: opts.italic ?? false,
  })],
});

// ─── Parse JSON results ───────────────────────────────────────────────────────
const suites   = raw.suites ?? [];
const stats    = raw.stats  ?? {};

// Flatten all results across suites + nested suites
function flattenSpecs(suite, specFileName) {
  const results = [];
  const fileName = suite.file ?? specFileName ?? suite.title ?? '';

  for (const spec of (suite.specs ?? [])) {
    for (const test of (spec.tests ?? [])) {
      const lastResult = (test.results ?? []).at(-1) ?? {};
      results.push({
        title     : spec.title,
        status    : test.status,           // passed | failed | skipped | flaky
        duration  : lastResult.duration ?? 0,
        error     : lastResult.error?.message ?? '',
        location  : spec.file
          ? `${path.basename(spec.file)}:${spec.line ?? ''}`
          : '',
      });
    }
  }

  for (const child of (suite.suites ?? [])) {
    results.push(...flattenSpecs(child, fileName));
  }
  return results;
}

// Build per-spec-file sections
const specFiles = suites.map((s) => ({
  file  : path.basename(s.file ?? s.title ?? ''),
  title : s.title ?? s.file ?? '',
  tests : flattenSpecs(s),
})).filter(s => s.tests.length > 0);

// Overall counts
let totalPassed = 0, totalFailed = 0, totalSkipped = 0, totalFlaky = 0;
let totalDuration = 0;

specFiles.forEach(sf => sf.tests.forEach(t => {
  const st = t.status;
  if (st === 'passed')  totalPassed++;
  else if (st === 'failed' || st === 'timedOut') totalFailed++;
  else if (st === 'skipped') totalSkipped++;
  else if (st === 'flaky')   totalFlaky++;
  totalDuration += t.duration ?? 0;
}));

const totalTests = totalPassed + totalFailed + totalSkipped + totalFlaky;

// ─── Document sections ────────────────────────────────────────────────────────
const children = [];

// ── Title ────────────────────────────────────────────────────────────────────
const now = new Date().toLocaleString('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({
      text: 'NexusBuild — Playwright Test Report',
      bold: true, size: 40, color: BRAND,
    })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text: `Generated: ${now}`, size: 19, color: '6B7280', italics: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 300 },
    children: [new TextRun({ text: 'Browser: Chromium  •  Framework: React 19 + Vite  •  Backend: Supabase/PostgreSQL', size: 17, color: '374151' })],
  }),
);

// ── Summary Table ─────────────────────────────────────────────────────────────
children.push(
  para('Test Run Summary', { heading: HeadingLevel.HEADING_1, bold: true, before: 200, after: 120, color: BRAND, size: 28 }),
);

const summaryColW = [2000, 1500, 1500, 1500, 1500, 2000];
const summaryHdrs = ['Total Tests', 'Passed ✓', 'Failed ✗', 'Skipped', 'Flaky', 'Total Duration'];
const summaryVals = [
  String(totalTests),
  String(totalPassed),
  String(totalFailed),
  String(totalSkipped),
  String(totalFlaky),
  ms2str(totalDuration),
];
const summaryShadows = [
  null, 'DCFCE7', totalFailed > 0 ? 'FEE2E2' : 'F0FDF4',
  'FEF3C7', 'DBEAFE', 'F3F4F6',
];
const summaryColors = [
  '111827', '166534', totalFailed > 0 ? '991B1B' : '166534',
  '92400E', '1E40AF', '374151',
];

children.push(
  new Table({
    width: { size: 10000, type: WidthType.DXA },
    rows: [
      new TableRow({ children: summaryHdrs.map((h, i) => hdrCell(h, summaryColW[i])) }),
      new TableRow({
        children: summaryVals.map((v, i) => bodyCell(v, summaryColW[i], {
          center: true, bold: true, size: 20,
          shade: summaryShadows[i],
          color: summaryColors[i],
        })),
      }),
    ],
  }),
  new Paragraph({ spacing: { after: 400 } }),
);

// ── Per-spec file sections ────────────────────────────────────────────────────
const COL_W = [4000, 1400, 1200, 3400]; // Name, Status, Duration, Error/Location

specFiles.forEach((sf, idx) => {
  // Count for this file
  const fp = sf.tests.filter(t => t.status === 'passed').length;
  const ff = sf.tests.filter(t => t.status === 'failed' || t.status === 'timedOut').length;
  const allPassed = ff === 0;

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 320, after: 80 },
      children: [
        new TextRun({ text: `${idx + 1 < 10 ? '0' + (idx + 1) : idx + 1}.  `, bold: true, size: 22, color: '9CA3AF' }),
        new TextRun({ text: sf.file, bold: true, size: 22, color: BRAND }),
        new TextRun({ text: `   (${fp} passed`, size: 20, color: '166534' }),
        ff > 0
          ? new TextRun({ text: ` · ${ff} failed`, size: 20, color: '991B1B' })
          : new TextRun({ text: '', size: 20 }),
        new TextRun({ text: ')', size: 20, color: '374151' }),
      ],
    }),
  );

  // Table header
  const hdrs = ['Test Case', 'Status', 'Duration', 'Error / Location'];
  const tblRows = [
    new TableRow({ children: hdrs.map((h, i) => hdrCell(h, COL_W[i])) }),
  ];

  sf.tests.forEach((t, ti) => {
    const st  = t.status === 'timedOut' ? 'failed' : t.status;
    const bg  = ti % 2 === 0 ? null : 'F9FAFB';
    const sBg = STATUS_BG[st]    ?? 'F3F4F6';
    const sFg = STATUS_COLOR[st] ?? '374151';
    const label = t.status === 'timedOut' ? 'TIMEOUT' : t.status.toUpperCase();

    // Error cell content
    let errText = '';
    if ((st === 'failed') && t.error) {
      errText = t.error.replace(/\n/g, ' ').slice(0, 220);
      if (t.location) errText += `  [${t.location}]`;
    } else if (t.location && st !== 'failed') {
      errText = t.location;
    }

    tblRows.push(new TableRow({
      children: [
        bodyCell(t.title, COL_W[0], { shade: bg }),
        bodyCell(label,   COL_W[1], { shade: sBg, color: sFg, bold: true, center: true, size: 14 }),
        bodyCell(ms2str(t.duration), COL_W[2], { shade: bg, center: true, color: '374151' }),
        bodyCell(errText, COL_W[3], { shade: bg, color: st === 'failed' ? '991B1B' : '6B7280', size: 14, italic: st !== 'failed' }),
      ],
    }));
  });

  children.push(
    new Table({ width: { size: 10000, type: WidthType.DXA }, rows: tblRows }),
    new Paragraph({ spacing: { after: 240 } }),
  );
});

// ── Footer note ───────────────────────────────────────────────────────────────
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
    children: [
      new TextRun({
        text: 'Report produced by NexusBuild automated QA pipeline  •  Playwright + @playwright/test  •  Node.js docx generator',
        size: 15, color: '9CA3AF', italics: true,
      }),
    ],
  }),
);

// ─── Build & write document ───────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 20 } },
    },
  },
  sections: [{
    properties: {
      page: { margin: { top: 720, bottom: 720, left: 800, right: 800 } },
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\n✅  Report written → ${OUT_PATH}`);

  // Clean up the temporary JSON
  try {
    fs.unlinkSync(JSON_PATH);
    console.log('🗑   Cleaned up test-results/results.json\n');
  } catch (_) { /* ignore */ }
});
