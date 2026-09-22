/* ------------------------------------------------------------
   Аналітика (Google Analytics 4)
   Вкажіть ідентифікатор потоку даних GA4 (формат G-XXXXXXXXXX).
   Поки поле порожнє — жоден скрипт аналітики не завантажується.
   ------------------------------------------------------------ */
const GA_MEASUREMENT_ID = "G-J80XZWM0K4";

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

if (GA_MEASUREMENT_ID) {
  const ga = document.createElement("script");
  ga.async = true;
  ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(ga);
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
}

/* Джерело переходу (UTM) — зберігаємо на час сесії, щоб
   події кліків можна було зіставити з каналом (плакат, екран, розсилка…). */
const params = new URLSearchParams(window.location.search);
const utm = {};
["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((key) => {
  const value = params.get(key);
  if (value) utm[key] = value;
});
try {
  if (Object.keys(utm).length) {
    sessionStorage.setItem("cpss_utm", JSON.stringify(utm));
  } else {
    Object.assign(utm, JSON.parse(sessionStorage.getItem("cpss_utm") || "{}"));
  }
} catch (_) {
  /* sessionStorage недоступний — працюємо без нього */
}

const track = (eventName, data = {}) => {
  gtag("event", eventName, { ...utm, ...data });
};

/* Кліки на «Стати інструктором» / «Заповнити анкету» */
document.querySelectorAll("[data-cta]").forEach((link) => {
  link.addEventListener("click", () => {
    track("cta_click", {
      cta_location: link.dataset.cta,
      cta_label: link.dataset.ctaLabel || link.textContent.trim(),
      link_url: link.href,
    });
  });
});

/* Кліки на телефон / e-mail / месенджери */
document.querySelectorAll("[data-contact]").forEach((link) => {
  link.addEventListener("click", () => {
    const location = link.closest("[data-contact-location]")?.dataset.contactLocation;

    track("contact_click", {
      contact_type: link.dataset.contact,
      contact_location: location,
      link_url: link.href,
    });
  });
});

/* ------------------------------------------------------------
   Header / меню
   ------------------------------------------------------------ */
const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const desktopQuery = window.matchMedia("(min-width: 960px)");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  if (!menu || !menuToggle) return;
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Відкрити меню");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menu?.classList.toggle("is-open", !isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Відкрити меню" : "Закрити меню");
  document.body.classList.toggle("menu-open", !isOpen);
});

menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("scroll", setHeaderState, { passive: true });
desktopQuery.addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

setHeaderState();

/* ------------------------------------------------------------
   Мобільна плаваюча CTA: з’являється після Hero,
   ховається на фінальному екрані «Стань інструктором»
   ------------------------------------------------------------ */
const mobileCta = document.querySelector("[data-mobile-cta]");
const hero = document.querySelector("[data-hero]");
const applySection = document.querySelector("[data-apply]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (mobileCta && hero && applySection && "IntersectionObserver" in window) {
  let heroVisible = true;
  let applyVisible = false;

  const updateMobileCta = () => {
    const show = !desktopQuery.matches && !heroVisible && !applyVisible;
    mobileCta.classList.toggle("is-visible", show);
    mobileCta.setAttribute("aria-hidden", String(!show));
    mobileCta.querySelector("a")?.setAttribute("tabindex", show ? "0" : "-1");
    document.body.classList.toggle("has-mobile-cta", show);
  };

  new IntersectionObserver(
    ([entry]) => {
      heroVisible = entry.isIntersecting;
      updateMobileCta();
    },
    { threshold: 0.15 }
  ).observe(hero);

  new IntersectionObserver(
    ([entry]) => {
      applyVisible = entry.isIntersecting;
      updateMobileCta();
    },
    { threshold: 0.2 }
  ).observe(applySection);

  desktopQuery.addEventListener("change", updateMobileCta);
}

/* ------------------------------------------------------------
   Поява елементів при прокручуванні
   ------------------------------------------------------------ */
const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/* Рік у футері */
const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
