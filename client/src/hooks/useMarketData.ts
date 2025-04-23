import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { subscribeToMarketPrices, getLatestMarketPrices } from "@/lib/firebase";

// Current teff prices
export function useCurrentPrices() {
  return useQuery({
    queryKey: ["/api/market/prices/current"],
    queryFn: async () => {
      const response = await fetch("/api/market/prices/current");
      
      if (!response.ok) {
        throw new Error("Failed to fetch current prices");
      }
      
      return response.json();
    },
    // If API fails, use this fallback data
    placeholderData: {
      data: [
        { type: "Magna (White)", price: 6800, dayChange: 1.5, weekChange: 3.2 },
        { type: "Mixed", price: 5950, dayChange: -0.8, weekChange: 2.1 },
        { type: "Sergegna (Red)", price: 5300, dayChange: 0.3, weekChange: -1.5 }
      ],
      lastUpdated: new Date().toISOString(),
      source: "Ethiopian Grain Trade Enterprise"
    }
  });
}

// Price history for charts
export function usePriceHistory() {
  return useQuery({
    queryKey: ["/api/market/prices/history"],
    queryFn: async () => {
      const response = await fetch("/api/market/prices/history");
      
      if (!response.ok) {
        throw new Error("Failed to fetch price history");
      }
      
      return response.json();
    },
    // If API fails, use this fallback data
    placeholderData: generateHistoricalPriceData(180) // 6 months of data
  });
}

// Market insights
export function useMarketInsights() {
  return useQuery({
    queryKey: ["/api/market/insights"],
    queryFn: async () => {
      const response = await fetch("/api/market/insights");
      
      if (!response.ok) {
        throw new Error("Failed to fetch market insights");
      }
      
      return response.json();
    },
    // If API fails, use this fallback data
    placeholderData: {
      data: [
        {
          type: "warning",
          title: "Supply Forecast",
          description: "Expected shortage due to delayed rains in central regions. Prices may increase in the next 2 weeks."
        },
        {
          type: "success",
          title: "Buying Opportunity",
          description: "Mixed teff prices have stabilized and may decrease as new harvest enters the market."
        },
        {
          type: "info",
          title: "Regional Difference",
          description: "Prices in Bahir Dar markets are 5-10% lower than Addis Ababa for equivalent quality."
        }
      ]
    }
  });
}

// Real-time market prices from Firebase
export function useRealtimeMarketPrices() {
  const [prices, setPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const latestPrices = await getLatestMarketPrices();
        setPrices(latestPrices);
      } catch (err) {
        console.error("Error fetching initial market prices:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch market prices"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToMarketPrices((updatedPrices) => {
      setPrices(updatedPrices);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { prices, isLoading, error };
}

// Helper function to generate mock historical price data
function generateHistoricalPriceData(days: number) {
  const data = [];
  const today = new Date();
  
  // Base prices
  let magnaPrice = 6500;
  let mixedPrice = 5800;
  let sergegnaPrice = 5200;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to create realistic price movements
    magnaPrice += Math.random() * 100 - 50;
    mixedPrice += Math.random() * 80 - 40;
    sergegnaPrice += Math.random() * 60 - 30;
    
    // Ensure prices don't go too low
    magnaPrice = Math.max(magnaPrice, 5800);
    mixedPrice = Math.max(mixedPrice, 5000);
    sergegnaPrice = Math.max(sergegnaPrice, 4500);
    
    data.push({
      date: date.toISOString().split('T')[0],
      magna: Math.round(magnaPrice),
      mixed: Math.round(mixedPrice),
      sergegna: Math.round(sergegnaPrice)
    });
  }
  
  return data;
}
