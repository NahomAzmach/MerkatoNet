import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { subscribeToProducts, getProducts } from "@/lib/firebase";

// Mock product images
const productImages = [
  "https://images.unsplash.com/photo-1592997571659-0b21ff64313b",
  "https://images.unsplash.com/photo-1586201375761-83865001e8c7",
  "https://images.unsplash.com/photo-1623227866882-c005c26dfe41",
  "https://images.unsplash.com/photo-1595229207662-35aaefe34647"
];

// Mock seller images
const sellerImages = [
  "https://randomuser.me/api/portraits/men/42.jpg",
  "https://randomuser.me/api/portraits/women/32.jpg",
  "https://randomuser.me/api/portraits/men/62.jpg",
  "https://randomuser.me/api/portraits/women/52.jpg"
];

// Get products with API
export function useProducts() {
  return useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/products");
        
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        
        return response.json();
      } catch (error) {
        console.error("Error fetching products:", error);
        // Return empty array instead of undefined
        return [];
      }
    },
    placeholderData: [],
    initialData: []
  });
}

// Get a single product by ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product with ID: ${id}`);
      }
      
      return response.json();
    }
  });
}

// Real-time products from Firebase
export function useRealtimeProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const allProducts = await getProducts();
        
        // Check if products exist and convert from object to array
        if (allProducts && typeof allProducts === 'object') {
          const productsArray = Object.keys(allProducts).map(key => ({
            id: key,
            ...allProducts[key]
          }));
          
          setProducts(productsArray);
        } else {
          // If no products, set empty array
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch products"));
        // Set empty array on error
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToProducts((updatedProducts) => {
      try {
        // Convert from object to array if needed
        if (updatedProducts) {
          const productsArray = typeof updatedProducts === 'object' && !Array.isArray(updatedProducts)
            ? Object.keys(updatedProducts).map(key => ({
                id: key,
                ...updatedProducts[key]
              }))
            : Array.isArray(updatedProducts) ? updatedProducts : [];
            
          setProducts(productsArray);
        } else {
          setProducts([]);
        }
      } catch (e) {
        console.error("Error processing products update:", e);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { products, isLoading, error };
}

// Helper function to generate mock product data
function generateMockProducts(count: number) {
  const teffTypes = ["White Teff (Magna)", "Mixed Teff", "Red Teff (Sergegna)", "Organic White Teff"];
  const qualities = ["Premium", "Standard", "Premium", "Organic"];
  const locations = [
    "Addis Ababa, Kolfe", 
    "Addis Ababa, Akaki", 
    "Addis Ababa, Bole", 
    "Addis Ababa, Nifas Silk"
  ];
  const sellerNames = ["Abebe T.", "Tigist G.", "Daniel M.", "Sara B."];
  const prices = [6500, 5800, 5250, 7200];
  
  return Array.from({ length: count }, (_, i) => {
    const index = i % 4; // Cycle through the 4 sample products
    
    return {
      id: `product-${i + 1}`,
      title: teffTypes[index],
      type: teffTypes[index].split(" ")[0],
      quality: qualities[index],
      quantity: [3, 5, 2, 1][index],
      location: locations[index],
      price: prices[index],
      seller: {
        id: `seller-${index + 1}`,
        name: sellerNames[index],
        photo: sellerImages[index],
        isVerified: true
      },
      image: productImages[index],
      description: `High-quality ${teffTypes[index]} from a verified seller. Great for making injera and other traditional Ethiopian dishes.`,
      createdAt: new Date().toISOString()
    };
  });
}
