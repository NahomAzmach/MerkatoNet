import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Search, SlidersHorizontal, SortAsc, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { useRealtimeProducts } from "@/hooks/useProducts";

const Products = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { products, isLoading, error } = useRealtimeProducts();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [savedProducts, setSavedProducts] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedProducts");
    return saved ? JSON.parse(saved) : [];
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    quality: "all",
    minPrice: "",
    maxPrice: "",
    location: "all"
  });
  const [sortOption, setSortOption] = useState("newest");
  
  // Apply filters and sorting
  const filteredProducts = products
    .filter(product => {
      // Search term filter
      if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !product.location.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Type filter
      if (filters.type !== "all" && product.type.toLowerCase() !== filters.type) {
        return false;
      }
      
      // Quality filter
      if (filters.quality !== "all" && product.quality.toLowerCase() !== filters.quality.toLowerCase()) {
        return false;
      }
      
      // Price range filter
      if (filters.minPrice && product.price < Number(filters.minPrice)) {
        return false;
      }
      
      if (filters.maxPrice && product.price > Number(filters.maxPrice)) {
        return false;
      }
      
      // Location filter
      if (filters.location !== "all" && !product.location.includes(filters.location)) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  
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
    toast({
      title: "Contact Seller",
      description: `Sending contact request for product ${productId}`,
    });
  };
  
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      type: "all",
      quality: "all",
      minPrice: "",
      maxPrice: "",
      location: "all"
    });
    setSearchTerm("");
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-6">
          {t('products.title')}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" /> {t('common.filter')}
            </Button>
            
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[160px]">
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {showFilters && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Filter Products</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Teff Type</label>
                  <Select 
                    value={filters.type} 
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="white">White Teff</SelectItem>
                      <SelectItem value="mixed">Mixed Teff</SelectItem>
                      <SelectItem value="red">Red Teff</SelectItem>
                      <SelectItem value="organic">Organic Teff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Quality</label>
                  <Select 
                    value={filters.quality} 
                    onValueChange={(value) => handleFilterChange("quality", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Qualities</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Price Range (ETB)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Select 
                    value={filters.location} 
                    onValueChange={(value) => handleFilterChange("location", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Kolfe">Kolfe</SelectItem>
                      <SelectItem value="Akaki">Akaki</SelectItem>
                      <SelectItem value="Bole">Bole</SelectItem>
                      <SelectItem value="Nifas Silk">Nifas Silk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {isLoading ? (
          <div className="text-center py-16">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-error">Error loading products. Please try again.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p>No products found matching your criteria.</p>
            {(searchTerm || 
              filters.type !== "all" || 
              filters.quality !== "all" || 
              filters.minPrice || 
              filters.maxPrice || 
              filters.location !== "all") && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      </div>
    </div>
  );
};

export default Products;
