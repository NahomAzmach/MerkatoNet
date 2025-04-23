import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { 
  Facebook, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Mail, 
  Send 
} from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-dark text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">{t('common.appName')}</h4>
            <p className="text-sm text-white/70 mb-4">{t('footer.slogan')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary-light">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-secondary-light">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="text-white hover:text-secondary-light">
                <Phone size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-white">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link href="/market" className="text-white/70 hover:text-white">
                  {t('market.title')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white/70 hover:text-white">
                  {t('products.title')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white">
                  SMS Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-white">
                  {t('common.about')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/70 hover:text-white">
                  {t('footer.farmingTips')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white">
                  {t('footer.marketReports')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white">
                  {t('footer.weatherUpdates')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white">
                  {t('footer.smsCommands')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white">
                  {t('footer.faqs')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-0.5" />
                <span className="text-white/70">Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-start">
                <Phone size={16} className="mr-2 mt-0.5" />
                <span className="text-white/70">+251 91 234 5678</span>
              </li>
              <li className="flex items-start">
                <Mail size={16} className="mr-2 mt-0.5" />
                <span className="text-white/70">info@farm2market.et</span>
              </li>
              <li className="flex items-start">
                <MessageCircle size={16} className="mr-2 mt-0.5" />
                <span className="text-white/70">SMS "HELP" to 2288</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <p className="text-sm text-white/70">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
