import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { User } from "firebase/auth";
import { 
  onAuthStateChange, 
  auth,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  signInWithGoogle,
  signInWithPhone,
  logOut
} from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  userProfile: any;
  isLoading: boolean;
  signInWithGoogle: () => Promise<any>;
  signInWithPhone: (phoneNumber: string, appVerifier: any) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isLoading: true,
  signInWithGoogle,
  signInWithPhone,
  logout: logOut,
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          
          // If no profile exists yet, create a basic one
          if (!profile) {
            const defaultProfile = {
              uid: user.uid,
              displayName: user.displayName || '',
              email: user.email || '',
              phoneNumber: user.phoneNumber || '',
              photoURL: user.photoURL || '',
              createdAt: Date.now(),
              userType: 'unknown', // Will be updated during onboarding
            };
            
            await updateUserProfile(user.uid, defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = async (data: any) => {
    if (!user) throw new Error("No user logged in");
    
    try {
      await updateUserProfile(user.uid, {
        ...userProfile,
        ...data,
        updatedAt: Date.now(),
      });
      
      // Update local state
      setUserProfile((prev: any) => ({
        ...prev,
        ...data,
        updatedAt: Date.now(),
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    isLoading,
    signInWithGoogle,
    signInWithPhone,
    logout: logOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
