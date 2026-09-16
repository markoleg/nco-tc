# sergeant.army — сайт Центру підготовки сержантського складу НГУ

Односторінковий статичний сайт (HTML/CSS/JS без збірки). Mobile-first, шрифти e-Ukraine, фірмові кольори Deep Navy `#081522` / Gold `#C9A45C` / Warm White `#F4F4F2`.

## Структура

```
index.html            — сторінка (HEADER → HERO → 01 Місія → 02 Знання.Характер.Лідерство → 03 Кого шукаємо
                        → 04 Про Центр + напрями → 05 Вакансії → Виплати → Не знайшов → CTA → Контакти → FOOTER)
styles.css            — стилі, mobile-first (брейкпоінти 640 / 960 / 1400 px)
script.js             — меню, sticky-header, мобільна CTA, аналітика
CNAME                 — домен sergeant.army для GitHub Pages
assets/
  center-emblem.svg   — емблема Центру (використовується як favicon)
  hero-instructor*.webp — фонове фото Hero у 3 розмірах (720 / 1100 / 1672 px)
  og-image.jpg        — картка 1200×630 для Telegram / Signal / Viber / Facebook
  application-qr.jpg  — QR-код анкети
  fonts/              — e-Ukraine та e-Ukraine Head у WOFF2
```

Усі кнопки «Стати інструктором» / «Заповнити анкету» / «Залишити анкету» ведуть на Google-форму
`https://forms.gle/u6K18rWaoMVQsnip7`. Щоб змінити посилання — замініть його в `index.html` (пошук за `forms.gle`).

## Публікація на GitHub Pages

1. Завантажте файли в репозиторій на GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch**, гілка `main`, папка `/ (root)`.
3. У **Custom domain** вкажіть `sergeant.army` (файл `CNAME` вже є в репозиторії) і ввімкніть **Enforce HTTPS**.
4. У DNS домену додайте:
   - `A`-записи для `sergeant.army` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` для `www` → `<username>.github.io`

Після публікації перевірте OG-картку: надішліть посилання в Telegram або скористайтесь
https://developers.facebook.com/tools/debug/ (кнопка «Scrape Again» скидає кеш).

## Аналітика

Використовується Google Analytics 4. Щоб увімкнути:

1. Створіть ресурс GA4 і скопіюйте **ідентифікатор потоку даних** (`G-XXXXXXXXXX`).
2. У `script.js` впишіть його в перший рядок:
   ```js
   const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
   ```
   Поки поле порожнє, аналітика не завантажується.

Що надсилається автоматично (крім стандартних відвідувань і джерел переходу):

| Подія           | Коли                                   | Параметри                                          |
| --------------- | -------------------------------------- | -------------------------------------------------- |
| `cta_click`     | клік на будь-яку кнопку до анкети      | `cta_location` (hero / header / vacancy / final …), `cta_label`, `link_url`, `utm_*` |
| `contact_click` | клік на телефон або e-mail             | `contact_type` (phone / email), `utm_*`             |

У GA4 позначте `cta_click` як **конверсію** (Admin → Events → Mark as conversion) — тоді у звітах буде видно
воронку «відвідування → джерело → натискання “Стати інструктором”».

### UTM-посилання для різних каналів

Для кожного каналу генеруйте окремий QR-код на посилання з UTM — тоді у звіті «Traffic acquisition» видно, звідки прийшли кандидати.

| Канал                          | Посилання                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Плакати у військових частинах  | `https://sergeant.army/?utm_source=poster&utm_medium=qr&utm_campaign=recruit` |
| Інформаційні екрани            | `https://sergeant.army/?utm_source=screen&utm_medium=qr&utm_campaign=recruit` |
| Групи головних сержантів       | `https://sergeant.army/?utm_source=csm_groups&utm_medium=messenger&utm_campaign=recruit` |
| Прямі розсилки                 | `https://sergeant.army/?utm_source=mailing&utm_medium=email&utm_campaign=recruit` |
| Презентації Центру             | `https://sergeant.army/?utm_source=presentation&utm_medium=qr&utm_campaign=recruit` |

За потреби додайте `utm_content=<місто/частина>` для деталізації. UTM зберігаються на час сесії
і додаються до подій `cta_click` / `contact_click`.

## Локальний перегляд

```bash
python -m http.server 8765
```

і відкрийте http://localhost:8765/ (потрібен саме HTTP-сервер, а не `file://`, щоб шрифти й `srcset` працювали коректно).

## Оновлення зображень

Фото зберігаються у WebP. Щоб замінити Hero-фото, підготуйте три розміри (ширина 720 / 1100 / 1672 px)
із тими самими іменами в `assets/`. Приклад конвертації через Python + Pillow:

```bash
python -c "from PIL import Image; im=Image.open('new.png').convert('RGB'); [im.copy().resize((w, round(w*im.height/im.width)), Image.LANCZOS).save(f'assets/hero-instructor{s}.webp','WEBP',quality=78,method=6) for w,s in [(1672,''),(1100,'-md'),(720,'-sm')]]"
```
