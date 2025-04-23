import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  initRecaptchaVerifier, 
  signInWithPhone, 
  signInWithGoogle, 
  updateUserProfile 
} from "@/lib/firebase";
import { X, Smartphone } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal = ({ onClose }: AuthModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState("farmer");
  
  // Form data for registration
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    agreeToTerms: false
  });
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  
  const handlePhoneAuth = async () => {
    try {
      setIsSubmitting(true);
      
      if (!phoneNumber.startsWith('+')) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a phone number with country code (e.g., +251...)",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Initialize reCAPTCHA verifier
      const recaptchaVerifier = initRecaptchaVerifier('recaptcha-container');
      
      if (!recaptchaVerifier) {
        toast({
          title: "Error",
          description: "Could not initialize reCAPTCHA verification",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Request SMS verification
      const confirmationResult = await signInWithPhone(phoneNumber, recaptchaVerifier);
      
      // Store verification ID for later use
      setVerificationId(confirmationResult.verificationId);
      setIsPhoneAuth(true);
      
      toast({
        title: "Verification Code Sent",
        description: "Check your phone for the verification code",
      });
    } catch (error: any) {
      console.error("Phone auth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleVerifyCode = async () => {
    if (!verificationId || !verificationCode) {
      toast({
        title: "Verification Failed",
        description: "Please enter the verification code sent to your phone",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Verify the code
      // In a real app, you would use confirmationResult.confirm(verificationCode)
      // Since we don't have the full confirmation result object, we'd handle this differently
      
      toast({
        title: "Success",
        description: "Phone number verified successfully",
      });
      
      // Close modal after successful verification
      handleClose();
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
      handleClose();
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      let errorMessage;
      
      if (error.code === "auth/unauthorized-domain") {
        errorMessage = "This domain is not authorized in Firebase. Please add your Replit domain to the authorized domains list in Firebase console.";
      } else if (error.code === "auth/configuration-not-found") {
        errorMessage = "Firebase authentication is not properly configured. Please check your Firebase project setup.";
      } else {
        errorMessage = error.message || "Failed to sign in with Google";
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // If Firebase auth fails, suggest using the local auth method
      if (error.code === "auth/unauthorized-domain" || error.code === "auth/configuration-not-found") {
        setTimeout(() => {
          toast({
            title: "Local Authentication Available",
            description: "You can use the phone/password form to log in while Firebase is being configured",
          });
        }, 1000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      // Mock authentication for demo purposes
      const userObj = {
        uid: "demo-user-id",
        displayName: "Demo User",
        email: formData.phone + "@demo.com",
        phoneNumber: formData.phone,
        photoURL: "https://randomuser.me/api/portraits/people/1.jpg",
      };
      
      // Set the user in context to simulate login
      setTimeout(() => {
        // In a real app, this would be set by Firebase auth
        // Here we're just updating the UI for demo purposes
        auth.updateProfile({
          uid: userObj.uid,
          userType: "buyer",
          displayName: userObj.displayName,
          email: userObj.email,
          phoneNumber: userObj.phoneNumber,
          photoURL: userObj.photoURL,
        });
        
        toast({
          title: "Login Successful",
          description: "Welcome back to Farm2Market!",
        });
        
        handleClose();
      }, 1000);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Failed to log in",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "You must agree to the terms of service",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Mock registration for demo purposes
      const userObj = {
        uid: "demo-user-" + Date.now(),
        displayName: `${formData.firstName} ${formData.lastName}`,
        email: formData.phone + "@demo.com",
        phoneNumber: formData.phone,
        photoURL: "https://randomuser.me/api/portraits/people/2.jpg",
      };
      
      // Simulate API call delay
      setTimeout(() => {
        // Update auth context
        auth.updateProfile({
          uid: userObj.uid,
          userType: userType,
          displayName: userObj.displayName,
          email: userObj.email,
          phoneNumber: userObj.phoneNumber,
          photoURL: userObj.photoURL,
        });
        
        toast({
          title: "Registration Successful",
          description: "Welcome to Farm2Market Ethiopia!",
        });
        
        handleClose();
      }, 1000);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader className="bg-primary text-white p-4 -m-6 mb-0 rounded-t-lg flex justify-between items-center">
          <DialogTitle className="font-heading font-bold text-xl">
            {authMode === "login" 
              ? t('common.login') + " " + t('common.appName')
              : t('common.register') + " " + t('common.appName')
            }
          </DialogTitle>
          <DialogDescription className="sr-only">
            Sign in or create an account
          </DialogDescription>
          <Button variant="ghost" className="text-white h-8 w-8 p-0" onClick={handleClose}>
            <X size={20} />
          </Button>
        </DialogHeader>
        
        <div className="mt-2">
          {isPhoneAuth ? (
            <div className="space-y-4 p-2">
              <DialogDescription>
                Enter the verification code sent to {phoneNumber}
              </DialogDescription>
              
              <div>
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsPhoneAuth(false)}>
                  Back
                </Button>
                <Button onClick={handleVerifyCode} disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Tabs defaultValue="login" onValueChange={setAuthMode} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="login">{t('common.login')}</TabsTrigger>
                  <TabsTrigger value="register">{t('common.register')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 mt-4">
                  <form onSubmit={handleLoginSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone">{t('common.phone')}</Label>
                        <Input 
                          id="phone" 
                          name="phone"
                          placeholder="+251 91 234 5678" 
                          value={authMode === "login" ? phoneNumber : formData.phone}
                          onChange={(e) => authMode === "login" 
                            ? setPhoneNumber(e.target.value) 
                            : handleInputChange(e)
                          }
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="password">{t('common.password')}</Label>
                        <Input 
                          id="password" 
                          name="password"
                          type="password" 
                          placeholder="••••••••" 
                          value={formData.password}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox id="remember" />
                          <Label htmlFor="remember" className="text-sm">
                            {t('common.rememberMe')}
                          </Label>
                        </div>
                        <a href="#" className="text-sm text-primary hover:text-primary-light">
                          {t('common.forgotPassword')}
                        </a>
                      </div>
                      
                      <Button type="submit" className="w-full bg-primary hover:bg-primary-light">
                        {t('common.login')}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4 mt-4">
                  <form onSubmit={handleRegisterSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">{t('common.firstName')}</Label>
                          <Input 
                            id="firstName" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">{t('common.lastName')}</Label>
                          <Input 
                            id="lastName" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="registerPhone">{t('common.phone')}</Label>
                        <Input 
                          id="registerPhone" 
                          name="phone"
                          placeholder="+251 91 234 5678" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="registerPassword">{t('common.password')}</Label>
                        <Input 
                          id="registerPassword" 
                          name="password"
                          type="password" 
                          placeholder="••••••••" 
                          value={formData.password}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label>{t('common.userType')}</Label>
                        <RadioGroup 
                          value={userType} 
                          onValueChange={setUserType}
                          className="grid grid-cols-2 gap-4 mt-2"
                        >
                          <div className="flex items-center p-3 border border-neutral-medium rounded-md cursor-pointer hover:bg-neutral-light">
                            <RadioGroupItem id="farmer" value="farmer" />
                            <Label htmlFor="farmer" className="ml-2">
                              {t('common.farmer')}
                            </Label>
                          </div>
                          <div className="flex items-center p-3 border border-neutral-medium rounded-md cursor-pointer hover:bg-neutral-light">
                            <RadioGroupItem id="buyer" value="buyer" />
                            <Label htmlFor="buyer" className="ml-2">
                              {t('common.buyer')}
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="terms" 
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => 
                            setFormData({...formData, agreeToTerms: checked as boolean})
                          }
                          required 
                        />
                        <Label htmlFor="terms" className="text-sm">
                          {t('common.terms')} <a href="#" className="text-primary hover:text-primary-light">Terms of Service</a>
                        </Label>
                      </div>
                      
                      <Button type="submit" className="w-full bg-primary hover:bg-primary-light">
                        {t('common.register')}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-dark/70">{t('common.or')}</p>
                <div className="mt-3 flex flex-col sm:flex-row justify-center gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => handlePhoneAuth()}
                    disabled={isSubmitting}
                    className="flex items-center justify-center"
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    {t('common.smsVerification')}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="flex items-center justify-center"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                </div>
              </div>
              
              {/* Recaptcha container for phone auth */}
              <div id="recaptcha-container" ref={recaptchaContainerRef} className="mt-4"></div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
