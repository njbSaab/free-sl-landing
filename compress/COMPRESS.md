# WebP Tools — Инструкция

Набор скриптов для перевода лендингов на WebP.

| Файл | Описание |
|------|----------|
| `webp-all.js` | ⭐ Главный скрипт — делает всё за один запуск |
| `compress.js` | Только конвертация изображений → WebP |
| `replace-img.js` | Только замена ссылок в HTML/CSS |

---

## Установка

```bash
cd compress
npm install
```

---

## webp-all.js — главный скрипт

Выполняет два шага за один запуск:

**Шаг 1** — Конвертирует все изображения (`.jpg`, `.png`, `.gif` и др.) в `.webp`, оригиналы удаляются  
**Шаг 2** — В `.html` и `.css` файлах заменяет все ссылки `.jpg/.png/.jpeg` → `.webp`

### Запуск

```bash
# Обработать конкретный лендинг
node webp-all.js ../lp-casino

# Обработать текущую папку
node webp-all.js ./

# Сначала посмотреть что изменится (файлы НЕ трогаются)
node webp-all.js ../lp-casino --dry-run

# Задать своё качество WebP (по умолчанию 60)
node webp-all.js ../lp-casino --quality=80

# Через npm (текущая папка)
npm run webp -- ../lp-casino
```

### Флаги

| Флаг | Описание |
|------|----------|
| `--dry-run` или `--dry` | Только показать что изменится, не трогать файлы |
| `--quality=N` | Качество WebP от 0 до 100 (по умолчанию `60`) |

### Пример вывода

```
╔══════════════════════════════════════════╗
║        webp-all  —  полный цикл          ║
╚══════════════════════════════════════════╝
Целевая папка: /sites/lp-casino

══════════════════════════════════════════
   Шаг 1/2 — Image → WebP  (quality: 60)
══════════════════════════════════════════
Найдено файлов: 3

▼ img/banner.jpg → img/banner.webp
   1.63 MB → 218.0 KB  -1.42 MB (86.9%)
▼ img/logo.png → img/logo.webp
   44.2 KB → 38.1 KB  -6.1 KB (13.8%)

Шаг 1 готов! Обработано: 3/3

══════════════════════════════════════════
   Шаг 2/2 — Обновление ссылок в HTML/CSS
══════════════════════════════════════════
Найдено файлов для проверки: 2

✓ index.html  (4 замены)
  banner.jpg → banner.webp
  logo.png → logo.webp

✓ css/style.css  (2 замены)
  bg.jpg → bg.webp

Шаг 2 готов! 2 файл(ов), 6 замен

══════════════════════════════════════════
   Итог
══════════════════════════════════════════
✓ Конвертировано изображений: 3
✓ Обновлено HTML/CSS файлов:  2
✓ Заменено ссылок:            6
✓ Сэкономлено места:          1.43 MB (84.1%)
══════════════════════════════════════════
```

### Настройки (блок `CONFIG` внутри файла)

```js
const CONFIG = {
  compress: {
    quality: 60,              // качество WebP 0–100
                              // 60 — агрессивное сжатие
                              // 80 — баланс размер/качество
                              // 90 — высокое качество

    extensions: [             // какие форматы конвертировать
      '.jpg', '.jpeg', '.png',
      '.gif', '.avif', '.tiff', '.bmp'
    ],

    skipAlreadyWebp: false,   // true = не пересжимать уже готовые .webp
  },

  replace: {
    fileExtensions: ['.html', '.css'],       // в каких файлах искать ссылки
    imageExtensions: ['png', 'jpeg', 'jpg'], // какие расширения заменять
  },
};
```

---

## Типичный рабочий процесс

```bash
# 1. Сначала сделай dry-run — посмотри что изменится
node webp-all.js ../lp-casino --dry-run

# 2. Если всё ок — запусти без флага
node webp-all.js ../lp-casino
```

> ⚠️ **Важно:** скрипт удаляет оригинальные изображения после конвертации.  
> Перед запуском убедись, что у тебя есть резервная копия или файлы в git.

---

## Отдельные скрипты

Если нужно выполнить только один из шагов:

### compress.js — только конвертация изображений

```bash
# Указать папку с изображениями (оригиналы заменяются)
node compress.js ./lp-casino/img

# Оригиналы сохранить, .webp — в отдельную папку
node compress.js ./lp-casino/img ./lp-casino/img-webp
```

### replace-img.js — только замена ссылок в HTML/CSS

```bash
# Обработать лендинг
node replace-img.js ./lp-casino

# Dry-run — только показать замены
node replace-img.js ./lp-casino --dry-run
```

---

## Что заменяет replace-img.js / webp-all.js (шаг 2)

Находит `.png`, `.jpeg`, `.jpg` в любом контексте внутри `.html` и `.css`:

```html
<!-- До -->
<img src="img/banner.jpg">
<div style="background: url(img/bg.png)">

/* До — в CSS */
background-image: url(../img/hero.jpeg);
```

```html
<!-- После -->
<img src="img/banner.webp">
<div style="background: url(img/bg.webp)">

/* После — в CSS */
background-image: url(../img/hero.webp);
```

Пропускает `node_modules` и скрытые папки (`.git` и т.п.).


В папке `compress/` три скрипта для полного цикла перехода на WebP:

| Скрипт | Что делает |
|--------|-----------|
| `compress.js` | Конвертирует сами файлы изображений в `.webp` |
| `replace-img-refs.js` | Заменяет ссылки `.png/.jpg/.jpeg` → `.webp` в `.html` и `.css` |
| `update-html.js` | Аналог replace-img-refs, но только для `src=""` атрибутов в HTML |

---

## Требования

```bash
node >= 16
npm install   # устанавливает sharp
```

---

