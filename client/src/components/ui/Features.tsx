import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { PackageSearch, Search, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToPriceAlerts } from "@/lib/twilio";

const Features = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async () => {
    if (!phone) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to subscribe",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await subscribeToPriceAlerts(phone, {
        product: "teff",
        market: "addis_ababa",
        frequency: "daily"
      });
      
      toast({
        title: "Subscription Successful",
        description: "You will now receive SMS price alerts for teff",
      });
      
      setPhone("");
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
    <section className="py-8 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark">
            {t('features.title')}
          </h2>
          <p className="text-neutral-dark/70 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <PackageSearch className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-2">
              {t('features.feature1Title')}
            </h3>
            <p className="text-neutral-dark/70">
              {t('features.feature1Desc')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-2">
              {t('features.feature2Title')}
            </h3>
            <p className="text-neutral-dark/70">
              {t('features.feature2Desc')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Phone className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-2">
              {t('features.feature3Title')}
            </h3>
            <p className="text-neutral-dark/70">
              {t('features.feature3Desc')}
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-neutral-dark/70 mb-4">
            {t('features.smsUpdatePrompt')}
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <Input
                type="tel"
                placeholder={t('features.phoneNumberPlaceholder')}
                className="flex-1 rounded-l-md border border-neutral-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button 
                className="bg-primary hover:bg-primary-light text-white font-medium rounded-r-md"
                onClick={handleSubscribe}
                disabled={isSubmitting}
              >
                {isSubmitting ? "..." : t('features.subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
