import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  signInWithPhoneNumber, 
  PhoneAuthProvider, 
  GoogleAuthProvider, 
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  User,
  getRedirectResult
} from "firebase/auth";
import { getDatabase, ref, set, get, onValue, push, update } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const phoneProvider = new PhoneAuthProvider(auth);

// Handle redirect result
export const handleAuthRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("User signed in after redirect:", result.user);
      return result.user;
    }
  } catch (error) {
    console.error("Error during redirect sign-in:", error);
  }
  return null;
};

// Sign in with Google
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Sign in with Google (redirect)
export const signInWithGoogleRedirect = () => {
  return signInWithRedirect(auth, googleProvider);
};

// Initialize reCAPTCHA verifier for phone auth
export const initRecaptchaVerifier = (buttonId: string) => {
  if (typeof window !== 'undefined') {
    return new RecaptchaVerifier(auth, buttonId, {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved, allow sign-in
      }
    });
  }
  return null;
};

// Sign in with phone number
export const signInWithPhone = (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

// Sign out
export const logOut = () => {
  return signOut(auth);
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Firebase Realtime Database functions

// Create or update user profile
export const updateUserProfile = async (userId: string, userData: any) => {
  await set(ref(db, `users/${userId}`), userData);
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  const snapshot = await get(ref(db, `users/${userId}`));
  return snapshot.exists() ? snapshot.val() : null;
};

// Add a new product listing
export const addProduct = async (product: any) => {
  const newProductRef = push(ref(db, 'products'));
  await set(newProductRef, product);
  return newProductRef.key;
};

// Update a product listing
export const updateProduct = async (productId: string, updates: any) => {
  await update(ref(db, `products/${productId}`), updates);
};

// Get product by ID
export const getProductById = async (productId: string) => {
  const snapshot = await get(ref(db, `products/${productId}`));
  return snapshot.exists() ? snapshot.val() : null;
};

// Get all products
export const getProducts = async () => {
  const snapshot = await get(ref(db, 'products'));
  return snapshot.exists() ? snapshot.val() : {};
};

// Subscribe to products (real-time updates)
export const subscribeToProducts = (callback: (products: any) => void) => {
  const productsRef = ref(db, 'products');
  return onValue(productsRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : {};
    callback(data);
  });
};

// Add market price update
export const addMarketPrice = async (priceData: any) => {
  const newPriceRef = push(ref(db, 'marketPrices'));
  await set(newPriceRef, {
    ...priceData,
    timestamp: Date.now()
  });
  return newPriceRef.key;
};

// Get latest market prices
export const getLatestMarketPrices = async () => {
  const snapshot = await get(ref(db, 'marketPrices'));
  if (!snapshot.exists()) return [];
  
  const prices = snapshot.val();
  const pricesArray = Object.keys(prices).map(key => ({
    id: key,
    ...prices[key]
  }));
  
  // Sort by timestamp (most recent first)
  return pricesArray.sort((a, b) => b.timestamp - a.timestamp);
};

// Subscribe to market prices (real-time updates)
export const subscribeToMarketPrices = (callback: (prices: any[]) => void) => {
  const pricesRef = ref(db, 'marketPrices');
  return onValue(pricesRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const prices = snapshot.val();
    const pricesArray = Object.keys(prices).map(key => ({
      id: key,
      ...prices[key]
    }));
    
    // Sort by timestamp (most recent first)
    callback(pricesArray.sort((a, b) => b.timestamp - a.timestamp));
  });
};

export { auth, db };
