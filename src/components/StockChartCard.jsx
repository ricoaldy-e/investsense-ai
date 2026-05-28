import { useState, useEffect, useRef } from 'react';
import { Info, Loader2, AlertCircle } from 'lucide-react';
import { CardOverlayLoader } from './ui/LoadingSpinner';
import { createChart, CrosshairMode, CandlestickSeries } from 'lightweight-charts';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Tooltip from './Tooltip';
import useDashboardStore from '../store/useDashboardStore';

// ─── Price formatter ───────────────────────────────────────────────────────
const formatPrice = (value, currency) => {
  if (value == null) return 'N/A';
  if (currency === 'IDR') return `Rp${value.toLocaleString('id-ID')}`;
  return `$${value.toFixed(2)}`;
};

// ─── Dark chart theme — matched to design tokens in index.css ─────────────
const CHART_OPTIONS = {
  layout: {
    background: { color: '#18181b' },
    textColor: '#52525b',
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: 11,
  },
  grid: {
    vertLines: { color: '#1f1f1f' },
    horzLines: { color: '#1f1f1f' },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
    vertLine: {
      color: '#3f3f46',
      width: 1,
      style: 2,
      labelBackgroundColor: '#27272a',
    },
    horzLine: {
      color: '#3f3f46',
      width: 1,
      style: 2,
      labelBackgroundColor: '#27272a',
    },
  },
  rightPriceScale: {
    borderColor: '#27272a',
    textColor: '#52525b',
  },
  timeScale: {
    borderColor: '#27272a',
    timeVisible: true,
    secondsVisible: false,
    fixLeftEdge: true,
    fixRightEdge: true,
  },
  handleScroll: true,
  handleScale: true,
};

// ─── Candle colors — success/danger from design tokens ────────────────────
const CANDLE_OPTIONS = {
  upColor: '#5ba88a',
  downColor: '#e85d5d',
  borderUpColor: '#5ba88a',
  borderDownColor: '#e85d5d',
  wickUpColor: '#5ba88a',
  wickDownColor: '#e85d5d',
};

