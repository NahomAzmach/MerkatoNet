import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface PriceHistoryPoint {
  date: string;
  magna: number;
  mixed: number;
  sergegna: number;
}

interface PriceChartProps {
  data: PriceHistoryPoint[];
  isLoading: boolean;
}

const PriceChart = ({ data, isLoading }: PriceChartProps) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("1W");
  
  // Filter data based on selected time range
  const getFilteredData = () => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case "1W":
        startDate.setDate(now.getDate() - 7);
        break;
      case "1M":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6M":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1Y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    return data.filter(point => new Date(point.date) >= startDate);
  };
  
  const filteredData = getFilteredData();

  const handleExport = () => {
    // In a real app, this would generate a CSV file with the price data
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Magna (White),Mixed,Sergegna (Red)\n" +
      filteredData.map(row => 
        `${row.date},${row.magna},${row.mixed},${row.sergegna}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `teff_prices_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-white rounded-lg shadow-md p-4">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="font-heading text-xl font-bold">
          {t('market.priceTrends')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="rounded-lg overflow-hidden border border-neutral-medium">
          <div className="h-64 bg-white p-4">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <p>Loading price data...</p>
              </div>
            ) : data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="magna" 
                    name="White Teff (Magna)" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2} 
                    dot={{ r: 2 }} 
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mixed" 
                    name="Mixed Teff" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2} 
                    dot={{ r: 2 }} 
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sergegna" 
                    name="Red Teff (Sergegna)" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={2} 
                    dot={{ r: 2 }} 
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p>No price history data available</p>
              </div>
            )}
          </div>
          
          <div className="bg-neutral-light border-t border-neutral-medium p-3 flex justify-between items-center flex-wrap gap-2">
            <div className="flex space-x-3">
              <Button 
                variant={timeRange === "1W" ? "default" : "outline"} 
                className={`px-3 py-1 text-sm rounded-full ${
                  timeRange === "1W" 
                    ? "bg-primary text-white" 
                    : "border-neutral-medium text-neutral-dark bg-white"
                }`}
                onClick={() => setTimeRange("1W")}
              >
                1W
              </Button>
              <Button 
                variant={timeRange === "1M" ? "default" : "outline"} 
                className={`px-3 py-1 text-sm rounded-full ${
                  timeRange === "1M" 
                    ? "bg-primary text-white" 
                    : "border-neutral-medium text-neutral-dark bg-white"
                }`}
                onClick={() => setTimeRange("1M")}
              >
                1M
              </Button>
              <Button 
                variant={timeRange === "3M" ? "default" : "outline"} 
                className={`px-3 py-1 text-sm rounded-full ${
                  timeRange === "3M" 
                    ? "bg-primary text-white" 
                    : "border-neutral-medium text-neutral-dark bg-white"
                }`}
                onClick={() => setTimeRange("3M")}
              >
                3M
              </Button>
              <Button 
                variant={timeRange === "6M" ? "default" : "outline"} 
                className={`px-3 py-1 text-sm rounded-full ${
                  timeRange === "6M" 
                    ? "bg-primary text-white" 
                    : "border-neutral-medium text-neutral-dark bg-white"
                }`}
                onClick={() => setTimeRange("6M")}
              >
                6M
              </Button>
              <Button 
                variant={timeRange === "1Y" ? "default" : "outline"} 
                className={`px-3 py-1 text-sm rounded-full ${
                  timeRange === "1Y" 
                    ? "bg-primary text-white" 
                    : "border-neutral-medium text-neutral-dark bg-white"
                }`}
                onClick={() => setTimeRange("1Y")}
              >
                1Y
              </Button>
            </div>
            <div>
              <Button 
                variant="ghost" 
                className="text-sm text-primary flex items-center"
                onClick={handleExport}
              >
                <Download className="mr-1 h-4 w-4" /> {t('market.exportData')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
