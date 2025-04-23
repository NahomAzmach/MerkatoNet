import Hero from "@/components/ui/Hero";
import Features from "@/components/ui/Features";
import PriceCard from "@/components/market/PriceCard";
import ProductList from "@/components/product/ProductList";
import { useCurrentPrices } from "@/hooks/useMarketData";

const Home = () => {
  const { data: pricesData, isLoading: pricesLoading } = useCurrentPrices();

  return (
    <div>
      <Hero />
      
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark">Current Market Prices</h2>
            <p className="text-neutral-dark/70">Addis Ababa Market - Updated Today</p>
          </div>
          
          <PriceCard 
            prices={pricesData?.data || []} 
            lastUpdated={pricesData?.lastUpdated || new Date().toISOString()}
            isLoading={pricesLoading}
          />
        </div>
      </section>
      
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <ProductList />
        </div>
      </section>
      
      <Features />
    </div>
  );
};

export default Home;
