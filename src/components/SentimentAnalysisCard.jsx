import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SentimentAnalysisCard = ({ data, mode }) => {
  const { t } = useTranslation();
  if (!data) return null;

  const { positive = 0, neutral = 0, negative = 0 } = data.sentiment || {};

  const dominant = positive >= neutral && positive >= negative
    ? 'positive'
    : neutral >= positive && neutral >= negative
      ? 'neutral'
      : 'negative';

  const isPro = mode === 'pro';

  const dominantLabel = dominant === 'positive'
    ? (isPro ? t('sentiment_card.bullish') : t('sentiment_card.positive_outlook'))
    : dominant === 'negative'
      ? (isPro ? t('sentiment_card.bearish') : t('sentiment_card.negative_outlook'))
      : (isPro ? t('sentiment_card.neutral') : t('sentiment_card.balanced_outlook'));

  const dominantStyle = dominant === 'positive' ? 'text-success' : dominant === 'negative' ? 'text-danger' : 'text-text-main';

  const descText = dominant === 'positive'
    ? t('sentiment_card.desc_bullish')
    : dominant === 'negative'
      ? t('sentiment_card.desc_bearish')
      : t('sentiment_card.desc_neutral');

  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="w-4 h-4 text-accent" />
          <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-accent">
            {isPro ? t('sentiment_card.title_pro') : t('sentiment_card.title_beginner')}
          </h3>
        </div>
        {isPro && (
          <span className={`font-mono text-[10px] tracking-[1.5px] uppercase ${dominantStyle}`}>
            {dominantLabel}
          </span>
        )}
      </div>

      <div className="space-y-5 flex-1">
        {/* Positive */}
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] tracking-[1px] uppercase text-text-muted w-16">
            {isPro ? t('sentiment_card.bull') : t('sentiment_card.positive')}
          </span>
          <div className="flex-1 h-1.5 bg-surface overflow-hidden">
            <div className="h-full bg-success/50 transition-all duration-500" style={{ width: `${positive}%` }}></div>
          </div>
          <span className="font-mono text-[11px] text-text-muted w-8 text-right">{positive}%</span>
        </div>

        {/* Neutral */}
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] tracking-[1px] uppercase text-text-main w-16">{t('sentiment_card.neutral')}</span>
          <div className="flex-1 h-1.5 bg-surface overflow-hidden">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${neutral}%` }}></div>
          </div>
          <span className="font-mono text-[11px] text-text-muted w-8 text-right">{neutral}%</span>
        </div>

        {/* Negative */}
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] tracking-[1px] uppercase text-text-muted w-16">
            {isPro ? t('sentiment_card.bear') : t('sentiment_card.negative')}
          </span>
          <div className="flex-1 h-1.5 bg-surface overflow-hidden">
            <div className="h-full bg-danger/50 transition-all duration-500" style={{ width: `${negative}%` }}></div>
          </div>
          <span className="font-mono text-[11px] text-text-muted w-8 text-right">{negative}%</span>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-hairline">
        <p className="font-body text-[14px] text-text-secondary leading-relaxed">
          {isPro
            ? <>{t('sentiment_card.aggregated_ratio')} <span className="font-mono text-[12px] text-text-main">{positive}B / {neutral}N / {negative}S</span>. {t('sentiment_card.dominant_signal')} <span className={dominantStyle}>{dominantLabel}</span> {t('sentiment_card.for_ticker')} {data.ticker}.</>
            : <>{t('sentiment_card.beginner_desc_prefix')}{data.ticker}{t('sentiment_card.beginner_desc_suffix')}<span className={dominantStyle}>{dominantLabel}</span>. {descText}</>
          }
        </p>
      </div>
    </div>
  );
};

export default SentimentAnalysisCard;
