import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    appName: 'Farm2Market',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    home: 'Home',
    market: 'Market',
    products: 'Products',
    about: 'About',
    myProducts: 'My Products',
    phone: 'Phone Number',
    password: 'Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    userType: 'I am a:',
    farmer: 'Farmer',
    buyer: 'Buyer',
    terms: 'I agree to the Terms of Service',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    or: 'Or continue with',
    smsVerification: 'SMS Verification',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    contact: 'Contact',
    share: 'Share',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
  },
  home: {
    title: 'Connect Farm to Market',
    subtitle: 'Direct connections between farmers and buyers in Ethiopia',
    registerNow: 'Register Now',
    learnMore: 'Learn More',
    smsPrompt: 'Text 2288 for price updates',
  },
  market: {
    title: 'Current Market Prices',
    subtitle: 'Addis Ababa Market - Updated Today',
    teffPrices: 'Teff Prices (per quintal)',
    viewHistory: 'View History',
    type: 'Type',
    price: 'Price (ETB)',
    dayChange: '24hr Change',
    weekChange: 'Week Change',
    source: 'Source: Ethiopian Grain Trade Enterprise',
    getSmsAlert: 'Get SMS Alert',
    priceTrends: 'Teff Price Trends',
    exportData: 'Export Data',
    marketInsights: 'Market Insights',
    fullReport: 'Full Market Report',
  },
  products: {
    title: 'Available Products',
    viewAll: 'View All',
    quantity: 'Quantity',
    location: 'Location',
    seller: 'Seller',
    verified: 'Verified',
  },
  features: {
    title: 'How Farm2Market Works',
    subtitle: 'Connecting farmers directly with buyers to improve market access and get better prices',
    feature1Title: 'List Your Products',
    feature1Desc: 'Farmers can easily list their teff with details on quality, quantity, and location for buyers to discover.',
    feature2Title: 'Find the Best Deals',
    feature2Desc: 'Buyers can search and filter available teff based on type, price, location, and seller ratings.',
    feature3Title: 'Connect Directly',
    feature3Desc: 'Contact sellers through SMS or phone call to arrange inspection, negotiate, and complete the transaction.',
    smsUpdatePrompt: 'Stay updated with market prices via SMS alerts',
    phoneNumberPlaceholder: 'Enter your phone number',
    subscribe: 'Subscribe',
  },
  insights: {
    supplyForecast: 'Supply Forecast',
    buyingOpportunity: 'Buying Opportunity',
    regionalDifference: 'Regional Difference',
  },
  footer: {
    slogan: 'Connecting Ethiopian farmers and buyers directly to improve market access and prices.',
    quickLinks: 'Quick Links',
    resources: 'Resources',
    contactUs: 'Contact Us',
    farmingTips: 'Farming Tips',
    marketReports: 'Market Reports',
    weatherUpdates: 'Weather Updates',
    smsCommands: 'SMS Commands',
    faqs: 'FAQs',
    copyright: '© 2023 Farm2Market Ethiopia. All rights reserved.',
  },
};

