// ==============================================================================
// ENTERPRISE INTERNATIONALIZATION (i18n) & LOCALIZATION ENGINE
// Multi-language catalog (EN, ES, HI), currency formatters, and reactive translation
// ==============================================================================

const TRANSLATIONS = {
  en: {
    app_title: 'Bondfire',
    tagline: 'Party games made from your own memories.',
    hero_cta_create: 'CREATE A POD IN 10s',
    hero_cta_vault: 'EXPLORE MEMORY VAULT',
    room_code: 'ROOM CODE',
    copy_link: 'COPY',
    players_joined: 'PLAYERS JOINED',
    start_game: 'START GAME',
    im_ready: 'I\'M READY',
    leave_room: 'LEAVE ROOM',
    score: 'SCORE',
    round: 'ROUND',
    sparks: 'Sparks',
    verified_memory: 'Verified Chat Memory',
    pixel_glade: 'The Pixel Campfire Glade',
    order_keepsake: 'Order Hardcover Keepsake',
  },
  es: {
    app_title: 'Bondfire',
    tagline: 'Juegos de fiesta hechos con tus propios recuerdos.',
    hero_cta_create: 'CREAR UN POD EN 10s',
    hero_cta_vault: 'EXPLORAR BAÚL DE RECUERDOS',
    room_code: 'CÓDIGO DE SALA',
    copy_link: 'COPIAR',
    players_joined: 'JUGADORES UNIDOS',
    start_game: 'INICIAR JUEGO',
    im_ready: 'ESTOY LISTO',
    leave_room: 'SALIR DE LA SALA',
    score: 'PUNTOS',
    round: 'RONDA',
    sparks: 'Chispas',
    verified_memory: 'Recuerdo Verificado de Chat',
    pixel_glade: 'El Claro de Píxeles de la Fogata',
    order_keepsake: 'Pedir Libro Físico de Recuerdos',
  },
  hi: {
    app_title: 'Bondfire',
    tagline: 'आपकी अपनी यादों से बने पार्टी गेम्स।',
    hero_cta_create: '१० सेकंड में पॉड बनाएं',
    hero_cta_vault: 'मेमोरी वॉल्ट देखें',
    room_code: 'रूम कोड',
    copy_link: 'कॉपी करें',
    players_joined: 'शामिल खिलाड़ी',
    start_game: 'गेम शुरू करें',
    im_ready: 'मैं तैयार हूँ',
    leave_room: 'रूम छोड़ें',
    score: 'स्कोर',
    round: 'राउंड',
    sparks: 'स्पार्क्स',
    verified_memory: 'सत्यापित चैट मेमोरी',
    pixel_glade: 'द पिक्सेल बॉन्डफायर ग्लेड',
    order_keepsake: 'हार्डकवर ईयरबुक ऑर्डर करें',
  },
};

class I18nEngine {
  constructor() {
    this.currentLocale = 'en';
  }

  setLocale(locale) {
    if (TRANSLATIONS[locale]) {
      this.currentLocale = locale;
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
      }
    }
  }

  getLocale() {
    return this.currentLocale;
  }

  // Reactive translation lookup with parameter interpolation
  t(key, params = {}) {
    const dict = TRANSLATIONS[this.currentLocale] || TRANSLATIONS.en;
    let str = dict[key] || TRANSLATIONS.en[key] || key;

    Object.keys(params).forEach((k) => {
      str = str.replace(new RegExp(`{${k}}`, 'g'), params[k]);
    });

    return str;
  }

  // Currency Formatter
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat(this.currentLocale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Relative Time Formatter
  formatRelativeDays(daysAgo) {
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    return `${daysAgo} days ago`;
  }
}

export const i18n = new I18nEngine();
