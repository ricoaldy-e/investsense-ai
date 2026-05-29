import { useTranslation } from 'react-i18next';

const LanguageToggle = ({ variant = 'inline' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.slice(0, 2) || 'id';

  const switchTo = (lang) => {
    if (lang === currentLang) return;
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  if (variant === 'sidebar') {
    return (
      <div
        className="flex items-center gap-1 border border-card-border p-1 bg-surface"
        role="group"
        aria-label="Language selection"
      >
        <button
          onClick={() => switchTo('id')}
          aria-pressed={currentLang === 'id'}
          aria-label="Switch to Bahasa Indonesia"
          className={`flex-1 py-1.5 font-mono text-[10px] tracking-[1.5px] uppercase transition-colors text-center ${
            currentLang === 'id'
              ? 'bg-accent text-bg-dark'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          ID
        </button>
        <button
          onClick={() => switchTo('en')}
          aria-pressed={currentLang === 'en'}
          aria-label="Switch to English"
          className={`flex-1 py-1.5 font-mono text-[10px] tracking-[1.5px] uppercase transition-colors text-center ${
            currentLang === 'en'
              ? 'bg-accent text-bg-dark'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1 border border-card-border p-1"
      role="group"
      aria-label="Language selection"
    >
      <button
        onClick={() => switchTo('id')}
        aria-pressed={currentLang === 'id'}
        aria-label="Switch to Bahasa Indonesia"
        className={`px-4 py-1.5 font-mono text-[11px] tracking-[1px] uppercase transition-colors ${
          currentLang === 'id'
            ? 'bg-accent text-bg-dark'
            : 'text-text-muted hover:text-text-main'
        }`}
      >
        ID
      </button>
      <button
        onClick={() => switchTo('en')}
        aria-pressed={currentLang === 'en'}
        aria-label="Switch to English"
        className={`px-4 py-1.5 font-mono text-[11px] tracking-[1px] uppercase transition-colors ${
          currentLang === 'en'
            ? 'bg-accent text-bg-dark'
            : 'text-text-muted hover:text-text-main'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