// Amharic translations
const amTranslations = {
  common: {
    appName: 'ፋርም2ማርኬት',
    login: 'ግባ',
    register: 'ይመዝገቡ',
    logout: 'ውጣ',
    profile: 'መገለጫ',
    home: 'መነሻ',
    market: 'ገበያ',
    products: 'ምርቶች',
    about: 'ስለ እኛ',
    myProducts: 'የእኔ ምርቶች',
    phone: 'ስልክ ቁጥር',
    password: 'የይለፍ ቃል',
    firstName: 'መጠሪያ ስም',
    lastName: 'የአባት ስም',
    userType: 'እኔ ነኝ:',
    farmer: 'አርሶ አደር',
    buyer: 'ገዢ',
    terms: 'የአገልግሎት ውሎችን ተስማምቻለሁ',
    rememberMe: 'አስታውሰኝ',
    forgotPassword: 'የይለፍ ቃል ረሳኽ?',
    or: 'ወይም ቀጥል በ',
    smsVerification: 'የኤስኤምኤስ ማረጋገጫ',
    search: 'ፈልግ',
    filter: 'አጣራ',
    sort: 'አስቀምጥ',
    contact: 'ተገናኝ',
    share: 'አጋራ',
    save: 'አስቀምጥ',
    cancel: 'ሰርዝ',
    submit: 'አስገባ',
  },
  home: {
    title: 'እርሻን ከገበያ ጋር አገናኝ',
    subtitle: 'በኢትዮጵያ ውስጥ አርሶ አደሮችን ከገዢዎች ጋር በቀጥታ ያገናኛል',
    registerNow: 'አሁን ይመዝገቡ',
    learnMore: 'ተጨማሪ ይወቁ',
    smsPrompt: '2288 ለዋጋ ዝምድናዎች ያሰምሩ',
  },
  market: {
    title: 'የአሁኑ የገበያ ዋጋዎች',
    subtitle: 'አዲስ አበባ ገበያ - ዛሬ የተዘመነ',
    teffPrices: 'የጤፍ ዋጋዎች (በኩንታል)',
    viewHistory: 'ታሪክ ይመልከቱ',
    type: 'ዓይነት',
    price: 'ዋጋ (ብር)',
    dayChange: '24ሰ ለውጥ',
    weekChange: 'የሳምንት ለውጥ',
    source: 'ምንጭ: የኢትዮጵያ እህል ንግድ ድርጅት',
    getSmsAlert: 'የኤስኤምኤስ ማሳወቂያ',
    priceTrends: 'የጤፍ ዋጋ አዝማሚያዎች',
    exportData: 'ውሂብ ላክ',
    marketInsights: 'የገበያ ግንዛቤዎች',
    fullReport: 'ሙሉ የገበያ ሪፖርት',
  },
  products: {
    title: 'ያሉ ምርቶች',
    viewAll: 'ሁሉንም ይመልከቱ',
    quantity: 'መጠን',
    location: 'ቦታ',
    seller: 'ሻጭ',
    verified: 'የተረጋገጠ',
  },
  features: {
    title: 'ፋርም2ማርኬት እንዴት እንደሚሰራ',
    subtitle: 'አርሶ አደሮችን ከገዢዎች ጋር በቀጥታ በማገናኘት የገበያ ተደራሽነትን እና የተሻለ ዋጋ ለማግኘት',
    feature1Title: 'ምርትዎን ይዘርዝሩ',
    feature1Desc: 'አርሶ አደሮች ጥራት፣ መጠን እና ቦታ ዝርዝሮችን በቀላሉ መዘርዘር ይችላሉ።',
    feature2Title: 'ምርጥ ዋጋዎችን ያግኙ',
    feature2Desc: 'ገዢዎች በዓይነት፣ በዋጋ፣ በቦታ እና በሻጭ ደረጃዎች ላይ በመመስረት ማጣራት ይችላሉ።',
    feature3Title: 'በቀጥታ ይገናኙ',
    feature3Desc: 'በኤስኤምኤስ ወይም በስልክ ለመፈተሽ፣ ለመደራደር እና ግብይቱን ለማጠናቀቅ ሻጮችን ያግኙ።',
    smsUpdatePrompt: 'በኤስኤምኤስ ማሳወቂያዎች የገበያ ዋጋዎችን ይከታተሉ',
    phoneNumberPlaceholder: 'ስልክ ቁጥርዎን ያስገቡ',
    subscribe: 'ሰብስክራይብ ያድርጉ',
  },
  insights: {
    supplyForecast: 'የአቅርቦት ትንበያ',
    buyingOpportunity: 'የግዢ እድል',
    regionalDifference: 'የአካባቢ ልዩነት',
  },
  footer: {
    slogan: 'የኢትዮጵያ አርሶ አደሮችን እና ገዢዎችን በቀጥታ በማገናኘት የገበያ ተደራሽነትን እና ዋጋዎችን ለማሻሻል።',
    quickLinks: 'ፈጣን ማገናኛዎች',
    resources: 'ምንጮች',
    contactUs: 'ያግኙን',
    farmingTips: 'የግብርና ምክሮች',
    marketReports: 'የገበያ ሪፖርቶች',
    weatherUpdates: 'የአየር ሁኔታ ዝማኔዎች',
    smsCommands: 'የኤስኤምኤስ ትዕዛዞች',
    faqs: 'ተደጋጋሚ ጥያቄዎች',
    copyright: '© 2023 ፋርም2ማርኬት ኢትዮጵያ። መብቱ በህግ የተጠበቀ ነው።',
  },
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      am: {
        translation: amTranslations
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;

// Helper function to change language
export const changeLanguage = (lang: string) => {
  return i18n.changeLanguage(lang);
};

// Helper function to get current language
export const getCurrentLanguage = () => {
  return i18n.language;
};
