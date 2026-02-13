/**
 * Lightweight i18n framework.
 * Translations stored as JSON dictionaries keyed by locale.
 * Default locale: "en". Supported: en, es, fr, de, ja, zh, ar, pt.
 */

export type Locale = "en" | "es" | "fr" | "de" | "ja" | "zh" | "ar" | "pt";

export const SUPPORTED_LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "pt", label: "Português" },
];

export const DEFAULT_LOCALE: Locale = "en";

type TranslationDict = Record<string, string>;
type Translations = Record<Locale, TranslationDict>;

const translations: Translations = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.explore": "Explore",
    "nav.messages": "Messages",
    "nav.collaborations": "Collaborations",
    "nav.ai_studio": "AI Studio",
    "nav.settings": "Settings",
    "nav.help": "Help",
    "auth.sign_in": "Sign In",
    "auth.sign_up": "Sign Up",
    "auth.sign_out": "Sign Out",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.welcome_back": "Welcome back",
    "auth.create_account": "Create your account",
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.search": "Search",
    "common.no_results": "No results found",
    "common.offline": "You are offline",
  },
  es: {
    "nav.dashboard": "Panel",
    "nav.explore": "Explorar",
    "nav.messages": "Mensajes",
    "nav.collaborations": "Colaboraciones",
    "nav.ai_studio": "Estudio IA",
    "nav.settings": "Configuración",
    "nav.help": "Ayuda",
    "auth.sign_in": "Iniciar sesión",
    "auth.sign_up": "Registrarse",
    "auth.sign_out": "Cerrar sesión",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.welcome_back": "Bienvenido de vuelta",
    "auth.create_account": "Crea tu cuenta",
    "common.loading": "Cargando...",
    "common.error": "Algo salió mal",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.search": "Buscar",
    "common.no_results": "No se encontraron resultados",
    "common.offline": "Estás sin conexión",
  },
  fr: {
    "nav.dashboard": "Tableau de bord",
    "nav.explore": "Explorer",
    "nav.messages": "Messages",
    "nav.collaborations": "Collaborations",
    "nav.ai_studio": "Studio IA",
    "nav.settings": "Paramètres",
    "nav.help": "Aide",
    "auth.sign_in": "Se connecter",
    "auth.sign_up": "S'inscrire",
    "auth.sign_out": "Se déconnecter",
    "common.loading": "Chargement...",
    "common.error": "Une erreur est survenue",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.offline": "Vous êtes hors ligne",
  },
  de: {
    "nav.dashboard": "Dashboard",
    "nav.explore": "Entdecken",
    "nav.messages": "Nachrichten",
    "nav.collaborations": "Zusammenarbeit",
    "nav.ai_studio": "KI-Studio",
    "nav.settings": "Einstellungen",
    "common.loading": "Laden...",
    "common.error": "Etwas ist schiefgelaufen",
    "common.offline": "Sie sind offline",
  },
  ja: {
    "nav.dashboard": "ダッシュボード",
    "nav.explore": "探索",
    "nav.messages": "メッセージ",
    "common.loading": "読み込み中...",
    "common.offline": "オフラインです",
  },
  zh: {
    "nav.dashboard": "仪表板",
    "nav.explore": "探索",
    "nav.messages": "消息",
    "common.loading": "加载中...",
    "common.offline": "您处于离线状态",
  },
  ar: {
    "nav.dashboard": "لوحة التحكم",
    "nav.explore": "استكشاف",
    "nav.messages": "الرسائل",
    "common.loading": "جار التحميل...",
    "common.offline": "أنت غير متصل",
  },
  pt: {
    "nav.dashboard": "Painel",
    "nav.explore": "Explorar",
    "nav.messages": "Mensagens",
    "common.loading": "Carregando...",
    "common.offline": "Você está offline",
  },
};

let currentLocale: Locale = DEFAULT_LOCALE;

export function setLocale(locale: Locale) {
  currentLocale = locale;
  if (typeof window !== "undefined") {
    localStorage.setItem("colab_locale", locale);
    document.documentElement.lang = locale;
    if (locale === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }
}

export function getLocale(): Locale {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("colab_locale") as Locale | null;
    if (stored && SUPPORTED_LOCALES.some((l) => l.code === stored)) {
      currentLocale = stored;
    }
  }
  return currentLocale;
}

export function t(key: string, locale?: Locale): string {
  const loc = locale || currentLocale;
  return translations[loc]?.[key] || translations.en[key] || key;
}
