import { Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AIInsightCard = ({ data, mode }) => {
  const { t } = useTranslation();
  if (!data) return null;

  const { observation, suggestedPlan } = data.aiInsights || {};
  const isPro = mode === 'pro';

  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <Bot className="w-4 h-4 text-accent" />
          <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-accent">
            {isPro ? t('ai_insight_card.title_pro') : t('ai_insight_card.title_beginner')}
          </h3>
        </div>
        {isPro && (
          <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted border border-card-border px-2 py-1">
            {t('ai_insight_card.auto_generated')}
          </span>
        )}
      </div>

      <div className="space-y-5 flex-1">
        {/* Observation */}
        <div className="border-l-2 border-accent/40 pl-4 py-1">
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-2">
            {isPro ? t('ai_insight_card.signal') : t('ai_insight_card.what_we_see')}
          </p>
          <p className={`${isPro ? 'font-mono text-[12px]' : 'font-body text-[14px]'} text-text-secondary leading-relaxed`}>
            {observation || 'No observation data available.'}
          </p>
        </div>

        {/* Suggested Plan */}
        <div className="border-l-2 border-accent/40 pl-4 py-1">
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-2">
            {isPro ? t('ai_insight_card.action') : t('ai_insight_card.what_you_can_do')}
          </p>
          <p className={`${isPro ? 'font-mono text-[12px]' : 'font-body text-[14px]'} text-text-secondary leading-relaxed`}>
            {suggestedPlan || 'No plan data available.'}
          </p>
        </div>
      </div>

      {/* Beginner: extra explainer */}
      {!isPro && (
        <div className="mt-5 pt-4 border-t border-hairline">
          <p className="font-body text-[12px] text-text-muted italic leading-relaxed">
            {t('ai_insight_card.disclaimer')}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIInsightCard;
