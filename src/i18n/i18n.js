import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';

// ─── Detect initial language ─────────────────────────────────────────────────
// Priority: localStorage → browser language → fallback 'en' (English default)
const detectLanguage = () => {
  const saved = localStorage.getItem('lang');
  if (saved === 'en' || saved === 'id') return saved;
  const browser = navigator.language?.slice(0, 2);
  if (browser === 'id') return 'id';
  return 'en'; // Default to English
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    lng: detectLanguage(),
    fallbackLng: 'en',
    interpolation: {
      // React already escapes values by default
      escapeValue: false,
    },
    // Disable missing key warnings in production
    saveMissing: false,
    missingKeyHandler: () => {},
  });

export default i18n;
