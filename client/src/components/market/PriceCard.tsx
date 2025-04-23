import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { History, Share, MessageSquare } from "lucide-react";
import { subscribeToPriceAlerts } from "@/lib/twilio";

interface PriceData {
  type: string;
  price: number;
  dayChange: number;
  weekChange: number;
}

interface PriceCardProps {
  prices: PriceData[];
  lastUpdated: string;
  isLoading: boolean;
}

const PriceCard = ({ prices, lastUpdated, isLoading }: PriceCardProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showSmsDialog, setShowSmsDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to validate phone number format
  const validatePhoneNumber = (phone: string): boolean => {
    // Basic validation for international format with + and country code
    return /^\+\d{1,4}\s?\d+$/.test(phone);
  };

  const handleSmsSubscribe = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a valid phone number to receive SMS alerts",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a phone number with country code (e.g., +251 91 234 5678)",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await subscribeToPriceAlerts(phoneNumber, {
        product: "teff",
        market: "addis_ababa",
        frequency: "daily"
      });
      
      toast({
        title: "Subscription Successful",
        description: "You will now receive SMS price alerts for teff",
      });
      
      setShowSmsDialog(false);
    } catch (error) {
      console.error("SMS subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: "Failed to subscribe to SMS alerts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="bg-primary text-white py-3 px-4">
          <div className="flex justify-between items-center">
            <CardTitle className="font-medium">{t('market.teffPrices')}</CardTitle>
            <Button variant="ghost" className="text-white hover:text-secondary-light flex items-center text-sm font-medium h-9 px-2">
              <History className="mr-1 h-4 w-4" /> {t('market.viewHistory')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-neutral-light border-b border-neutral-medium">
                  <th className="px-4 py-3 text-left text-sm font-medium">{t('market.type')}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">{t('market.price')}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">{t('market.dayChange')}</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">{t('market.weekChange')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="border-b border-neutral-medium">
                    <td colSpan={4} className="px-4 py-4 text-center">Loading price data...</td>
                  </tr>
                ) : prices.length > 0 ? (
                  prices.map((item, index) => (
                    <tr key={index} className="border-b border-neutral-medium hover:bg-neutral-light">
                      <td className="px-4 py-4 text-sm">{item.type}</td>
                      <td className="px-4 py-4 text-sm text-right font-medium">{item.price.toLocaleString()}</td>
                      <td className={`px-4 py-4 text-sm text-right font-medium ${item.dayChange >= 0 ? 'text-success' : 'text-error'}`}>
                        {item.dayChange >= 0 ? '+' : ''}{item.dayChange}%
                      </td>
                      <td className={`px-4 py-4 text-sm text-right font-medium ${item.weekChange >= 0 ? 'text-success' : 'text-error'}`}>
                        {item.weekChange >= 0 ? '+' : ''}{item.weekChange}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-neutral-medium">
                    <td colSpan={4} className="px-4 py-4 text-center">No price data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 border-t border-neutral-medium bg-neutral-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-sm text-neutral-dark/70">{t('market.source')}</span>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="default" 
              className="flex items-center text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light"
              onClick={() => setShowSmsDialog(true)}
            >
              <MessageSquare className="h-4 w-4 mr-1" /> {t('market.getSmsAlert')}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center text-sm border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary/5"
            >
              <Share className="h-4 w-4 mr-1" /> {t('common.share')}
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={showSmsDialog} onOpenChange={setShowSmsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Subscribe to SMS Price Alerts</DialogTitle>
            <DialogDescription>
              Get real-time price updates via SMS
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+251 91 234 5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter your phone number with country code to receive daily teff price updates.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSmsDialog(false)}>Cancel</Button>
            <Button onClick={handleSmsSubscribe} disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PriceCard;
