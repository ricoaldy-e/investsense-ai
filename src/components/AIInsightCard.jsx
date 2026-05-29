import { Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

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
        
        <div className="border-l-2 border-accent/40 pl-4 py-1">
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-2">
            {isPro ? t('ai_insight_card.signal') : t('ai_insight_card.what_we_see')}
          </p>
          <div className={`${isPro ? 'font-mono text-[12px]' : 'font-body text-[14px]'} text-text-secondary leading-relaxed`}>
            {observation ? (
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  strong: ({node, ...props}) => <span className="text-text-main font-medium" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                }}
              >
                {observation}
              </ReactMarkdown>
            ) : 'No observation data available.'}
          </div>
        </div>

        
        <div className="border-l-2 border-accent/40 pl-4 py-1">
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-2">
            {isPro ? t('ai_insight_card.action') : t('ai_insight_card.what_you_can_do')}
          </p>
          <div className={`${isPro ? 'font-mono text-[12px]' : 'font-body text-[14px]'} text-text-secondary leading-relaxed`}>
            {suggestedPlan ? (
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  strong: ({node, ...props}) => <span className="text-text-main font-medium" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                }}
              >
                {suggestedPlan}
              </ReactMarkdown>
            ) : 'No plan data available.'}
          </div>
        </div>
      </div>

      
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
