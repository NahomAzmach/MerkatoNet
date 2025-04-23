import { useTranslation } from "react-i18next";
import PriceCard from "@/components/market/PriceCard";
import PriceChart from "@/components/market/PriceChart";
import MarketInsights from "@/components/market/MarketInsights";
import { useCurrentPrices, usePriceHistory, useMarketInsights } from "@/hooks/useMarketData";

const Market = () => {
  const { t } = useTranslation();
  const { data: pricesData, isLoading: pricesLoading } = useCurrentPrices();
  const { data: historyData, isLoading: historyLoading } = usePriceHistory();
  const { data: insightsData, isLoading: insightsLoading } = useMarketInsights();

  return (
    <div className="bg-neutral-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-2">
            {t('market.title')}
          </h1>
          <p className="text-neutral-dark/70">{t('market.subtitle')}</p>
        </div>
        
        <div className="mb-8">
          <PriceCard 
            prices={pricesData?.data || []}
            lastUpdated={pricesData?.lastUpdated || new Date().toISOString()}
            isLoading={pricesLoading}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <PriceChart 
              data={historyData || []}
              isLoading={historyLoading}
            />
          </div>
          
          <div className="md:w-1/3">
            <MarketInsights 
              insights={insightsData?.data || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