## Типичный рабочий процесс

```
1. compress.js          → конвертировать файлы изображений в .webp
2. replace-img-refs.js  → обновить ссылки в HTML и CSS
```

---

## 1. compress.js — конвертация изображений в WebP

Рекурсивно обходит папку и конвертирует все изображения в `.webp`.

### Запуск

```bash
# Дефолт: папка ./1-t/images, оригиналы заменяются на .webp
npm run compress

# Оригиналы сохраняются, .webp кладётся в отдельную папку
npm run compress:out

# Своя папка — оригиналы заменяются
node compress.js ./lp-casino/img

# Своя папка + отдельный output
node compress.js ./lp-casino/img ./lp-casino/img-webp
```

### Поведение

| Ситуация | Что происходит |
|----------|----------------|
| `outputDir` не указан | Оригинал `.jpg/.png/...` **удаляется**, рядом создаётся `.webp` |
| `outputDir` указан | Оригинал **сохраняется**, `.webp` кладётся в указанную папку |
| Файл уже `.webp` | Пересжимается с заданным качеством |
| Вложенные папки | Обходятся **рекурсивно**, структура папок сохраняется |

### Настройки (блок `CONFIG` в начале файла)

```js
const CONFIG = {
  quality: 60,          // качество WebP 0–100
                        // 60 — агрессивное сжатие
                        // 80 — баланс размер/качество
                        // 90 — высокое качество

  inputDir: './1-t/images',  // папка по умолчанию
  outputDir: null,           // null = заменять оригиналы

  extensions: ['.jpg', '.jpeg', '.png', '.gif', '.avif', '.tiff', '.bmp'],

  skipAlreadyWebp: false,   // true = не пересжимать уже готовые .webp
};
```

### Пример вывода

```
══════════════════════════════════════════
   Image → WebP Compressor  (quality: 60)
══════════════════════════════════════════
Найдено файлов: 3

▼ img/banner.jpg → img/banner.webp
   1.63 MB → 218.0 KB  -1.42 MB (86.9%)

▼ img/logo.png → img/logo.webp
   66.8 KB → 61.4 KB  -5.4 KB (8.0%)

══════════════════════════════════════════
Готово! Обработано: 3/3
Итого: 1.70 MB → 280 KB  сэкономлено 1.43 MB (84.1%)
══════════════════════════════════════════
```

`▼` — файл стал меньше · `▲` — файл стал больше · `✗` — ошибка

---

## 2. replace-img-refs.js — замена ссылок в HTML и CSS

Ищет все упоминания `.png`, `.jpeg`, `.jpg` в `.html` и `.css` файлах и заменяет на `.webp`. Работает рекурсивно. Есть режим dry-run.

### Запуск

```bash
# Обработать текущую папку
node replace-img-refs.js

# Указать конкретную папку с лендингом
node replace-img-refs.js ./lp-casino

# Сначала посмотреть что изменится (файлы НЕ трогаются)
node replace-img-refs.js ./lp-casino --dry-run

# Применить изменения
node replace-img-refs.js ./lp-casino
```

### Что заменяет

Находит `.png`, `.jpeg`, `.jpg` в любом контексте:
- `src="img/banner.png"` → `src="img/banner.webp"`
- `url(../img/bg.jpg)` → `url(../img/bg.webp)`
- `content="img/photo.jpeg"` → `content="img/photo.webp"`
- В CSS: `background-image: url(img/hero.png)` → `...url(img/hero.webp)`

Пропускает `node_modules` и скрытые папки.

### Настройки (блок `CONFIG`)

```js
const CONFIG = {
  targetDir: '.',                        // папка для обхода
  fileExtensions: ['.html', '.css'],     // в каких файлах искать
  imageExtensions: ['png', 'jpeg', 'jpg'], // какие расширения заменять
  dryRun: false,                         // true = только показать, не менять
};
```

### Пример вывода

```
══════════════════════════════════════════
   Image refs → WebP replacer
══════════════════════════════════════════

✓ lp-casino/index.html  (4 замены)
  banner.jpg → banner.webp
  logo.png → logo.webp

✓ lp-casino/css/style.css  (2 замены)
  bg.jpg → bg.webp

══════════════════════════════════════════
Изменено: 2 файл(ов), 6 замен
══════════════════════════════════════════
```

---

## 3. update-html.js — замена src-атрибутов в HTML

Упрощённый вариант `replace-img-refs.js`: заменяет только `src="..."` атрибуты в HTML-файлах (`.html`, `.htm`, `.php`). CSS не трогает.

### Запуск

```bash
# Текущая папка
node update-html.js

# Конкретная папка
node update-html.js ./lp-casino
```

> **Когда использовать вместо replace-img-refs.js:**  
> Если нужно обновить только HTML и не трогать CSS, либо когда в CSS ссылки на изображения прописаны статически и уже в `.webp`.

---

## Полный пример для одного лендинга

```bash
cd /путь/до/compress

# 1. Конвертируем изображения (оригиналы заменяются)
node compress.js ../lp-casino/img

# 2. Смотрим что изменится в HTML/CSS (dry-run)
node replace-img-refs.js ../lp-casino --dry-run

# 3. Применяем замену ссылок
node replace-img-refs.js ../lp-casino
```

---

## Сравнение replace-img-refs.js vs update-html.js

| | `replace-img-refs.js` | `update-html.js` |
|---|---|---|
| HTML | ✅ | ✅ |
| CSS | ✅ | ❌ |
| Любой контекст (url, src, href) | ✅ | только `src=""` |
| Dry-run режим | ✅ `--dry-run` | ❌ |
| Показывает конкретные замены | ✅ | только количество |

**Рекомендуется использовать `replace-img-refs.js`** — он покрывает больше случаев.

