import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Map, BarChart2 } from "lucide-react";

interface Insight {
  type: "warning" | "success" | "info";
  title: string;
  description: string;
}

interface MarketInsightsProps {
  insights: Insight[];
}

const MarketInsights = ({ insights }: MarketInsightsProps) => {
  const { t } = useTranslation();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "success":
        return <AlertCircle className="h-5 w-5 text-success" />;
      case "info":
      default:
        return <Map className="h-5 w-5 text-primary" />;
    }
  };

  const getInsightBorderColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-warning";
      case "success":
        return "border-success";
      case "info":
      default:
        return "border-primary";
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-warning/10";
      case "success":
        return "bg-success/10";
      case "info":
      default:
        return "bg-primary/10";
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-md p-4">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="font-heading text-xl font-bold">
          {t('market.marketInsights')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-3 ${getInsightBgColor(insight.type)} rounded-r-md
                border-l-4 ${getInsightBorderColor(insight.type)}`}
              >
                <div className="flex items-start gap-2">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 bg-neutral-light rounded-md text-center">
              <p>No market insights available</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-0 pt-4 pb-0">
        <Button className="w-full bg-primary hover:bg-primary-light text-white font-medium px-4 py-2 rounded-md flex items-center justify-center">
          <BarChart2 className="h-4 w-4 mr-1" /> {t('market.fullReport')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MarketInsights;
