#!/usr/bin/env node

/**
 * webp-all.js
 *
 * Шаг 1 — Конвертирует все изображения (.jpg/.png/...) в .webp
 * Шаг 2 — Заменяет ссылки на изображения в .html и .css → .webp
 *
 * Использование:
 *   node webp-all.js <папка>               — обработать папку
 *   node webp-all.js <папка> --dry-run     — только показать что изменится
 *   node webp-all.js <папка> --quality=80  — задать качество WebP (0-100)
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

// ── Аргументы командной строки ─────────────────────────────────────────────
const args    = process.argv.slice(2);
const DRY_RUN = args.includes('--dry') || args.includes('--dry-run');
const qualityArg = args.find(a => a.startsWith('--quality='));
const TARGET_DIR = args.find(a => !a.startsWith('--')) || './';

// ── Настройки ──────────────────────────────────────────────────────────────
const CONFIG = {
  targetDir: TARGET_DIR,

  compress: {
    quality:          qualityArg ? parseInt(qualityArg.split('=')[1]) : 60,
    extensions:       ['.jpg', '.jpeg', '.png', '.gif', '.avif', '.tiff', '.bmp'],
    skipAlreadyWebp:  false,   // true = не пересжимать уже готовые .webp
  },

  replace: {
    fileExtensions:   ['.html', '.css'],
    imageExtensions:  ['png', 'jpeg', 'jpg'],
  },
};
// ───────────────────────────────────────────────────────────────────────────

const RESET  = '\x1b[0m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const DIM    = '\x1b[2m';
const BOLD   = '\x1b[1m';
const BLUE   = '\x1b[34m';

function formatBytes(bytes) {
  if (bytes < 1024)            return `${bytes} B`;
  if (bytes < 1024 * 1024)     return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function header(title) {
  console.log(`\n${CYAN}══════════════════════════════════════════${RESET}`);
  console.log(`${CYAN}   ${title}${RESET}`);
  console.log(`${CYAN}══════════════════════════════════════════${RESET}`);
}

// ── Утилита: рекурсивный обход папки ───────────────────────────────────────
function walkDir(dir, filterFn) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walkDir(fullPath, filterFn));
    } else if (filterFn(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

// ══════════════════════════════════════════════════════════════════════════
// ШАГ 1 — Конвертация изображений → WebP
// ══════════════════════════════════════════════════════════════════════════

async function compressImage(inputPath) {
  const ext      = path.extname(inputPath).toLowerCase();
  const dir      = path.dirname(inputPath);
  const base     = path.basename(inputPath, ext);
  const outPath  = path.join(dir, `${base}.webp`);
  const inSize   = fs.statSync(inputPath).size;

  await sharp(inputPath).webp({ quality: CONFIG.compress.quality }).toFile(outPath);

  const outSize = fs.statSync(outPath).size;
  const saved   = inSize - outSize;
  const pct     = ((saved / inSize) * 100).toFixed(1);

  // Удаляем оригинал если он отличается от .webp
  if (ext !== '.webp') fs.unlinkSync(inputPath);

  return { inputPath, outPath, inSize, outSize, saved, pct };
}

async function stepCompress() {
  header(`Шаг 1/2 — Image → WebP  (quality: ${CONFIG.compress.quality})`);
  console.log(`${DIM}Папка: ${path.resolve(CONFIG.targetDir)}${RESET}`);
  if (DRY_RUN) console.log(`${YELLOW}DRY RUN — файлы не изменяются${RESET}`);
  console.log('');

  const { extensions, skipAlreadyWebp } = CONFIG.compress;

  const files = walkDir(CONFIG.targetDir, name => {
    const ext = path.extname(name).toLowerCase();
    if (ext === '.webp') return !skipAlreadyWebp;
    return extensions.includes(ext);
  });

  if (files.length === 0) {
    console.log(`${YELLOW}Изображения не найдены${RESET}`);
    return { total: 0, errors: 0, totalIn: 0, totalOut: 0 };
  }

  console.log(`Найдено файлов: ${files.length}\n`);

  let totalIn = 0, totalOut = 0, errors = 0;

  for (const file of files) {
    const rel = path.relative(process.cwd(), file);
    try {
      if (DRY_RUN) {
        const size = fs.statSync(file).size;
        console.log(`${DIM}○ ${rel} → ${rel.replace(/\.[^.]+$/, '.webp')}${RESET}`);
        totalIn += size;
        continue;
      }

      const r = await compressImage(file);
      totalIn  += r.inSize;
      totalOut += r.outSize;

      const arrow    = r.saved >= 0 ? `${GREEN}▼` : `${RED}▲`;
      const savedStr = r.saved >= 0
        ? `${GREEN}-${formatBytes(r.saved)} (${r.pct}%)${RESET}`
        : `${RED}+${formatBytes(Math.abs(r.saved))}${RESET}`;

      const relOut = path.relative(process.cwd(), r.outPath);
      console.log(
        `${arrow}${RESET} ${rel} → ${relOut}\n` +
        `   ${DIM}${formatBytes(r.inSize)} → ${formatBytes(r.outSize)}  ${RESET}${savedStr}`
      );
    } catch (err) {
      errors++;
      console.log(`${RED}✗ Ошибка: ${rel}${RESET}\n  ${DIM}${err.message}${RESET}`);
    }
  }

  const totalSaved  = totalIn - totalOut;
  const totalPct    = totalIn > 0 ? ((totalSaved / totalIn) * 100).toFixed(1) : 0;

  console.log(`\n${GREEN}Шаг 1 готов!${RESET} Обработано: ${files.length - errors}/${files.length}`);
  if (!DRY_RUN && totalIn > 0) {
    console.log(
      `Итого: ${formatBytes(totalIn)} → ${formatBytes(totalOut)}  ` +
      `${GREEN}сэкономлено ${formatBytes(totalSaved)} (${totalPct}%)${RESET}`
    );
  }
  if (errors > 0) console.log(`${RED}Ошибок: ${errors}${RESET}`);

  return { total: files.length, errors, totalIn, totalOut };
}

// ══════════════════════════════════════════════════════════════════════════
// ШАГ 2 — Замена ссылок в HTML/CSS → .webp
// ══════════════════════════════════════════════════════════════════════════

function buildReplaceRegex() {
  const exts = CONFIG.replace.imageExtensions.join('|');
  return new RegExp(`([\\w\\-./]+\\.)(${exts})(?=['"\\s)\\?#>]|$)`, 'gi');
}

function processTextFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const regex    = buildReplaceRegex();
  const replacements = [];

  const updated = original.replace(regex, (match, base, ext, offset) => {
    replacements.push({ from: match, to: `${base}webp` });
    return `${base}webp`;
  });

  return { original, updated, replacements };
}

function stepReplace() {
  header('Шаг 2/2 — Обновление ссылок в HTML/CSS');
  console.log(`${DIM}Папка: ${path.resolve(CONFIG.targetDir)}${RESET}`);
  console.log(`${DIM}Заменяем: .${CONFIG.replace.imageExtensions.join(', .')} → .webp${RESET}`);
  if (DRY_RUN) console.log(`${YELLOW}DRY RUN — файлы не изменяются${RESET}`);
  console.log('');

  const files = walkDir(CONFIG.targetDir, name => {
    const ext = path.extname(name).toLowerCase();
    return CONFIG.replace.fileExtensions.includes(ext);
  });

  if (files.length === 0) {
    console.log(`${YELLOW}HTML/CSS файлы не найдены${RESET}`);
    return { totalFiles: 0, totalReplacements: 0 };
  }

  console.log(`Найдено файлов для проверки: ${files.length}\n`);

  let totalFiles = 0, totalReplacements = 0;

  for (const filePath of files) {
    const rel = path.relative(process.cwd(), filePath);
    const { updated, replacements } = processTextFile(filePath);

    if (replacements.length === 0) {
      console.log(`${DIM}  ─ ${rel} (без изменений)${RESET}`);
      continue;
    }

    totalFiles++;
    totalReplacements += replacements.length;

    console.log(`${GREEN}${BOLD}✓ ${rel}${RESET}  ${DIM}(${replacements.length} замен)${RESET}`);

    const seen = new Set();
    for (const r of replacements) {
      const key = `${r.from}→${r.to}`;
      if (!seen.has(key)) {
        seen.add(key);
        console.log(`  ${DIM}${r.from}${RESET} ${YELLOW}→${RESET} ${GREEN}${r.to}${RESET}`);
      }
    }

    if (!DRY_RUN) fs.writeFileSync(filePath, updated, 'utf8');
    console.log('');
  }

  if (totalFiles === 0) {
    console.log(`${YELLOW}Замен не найдено — все ссылки уже .webp${RESET}`);
  } else {
    const action = DRY_RUN ? `${YELLOW}Будет изменено${RESET}` : `${GREEN}Шаг 2 готов!${RESET}`;
    console.log(`${action} ${totalFiles} файл(ов), ${totalReplacements} замен`);
  }

  return { totalFiles, totalReplacements };
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════

async function main() {
  if (!fs.existsSync(CONFIG.targetDir)) {
    console.error(`${RED}Папка не найдена: ${CONFIG.targetDir}${RESET}`);
    process.exit(1);
  }

  console.log(`\n${BLUE}${BOLD}╔══════════════════════════════════════════╗${RESET}`);
  console.log(`${BLUE}${BOLD}║        webp-all  —  полный цикл          ║${RESET}`);
  console.log(`${BLUE}${BOLD}╚══════════════════════════════════════════╝${RESET}`);
  console.log(`${DIM}Целевая папка: ${path.resolve(CONFIG.targetDir)}${RESET}`);
  if (DRY_RUN) console.log(`${YELLOW}${BOLD}Режим DRY RUN — ничего не изменится${RESET}`);

  // Шаг 1: конвертация изображений
  const compressResult = await stepCompress();

  // Шаг 2: замена ссылок в HTML/CSS
  const replaceResult = stepReplace();

  // Итоговый отчёт
  header('Итог');
  if (DRY_RUN) {
    console.log(`${YELLOW}DRY RUN завершён. Для применения запусти без --dry-run${RESET}`);
  } else {
    console.log(`${GREEN}✓ Конвертировано изображений: ${compressResult.total - compressResult.errors}${RESET}`);
    console.log(`${GREEN}✓ Обновлено HTML/CSS файлов:  ${replaceResult.totalFiles}${RESET}`);
    console.log(`${GREEN}✓ Заменено ссылок:            ${replaceResult.totalReplacements}${RESET}`);
    if (compressResult.totalIn > 0) {
      const saved = compressResult.totalIn - compressResult.totalOut;
      const pct   = ((saved / compressResult.totalIn) * 100).toFixed(1);
      console.log(`${GREEN}✓ Сэкономлено места:          ${formatBytes(saved)} (${pct}%)${RESET}`);
    }
  }
  console.log(`${CYAN}══════════════════════════════════════════${RESET}\n`);
}

main().catch(err => {
  console.error(`${RED}Критическая ошибка: ${err.message}${RESET}`);
  process.exit(1);
});
