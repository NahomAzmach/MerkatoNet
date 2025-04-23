import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Bookmark, BookmarkCheck, CheckCircle } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    type: string;
    quality: string;
    quantity: number;
    location: string;
    price: number;
    seller: {
      id: string;
      name: string;
      photo: string;
      isVerified: boolean;
    };
    image: string;
  };
  onContactClick: (productId: string) => void;
  onSaveClick: (productId: string) => void;
  isSaved: boolean;
}

const ProductCard = ({ product, onContactClick, onSaveClick, isSaved }: ProductCardProps) => {
  const { t } = useTranslation();

  const getQualityBadgeColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "premium":
        return "bg-secondary-light text-neutral-dark";
      case "standard":
        return "bg-neutral-medium text-neutral-dark";
      case "organic":
        return "bg-success text-white";
      default:
        return "bg-neutral-medium text-neutral-dark";
    }
  };

  return (
    <Card className="bg-white border border-neutral-medium rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{product.title}</h3>
          <Badge className={getQualityBadgeColor(product.quality)}>
            {product.quality}
          </Badge>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-neutral-dark/70">
            {t('products.quantity')}: {product.quantity} quintals
          </p>
          <p className="text-sm text-neutral-dark/70 mb-2">
            {t('products.location')}: {product.location}
          </p>
          <p className="text-primary font-bold">{product.price.toLocaleString()} ETB/quintal</p>
        </div>
        
        <div className="flex items-center text-sm mb-3">
          <img 
            src={product.seller.photo} 
            alt={`${product.seller.name} profile`} 
            className="w-6 h-6 rounded-full mr-2"
          />
          <span>{product.seller.name} - {t('products.seller')}</span>
          {product.seller.isVerified && (
            <span className="ml-auto flex items-center text-success">
              <CheckCircle className="h-4 w-4 mr-1" /> {t('products.verified')}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => onContactClick(product.id)}
            className="flex-1 bg-primary hover:bg-primary-light text-white font-medium px-3 py-2 rounded-md text-sm flex items-center justify-center"
          >
            <Phone className="h-4 w-4 mr-1" /> {t('common.contact')}
          </Button>
          <Button 
            onClick={() => onSaveClick(product.id)}
            variant="outline"
            className="bg-neutral-light hover:bg-neutral-medium text-neutral-dark font-medium px-3 py-2 rounded-md text-sm"
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
