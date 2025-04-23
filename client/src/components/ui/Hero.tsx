import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white overflow-hidden">
      <div className="container mx-auto px-4 py-10 md:py-16 flex flex-col md:flex-row">
        <div className="md:w-1/2 z-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {t('home.title')}
          </h1>
          <p className="text-lg mb-6">
            {t('home.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg"
              className="bg-secondary hover:bg-secondary-light text-neutral-dark font-medium"
            >
              {t('home.registerNow')}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border border-white hover:bg-white/10 text-white font-medium"
            >
              {t('home.learnMore')}
            </Button>
          </div>
          
          <div className="mt-6 flex items-center">
            <MessageSquare className="text-secondary mr-2 h-5 w-5" />
            <p className="text-sm">
              {t('home.smsPrompt')}
            </p>
          </div>
        </div>
        
        <div className="md:w-1/2 mt-8 md:mt-0 relative">
          <img 
            src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1" 
            alt="Ethiopian farmers with produce" 
            className="rounded-lg shadow-lg object-cover md:ml-auto w-full max-w-md h-auto" 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
