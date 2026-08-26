#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ── Настройки ──────────────────────────────────────────────────────────────
const CONFIG = {
  quality: 60,          // качество WebP (0-100)
  inputDir: process.argv[2] || './1-t/images',  // папка с исходниками (или передать аргументом)
  outputDir: process.argv[3] || null,            // папка для результата (null = заменить оригиналы)
  extensions: ['.jpg', '.jpeg', '.png', '.gif', '.avif', '.tiff', '.bmp'],
  skipAlreadyWebp: false, // пересжимать .webp файлы
};
// ───────────────────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`${RED}Папка не найдена: ${dir}${RESET}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFiles(fullPath)); // рекурсивно
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const isWebp = ext === '.webp';
      if (CONFIG.extensions.includes(ext) || (isWebp && !CONFIG.skipAlreadyWebp)) {
        if (CONFIG.extensions.includes(ext) || isWebp) {
          files.push(fullPath);
        }
      }
    }
  }

  return files;
}

async function compressImage(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const dir = path.dirname(inputPath);
  const base = path.basename(inputPath, ext);

  const outDir = CONFIG.outputDir
    ? path.join(CONFIG.outputDir, path.relative(CONFIG.inputDir, dir))
    : dir;

  if (CONFIG.outputDir && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outputPath = path.join(outDir, `${base}.webp`);

  const inputSize = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .webp({ quality: CONFIG.quality })
    .toFile(outputPath);

  const outputSize = fs.statSync(outputPath).size;
  const saved = inputSize - outputSize;
  const percent = ((saved / inputSize) * 100).toFixed(1);

  // Удаляем оригинал если пишем в ту же папку и расширение отличается
  if (!CONFIG.outputDir && ext !== '.webp') {
    fs.unlinkSync(inputPath);
  }

  return { inputPath, outputPath, inputSize, outputSize, saved, percent };
}

async function main() {
  console.log(`\n${CYAN}══════════════════════════════════════════${RESET}`);
  console.log(`${CYAN}   Image → WebP Compressor  (quality: ${CONFIG.quality})${RESET}`);
  console.log(`${CYAN}══════════════════════════════════════════${RESET}`);
  console.log(`${DIM}Папка: ${path.resolve(CONFIG.inputDir)}${RESET}\n`);

  const files = getFiles(CONFIG.inputDir);

  if (files.length === 0) {
    console.log(`${YELLOW}Изображения не найдены в: ${CONFIG.inputDir}${RESET}`);
    return;
  }

  console.log(`Найдено файлов: ${files.length}\n`);

  let totalInput = 0;
  let totalOutput = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const result = await compressImage(file);
      totalInput += result.inputSize;
      totalOutput += result.outputSize;

      const arrow = result.saved >= 0 ? GREEN + '▼' : RED + '▲';
      const savedStr = result.saved >= 0
        ? `${GREEN}-${formatBytes(result.saved)} (${result.percent}%)${RESET}`
        : `${RED}+${formatBytes(Math.abs(result.saved))}${RESET}`;

      const relIn = path.relative(process.cwd(), result.inputPath);
      const relOut = path.relative(process.cwd(), result.outputPath);

      console.log(
        `${arrow}${RESET} ${relIn !== relOut ? relIn + ' → ' : ''}${relOut}\n` +
        `   ${DIM}${formatBytes(result.inputSize)} → ${formatBytes(result.outputSize)}  ${RESET}${savedStr}`
      );
    } catch (err) {
      errors++;
      console.log(`${RED}✗ Ошибка: ${file}${RESET}\n  ${DIM}${err.message}${RESET}`);
    }
  }

  const totalSaved = totalInput - totalOutput;
  const totalPercent = totalInput > 0 ? ((totalSaved / totalInput) * 100).toFixed(1) : 0;

  console.log(`\n${CYAN}══════════════════════════════════════════${RESET}`);
  console.log(`${GREEN}Готово!${RESET} Обработано: ${files.length - errors}/${files.length}`);
  if (errors > 0) console.log(`${RED}Ошибок: ${errors}${RESET}`);
  console.log(
    `Итого: ${formatBytes(totalInput)} → ${formatBytes(totalOutput)}  ` +
    `${GREEN}сэкономлено ${formatBytes(totalSaved)} (${totalPercent}%)${RESET}`
  );
  console.log(`${CYAN}══════════════════════════════════════════${RESET}\n`);
}

main();
