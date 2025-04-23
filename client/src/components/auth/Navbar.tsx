import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { changeLanguage, getCurrentLanguage } from "@/lib/i18n";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Recycle, Menu, Globe, LogIn, User } from "lucide-react";
import { signInWithGoogle } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage() === 'am' ? 'AM' : 'EN');

  const toggleLanguage = () => {
    const newLang = currentLang === 'EN' ? 'AM' : 'EN';
    setCurrentLang(newLang);
    changeLanguage(newLang === 'EN' ? 'en' : 'am');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

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

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <nav className="bg-primary shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Recycle className="text-white mr-2" />
              <Link href="/" className="text-white font-heading font-bold text-lg md:text-xl">
                {t('common.appName')}
              </Link>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={toggleLanguage}
                className="p-2 text-white flex items-center mr-4"
              >
                <Globe className="h-5 w-5 mr-1" />
                <span>{currentLang}</span>
              </button>
              
              {/* Mobile menu button */}
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden text-white p-2 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Desktop navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/" className={`text-white hover:text-secondary-light px-3 py-2 rounded-md ${location === '/' ? 'bg-primary-dark' : ''}`}>
                  {t('common.home')}
                </Link>
                <Link href="/market" className={`text-white hover:text-secondary-light px-3 py-2 rounded-md ${location === '/market' ? 'bg-primary-dark' : ''}`}>
                  {t('common.market')}
                </Link>
                <Link href="/products" className={`text-white hover:text-secondary-light px-3 py-2 rounded-md ${location === '/products' ? 'bg-primary-dark' : ''}`}>
                  {t('common.products')}
                </Link>
                <Link href="/about" className={`text-white hover:text-secondary-light px-3 py-2 rounded-md ${location === '/about' ? 'bg-primary-dark' : ''}`}>
                  {t('common.about')}
                </Link>
                
                {!isLoading && (
                  user ? (
                    <Link href="/profile" className="bg-secondary text-neutral-dark font-medium px-4 py-2 rounded-md hover:bg-secondary-light flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {t('common.profile')}
                    </Link>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleLoginClick}
                        className="bg-secondary text-neutral-dark font-medium hover:bg-secondary-light flex items-center"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        {t('common.login')}
                      </Button>
                      <Button
                        onClick={handleGoogleSignIn}
                        className="bg-white text-primary border border-white font-medium hover:bg-gray-100 flex items-center"
                      >
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                        Google
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pb-3">
              <div className="flex flex-col space-y-2">
                <Link href="/" className={`text-white hover:bg-primary-light px-3 py-2 rounded-md ${location === '/' ? 'bg-primary-dark' : ''}`}>
                  {t('common.home')}
                </Link>
                <Link href="/market" className={`text-white hover:bg-primary-light px-3 py-2 rounded-md ${location === '/market' ? 'bg-primary-dark' : ''}`}>
                  {t('common.market')}
                </Link>
                <Link href="/products" className={`text-white hover:bg-primary-light px-3 py-2 rounded-md ${location === '/products' ? 'bg-primary-dark' : ''}`}>
                  {t('common.products')}
                </Link>
                <Link href="/about" className={`text-white hover:bg-primary-light px-3 py-2 rounded-md ${location === '/about' ? 'bg-primary-dark' : ''}`}>
                  {t('common.about')}
                </Link>
                
                {!isLoading && (
                  user ? (
                    <Link href="/profile" className="bg-secondary text-neutral-dark font-medium px-4 py-2 rounded-md hover:bg-secondary-light text-center flex items-center justify-center">
                      <User className="h-4 w-4 mr-2" />
                      {t('common.profile')}
                    </Link>
                  ) : (
                    <>
                      <Button
                        onClick={handleLoginClick}
                        className="bg-secondary text-neutral-dark font-medium hover:bg-secondary-light w-full flex items-center justify-center"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        {t('common.login')}
                      </Button>
                      <Button
                        onClick={handleGoogleSignIn}
                        className="bg-white text-primary border border-white font-medium hover:bg-gray-100 w-full flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                        Google
                      </Button>
                    </>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {showAuthModal && <AuthModal onClose={closeAuthModal} />}
    </>
  );
};

export default Navbar;
