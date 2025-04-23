import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { changeLanguage, getCurrentLanguage } from "@/lib/i18n";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Recycle } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
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
                <span className="material-icons text-sm mr-1">language</span>
                <span>{currentLang}</span>
              </button>
              
              {/* Mobile menu button */}
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden text-white p-2 focus:outline-none"
              >
                <span className="material-icons">menu</span>
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
                    <Link href="/profile" className="bg-secondary text-neutral-dark font-medium px-4 py-2 rounded-md hover:bg-secondary-light">
                      {t('common.profile')}
                    </Link>
                  ) : (
                    <Button
                      onClick={handleLoginClick}
                      className="bg-secondary text-neutral-dark font-medium hover:bg-secondary-light"
                    >
                      {t('common.login')}
                    </Button>
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
                    <Link href="/profile" className="bg-secondary text-neutral-dark font-medium px-4 py-2 rounded-md hover:bg-secondary-light text-center">
                      {t('common.profile')}
                    </Link>
                  ) : (
                    <Button
                      onClick={handleLoginClick}
                      className="bg-secondary text-neutral-dark font-medium hover:bg-secondary-light w-full"
                    >
                      {t('common.login')}
                    </Button>
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
