import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, SlidersHorizontal, Phone } from "lucide-react";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

const ProductList = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: products = [], isLoading, error } = useProducts();
  
  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Load saved products from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedProducts");
    if (saved) {
      setSavedProducts(JSON.parse(saved));
    }
  }, []);
  
  // Filter products based on search term (ensure products is an array)
  const filteredProducts = Array.isArray(products) ? products.filter((product: any) => 
    product && product.title && (
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.type && product.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.location && product.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  ) : [];
  
  const handleSaveProduct = (productId: string) => {
    let updatedSaved;
    
    if (savedProducts.includes(productId)) {
      updatedSaved = savedProducts.filter(id => id !== productId);
      toast({
        title: "Product Removed",
        description: "Product removed from saved items",
      });
    } else {
      updatedSaved = [...savedProducts, productId];
      toast({
        title: "Product Saved",
        description: "Product added to saved items",
      });
    }
    
    setSavedProducts(updatedSaved);
    localStorage.setItem("savedProducts", JSON.stringify(updatedSaved));
  };
  
  const handleContactClick = (productId: string) => {
    const product = Array.isArray(products) 
      ? products.find((p: any) => p && p.id === productId)
      : null;
      
    if (product) {
      setSelectedProduct(product);
      setShowContactDialog(true);
    }
  };
  
  const handleSendContact = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to contact sellers",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Contact Request Sent",
      description: `The seller will be notified of your interest in ${selectedProduct?.title}`,
    });
    
    setShowContactDialog(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark">
          {t('products.title')}
        </h2>
        <a 
          href="/products" 
          className="text-primary hover:text-primary-light flex items-center text-sm font-medium"
        >
          {t('products.viewAll')} <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder={`${t('common.search')} ${t('products.title')}`}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" /> {t('common.filter')}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-error">
          <p>Error loading products. Please try again.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p>No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onContactClick={handleContactClick}
              onSaveClick={handleSaveProduct}
              isSaved={savedProducts.includes(product.id)}
            />
          ))}
        </div>
      )}
      
      {/* Contact Dialog */}
      {selectedProduct && (
        <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Contact Seller</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center mb-4">
                <img 
                  src={selectedProduct.seller.photo} 
                  alt={selectedProduct.seller.name} 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-medium">{selectedProduct.seller.name}</h4>
                  <p className="text-sm text-muted-foreground">Seller of {selectedProduct.title}</p>
                </div>
              </div>
              
              <div className="border rounded-md p-3 mb-4">
                <h5 className="font-medium">{selectedProduct.title}</h5>
                <p className="text-sm">{selectedProduct.quality} Quality • {selectedProduct.quantity} quintals</p>
                <p className="text-primary font-bold mt-1">{selectedProduct.price.toLocaleString()} ETB/quintal</p>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                When you send a contact request, the seller will be able to see your phone number and can reach out to discuss the product.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowContactDialog(false)}>Cancel</Button>
              <Button onClick={handleSendContact} className="bg-primary hover:bg-primary-light">
                <Phone className="h-4 w-4 mr-2" /> Contact Seller
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductList;
