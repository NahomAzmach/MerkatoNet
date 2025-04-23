import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MessageSquare, LogIn } from "lucide-react";
import { signInWithGoogle } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/auth/AuthModal";

const Hero = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "Signed in successfully with Google",
      });
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive"
      });
    }
  };

  const handleRegisterClick = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

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
              className="bg-secondary hover:bg-secondary-light text-neutral-dark font-medium flex items-center"
              onClick={handleRegisterClick}
            >
              <LogIn className="mr-2 h-5 w-5" />
              {t('home.registerNow')}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border border-white hover:bg-white/10 text-white font-medium"
              onClick={handleGoogleSignIn}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('common.login')} with Google
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
      
      {showAuthModal && <AuthModal onClose={closeAuthModal} />}
    </section>
  );
};

export default Hero;