// ─── Component ────────────────────────────────────────────────────────────
const StockChartCard = ({ data, mode }) => {
  const { t } = useTranslation();
  const activeTicker = useDashboardStore((s) => s.activeTicker);

  // ─── Chart DOM & instance refs ────────────────────────────────────────
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const seriesRef    = useRef(null);

  // ─── History fetch state ──────────────────────────────────────────────
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [chartError, setChartError]               = useState(null);

  // ─── Create chart once on mount; destroy on unmount ──────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      ...CHART_OPTIONS,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    const series = chart.addSeries(CandlestickSeries, CANDLE_OPTIONS);

    chartRef.current = chart;
    seriesRef.current = series;

    // Responsive: track container width changes
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !chartRef.current) return;
      chartRef.current.applyOptions({ width: entry.contentRect.width });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chartRef.current?.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // ─── Fetch OHLC history whenever activeTicker changes ────────────────
  useEffect(() => {
    if (!activeTicker || !seriesRef.current) return;

    let cancelled = false;
    setIsFetchingHistory(true);
    setChartError(null);

    const fetchHistory = async () => {
      try {
        const response = await api.get(`/stocks/history/${activeTicker}`);
        if (cancelled) return;

        const raw = response.data?.data ?? [];

        // Map to lightweight-charts OHLC format.
        // time MUST be 'YYYY-MM-DD' — lightweight-charts rejects full ISO strings.
        const candles = raw
          .map((item) => ({
            time:  item.date.split('T')[0], // "2026-04-27T02:00:00.000Z" → "2026-04-27"
            open:  Number(item.open),
            high:  Number(item.high),
            low:   Number(item.low),
            close: Number(item.close),
          }))
          .sort((a, b) => new Date(a.time) - new Date(b.time)); // oldest → newest

        seriesRef.current.setData(candles);
        chartRef.current?.timeScale().fitContent();
      } catch {
        if (!cancelled) setChartError('Failed to load chart data.');
      } finally {
        if (!cancelled) setIsFetchingHistory(false);
      }
    };

    fetchHistory();
    return () => { cancelled = true; };
  }, [activeTicker]);

  // ─── Derived indicator values from stockDetail data ───────────────────
  const rsi    = data?.metrics?.rsi14 ?? 0;
  const isPro  = mode === 'pro';

  const rsiLabel    = rsi >= 70 ? t('stock_chart.overbought') : rsi <= 30 ? t('stock_chart.oversold') : t('stock_chart.stable');
  const rsiColor    = rsi >= 70 ? 'text-danger' : rsi <= 30 ? 'text-success' : 'text-text-main';
  const rsiBarWidth = `${Math.min(rsi, 100)}%`;

  const trendLabel    = data?.trend === 'up' ? t('stock_chart.upward_trend') : data?.trend === 'down' ? t('stock_chart.downward_pressure') : t('stock_chart.sideways');
  const trendColor    = data?.trend === 'up' ? 'text-success' : data?.trend === 'down' ? 'text-danger' : 'text-text-muted';
  const trendBarWidth = data?.trend === 'up' ? '85%' : data?.trend === 'down' ? '35%' : '50%';

  const priceChangeColor  = (data?.percentChange ?? 0) >= 0 ? 'text-success' : 'text-danger';
  const priceChangePrefix = (data?.percentChange ?? 0) >= 0 ? '+' : '';

  const rsiTooltip = isPro ? t('stock_chart.rsi_tooltip_pro') : t('stock_chart.rsi_tooltip_beginner');
  const trendTooltip = isPro ? t('stock_chart.trend_tooltip_pro') : t('stock_chart.trend_tooltip_beginner');

  // RSI descriptions
  const rsiDesc = isPro
    ? (rsi >= 70 ? t('stock_chart.rsi_desc_pro_high') : rsi <= 30 ? t('stock_chart.rsi_desc_pro_low') : t('stock_chart.rsi_desc_pro_neutral'))
    : (rsi >= 70 ? t('stock_chart.rsi_desc_beginner_high') : rsi <= 30 ? t('stock_chart.rsi_desc_beginner_low') : t('stock_chart.rsi_desc_beginner_neutral'));

  // Trend descriptions
  const trendDesc = isPro
    ? (data?.trend === 'up' ? t('stock_chart.trend_desc_pro_up') : data?.trend === 'down' ? t('stock_chart.trend_desc_pro_down') : t('stock_chart.trend_desc_pro_side'))
    : (data?.trend === 'up' ? t('stock_chart.trend_desc_beginner_up') : data?.trend === 'down' ? t('stock_chart.trend_desc_beginner_down') : t('stock_chart.trend_desc_beginner_side'));

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 flex flex-col overflow-hidden">

      {/* ── Stock header (rendered when full data arrives) ── */}
      {data && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-surface border border-card-border flex items-center justify-center shrink-0">
              <span className="font-mono text-[11px] text-text-muted tracking-[1px]">{data.ticker?.[0]}</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-[20px] font-medium text-text-main tracking-[0.5px] mb-1 truncate">
                {data.name} ({data.ticker})
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[14px] text-text-main tracking-[0.5px]">
                  {formatPrice(data.currentPrice, data.currency)}
                </span>
                <span className={`font-mono text-[12px] ${priceChangeColor} tracking-[0.5px]`}>
                  {priceChangePrefix}{data.percentChange?.toFixed(2)}%
                </span>
                {isPro && data.priceChange != null && (
                  <span className="font-mono text-[10px] text-text-muted tracking-[1px]">
                    {priceChangePrefix}{formatPrice(Math.abs(data.priceChange || 0), data.currency)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pro mode: extra metrics */}
          {isPro && (
            <div className="flex items-center gap-3 flex-wrap">
              {data.metrics?.peRatio != null && (
                <div className="border border-card-border px-3 py-1.5">
                  <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted block">P/E</span>
                  <span className="font-mono text-[12px] text-text-main">{data.metrics.peRatio}</span>
                </div>
              )}
              {data.metrics?.volatility != null && (
                <div className="border border-card-border px-3 py-1.5">
                  <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted block">VOL</span>
                  <span className="font-mono text-[12px] text-text-main">{data.metrics.volatility}</span>
                </div>
              )}
              <div className="border border-card-border px-3 py-1.5">
                <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted block">RSI</span>
                <span className={`font-mono text-[12px] ${rsiColor}`}>{rsi ? rsi.toFixed(1) : 'N/A'}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Skeleton header while data loads (ticker known, data pending) ── */}
      {!data && activeTicker && (
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <div className="w-10 h-10 bg-surface border border-card-border flex items-center justify-center shrink-0">
            <span className="font-mono text-[11px] text-text-muted tracking-[1px]">{activeTicker[0]}</span>
          </div>
          <div>
            <p className="font-mono text-[13px] tracking-[2px] uppercase text-accent font-medium">{activeTicker}</p>
            <p className="font-mono text-[10px] text-text-muted mt-0.5 tracking-[1px]">Fetching analysis data…</p>
          </div>
        </div>
      )}

      {/* ── Candlestick Chart Container ── */}
      <div className="relative w-full mb-6 rounded-sm overflow-hidden" style={{ height: '320px' }}>
        {/* lightweight-charts mounts directly into this div */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Loading overlay */}
        {isFetchingHistory && (
          <CardOverlayLoader label="Loading chart…" />
        )}

        {/* Chart fetch error */}
        {chartError && !isFetchingHistory && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 text-text-muted" />
            <p className="font-mono text-[10px] tracking-[1px] uppercase text-danger">{chartError}</p>
          </div>
        )}

        {/* No ticker state — chart empty on initial load */}
        {!activeTicker && !isFetchingHistory && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
              Search a stock to view chart
            </p>
          </div>
        )}
      </div>

      {/* ── RSI / Trend Indicators — only when full data is available ── */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 border-t border-card-border pt-6">

          {/* RSI */}
          <div>
            <div className="flex justify-between items-center mb-3 gap-2">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="font-mono text-[12px] tracking-[0.5px] text-text-secondary leading-tight truncate">
                  {isPro ? t('stock_chart.rsi_14') : t('stock_chart.price_momentum')}
                </span>
                <Tooltip content={rsiTooltip}>
                  <button className="text-text-muted hover:text-accent transition-colors flex-shrink-0 focus:outline-none flex items-center">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>
              </div>
              <div className={`font-mono text-[12px] ${rsiColor} tracking-[0.5px] text-right shrink-0`}>
                {isPro
                  ? <>{rsi.toFixed(1)} <span className="text-text-muted">/ 100</span></>
                  : rsiLabel
                }
              </div>
            </div>
            <div className="h-1.5 w-full bg-surface overflow-hidden flex mb-2">
              <div className="h-full bg-accent/40 transition-all duration-500" style={{ width: rsiBarWidth }} />
            </div>
            <p className="font-body text-[12px] text-text-muted mt-2 leading-relaxed">
              {rsiDesc}
            </p>
          </div>

          {/* Price Trend */}
          <div>
            <div className="flex justify-between items-center mb-3 gap-2">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="font-mono text-[12px] tracking-[0.5px] text-text-secondary leading-tight truncate">
                  {isPro ? t('stock_chart.trend_analysis') : t('stock_chart.price_direction')}
                </span>
                <Tooltip content={trendTooltip}>
                  <button className="text-text-muted hover:text-accent transition-colors flex-shrink-0 focus:outline-none flex items-center">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>
              </div>
              <div className={`font-mono text-[12px] ${trendColor} tracking-[0.5px] text-right shrink-0`}>
                {trendLabel}
              </div>
            </div>
            <div className="h-1.5 w-full bg-surface overflow-hidden mb-2">
              <div className="h-full bg-accent/60 transition-all duration-500" style={{ width: trendBarWidth }} />
            </div>
            <p className="font-body text-[12px] text-text-muted mt-2 leading-relaxed">
              {trendDesc}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default StockChartCard;
