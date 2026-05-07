import WarningBanner from '../components/WarningBanner';
import StockChartCard from '../components/StockChartCard';
import MarketNewsCard from '../components/MarketNewsCard';
import SentimentAnalysisCard from '../components/SentimentAnalysisCard';
import AIInsightCard from '../components/AIInsightCard';
import RiskAnalysisCard from '../components/RiskAnalysisCard';

const Dashboard = () => {
  return (
    <div className="pb-24 md:pb-0">
      <WarningBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column (Main Area) */}
        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
          <div className="flex-none">
            <StockChartCard />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
            <SentimentAnalysisCard />
            <AIInsightCard />
          </div>
        </div>

        {/* Right Column (Side Area) */}
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex-none">
            <MarketNewsCard />
          </div>
          <div className="flex-1">
            <RiskAnalysisCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
