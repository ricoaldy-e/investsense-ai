import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SystemError = ({ onReset }) => {
  const { t } = useTranslation();
  const handleReturn = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center px-6 text-center">
      
      <p className="font-mono text-[10px] tracking-[3px] uppercase text-text-muted mb-6">
        {t('error.system_error')}
      </p>

      
      <h1 className="font-display text-[36px] md:text-[48px] font-light text-text-main tracking-[2px] uppercase leading-none mb-4">
        {t('error.something_went_wrong')}
      </h1>

      
      <div className="w-16 h-px bg-card-border mb-8" />

      
      <p className="font-body text-[16px] md:text-[18px] text-text-secondary leading-relaxed max-w-md mb-12">
        {t('error.unexpected_condition')}
      </p>

      
      <div className="flex flex-col sm:flex-row gap-4">
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2.5 font-mono text-[11px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-8 py-3 hover:bg-accent hover:text-bg-dark transition-all duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t('common.try_again')}
          </button>
        )}
        <button
          onClick={handleReturn}
          className="inline-flex items-center justify-center gap-2.5 font-mono text-[11px] tracking-[2px] uppercase text-bg-dark bg-text-main rounded-full px-8 py-3 hover:bg-text-secondary transition-all duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('common.return_to_platform')}
        </button>
      </div>
    </div>
  );
};

export default SystemError;
