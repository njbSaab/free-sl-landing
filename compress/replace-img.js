#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ── Настройки ──────────────────────────────────────────────────────────────
const CONFIG = {
  // Папка для обхода (или передать аргументом: node replace-img-refs.js ./my-folder)
  targetDir: process.argv[2] || '.',

  // Файлы в которых делаем замену
  fileExtensions: ['.html', '.css'],

  // Расширения изображений которые заменяем на .webp
  imageExtensions: ['png', 'jpeg', 'jpg'],

  // Только показать что изменится, не трогать файлы (dry run)
  dryRun: process.argv.includes('--dry') || process.argv.includes('--dry-run'),
};
// ───────────────────────────────────────────────────────────────────────────

const RESET  = '\x1b[0m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const DIM    = '\x1b[2m';
const BOLD   = '\x1b[1m';

// Регулярка: ловит image.png / image.jpeg / image.jpg в любом контексте
// url(...), src="...", href="...", content="..."
function buildRegex() {
  const exts = CONFIG.imageExtensions.join('|');
  // Ловим имя файла + расширение, граница — кавычка, скобка, пробел, конец строки
  return new RegExp(`([\\w\\-./]+\\.)(${exts})(?=['"\\s)\\?#>]|$)`, 'gi');
}

function getFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`${RED}Папка не найдена: ${dir}${RESET}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    // Пропускаем node_modules и скрытые папки
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFiles(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (CONFIG.fileExtensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const regex = buildRegex();

  let replacements = [];
  const updated = original.replace(regex, (match, base, ext, offset) => {
    const replacement = `${base}webp`;
    replacements.push({ from: match, to: replacement, offset });
    return replacement;
  });

  return { original, updated, replacements };
}

function main() {
  console.log(`\n${CYAN}══════════════════════════════════════════${RESET}`);
  console.log(`${CYAN}   Image refs → WebP replacer${RESET}${CONFIG.dryRun ? `  ${YELLOW}[DRY RUN]${RESET}` : ''}`);
  console.log(`${CYAN}══════════════════════════════════════════${RESET}`);
  console.log(`${DIM}Папка: ${path.resolve(CONFIG.targetDir)}${RESET}`);
  console.log(`${DIM}Файлы: ${CONFIG.fileExtensions.join(', ')}${RESET}`);
  console.log(`${DIM}Заменяем: .${CONFIG.imageExtensions.join(', .')} → .webp${RESET}\n`);

  if (CONFIG.dryRun) {
    console.log(`${YELLOW}Режим DRY RUN — файлы не изменяются${RESET}\n`);
  }

  const files = getFiles(CONFIG.targetDir);

  if (files.length === 0) {
    console.log(`${YELLOW}Файлы .html/.css не найдены в: ${CONFIG.targetDir}${RESET}`);
    return;
  }

  console.log(`Найдено файлов для проверки: ${files.length}\n`);

  let totalFiles = 0;
  let totalReplacements = 0;

  for (const filePath of files) {
    const rel = path.relative(process.cwd(), filePath);
    const { original, updated, replacements } = processFile(filePath);

    if (replacements.length === 0) {
      console.log(`${DIM}  ─ ${rel} (без изменений)${RESET}`);
      continue;
    }

    totalFiles++;
    totalReplacements += replacements.length;

    console.log(`${GREEN}${BOLD}✓ ${rel}${RESET}  ${DIM}(${replacements.length} замен)${RESET}`);

    // Показываем каждую замену
    const seen = new Set();
    for (const r of replacements) {
      const key = `${r.from}→${r.to}`;
      if (!seen.has(key)) {
        seen.add(key);
        console.log(`  ${DIM}${r.from}${RESET} ${YELLOW}→${RESET} ${GREEN}${r.to}${RESET}`);
      }
    }

    // Записываем файл если не dry run
    if (!CONFIG.dryRun) {
      fs.writeFileSync(filePath, updated, 'utf8');
    }

    console.log('');
  }

  console.log(`${CYAN}══════════════════════════════════════════${RESET}`);
  if (totalFiles === 0) {
    console.log(`${YELLOW}Замен не найдено — все ссылки уже в .webp${RESET}`);
  } else {
    const action = CONFIG.dryRun ? `${YELLOW}Будет изменено${RESET}` : `${GREEN}Изменено${RESET}`;
    console.log(`${action}: ${totalFiles} файл(ов), ${totalReplacements} замен`);
    if (CONFIG.dryRun) {
      console.log(`${DIM}Запусти без --dry-run чтобы применить изменения${RESET}`);
    }
  }
  console.log(`${CYAN}══════════════════════════════════════════${RESET}\n`);
}

main();
