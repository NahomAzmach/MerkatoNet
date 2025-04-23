import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useProducts } from "@/hooks/useProducts";
import { subscribeToMarketPrices, logOut } from "@/lib/firebase";
import { 
  User, 
  Bell, 
  Package, 
  LogOut, 
  Loader2, 
  AlertTriangle, 
  UserCircle
} from "lucide-react";
import { getSmsSubscriptionStatus, subscribeToPriceAlerts, unsubscribeFromPriceAlerts } from "@/lib/twilio";

const Profile = () => {
  const { t } = useTranslation();
  const { user, userProfile, isLoading, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const { data: productsData } = useProducts();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    phoneNumber: "",
    location: "",
    userType: "farmer"
  });
  const [smsSubscription, setSmsSubscription] = useState({
    isSubscribed: false,
    isLoading: true
  });
  
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        displayName: userProfile.displayName || "",
        phoneNumber: userProfile.phoneNumber || "",
        location: userProfile.location || "",
        userType: userProfile.userType || "farmer"
      });
    }
  }, [userProfile]);
  
  useEffect(() => {
    // Check SMS subscription status
    const checkSmsStatus = async () => {
      if (user?.phoneNumber) {
        try {
          const status = await getSmsSubscriptionStatus(user.phoneNumber);
          setSmsSubscription({
            isSubscribed: status.isSubscribed,
            isLoading: false
          });
        } catch (error) {
          console.error("Error checking SMS status:", error);
          setSmsSubscription({
            isSubscribed: false,
            isLoading: false
          });
        }
      } else {
        setSmsSubscription({
          isSubscribed: false,
          isLoading: false
        });
      }
    };
    
    checkSmsStatus();
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUserTypeChange = (value: string) => {
    setProfileData(prev => ({
      ...prev,
      userType: value
    }));
  };
  
  const handleProfileUpdate = async () => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      await updateProfile({
        displayName: profileData.displayName,
        phoneNumber: profileData.phoneNumber,
        location: profileData.location,
        userType: profileData.userType,
        updatedAt: Date.now()
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSubscriptionToggle = async () => {
    if (!user?.phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please add a phone number to your profile first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSmsSubscription(prev => ({ ...prev, isLoading: true }));
      
      if (smsSubscription.isSubscribed) {
        await unsubscribeFromPriceAlerts(user.phoneNumber);
        
        toast({
          title: "Unsubscribed",
          description: "You will no longer receive SMS price alerts.",
        });
        
        setSmsSubscription({
          isSubscribed: false,
          isLoading: false
        });
      } else {
        await subscribeToPriceAlerts(user.phoneNumber, {
          product: "teff",
          market: "addis_ababa",
          frequency: "daily"
        });
        
        toast({
          title: "Subscribed",
          description: "You will now receive daily SMS price alerts for teff.",
        });
        
        setSmsSubscription({
          isSubscribed: true,
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Subscription toggle error:", error);
      toast({
        title: "Subscription Error",
        description: "Failed to update your subscription status. Please try again.",
        variant: "destructive"
      });
      setSmsSubscription(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Filter user's products (if they are a seller)
  const userProducts = productsData?.filter(
    product => product.seller.id === user?.uid
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-2xl mx-auto">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Not Logged In</AlertTitle>
          <AlertDescription>
            Please login to view your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-6">
        {t('common.profile')}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <UserCircle className="h-16 w-16 text-primary" />
                  </div>
                )}
                <CardTitle>{userProfile?.displayName || user.displayName || 'User'}</CardTitle>
                <CardDescription>
                  {userProfile?.userType === 'farmer' ? 'Farmer' : 'Buyer'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.phoneNumber && (
                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground">Phone:</p>
                    <p className="text-sm ml-auto">{user.phoneNumber}</p>
                  </div>
                )}
                {userProfile?.location && (
                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground">Location:</p>
                    <p className="text-sm ml-auto">{userProfile.location}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground">Member since:</p>
                  <p className="text-sm ml-auto">
                    {userProfile?.createdAt 
                      ? new Date(userProfile.createdAt).toLocaleDateString() 
                      : new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                className="w-full flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> {t('common.logout')}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Price Alerts</CardTitle>
              <CardDescription>
                Receive SMS notifications about teff prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Daily Teff Price Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified of price changes in Addis Ababa
                  </p>
                </div>
                <Button 
                  variant={smsSubscription.isSubscribed ? "destructive" : "default"}
                  size="sm"
                  disabled={smsSubscription.isLoading}
                  onClick={handleSubscriptionToggle}
                >
                  {smsSubscription.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : smsSubscription.isSubscribed ? (
                    "Unsubscribe"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <Tabs defaultValue="profile" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </TabsTrigger>
                  <TabsTrigger value="products" className="flex items-center">
                    <Package className="mr-2 h-4 w-4" /> My Products
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center">
                    <Bell className="mr-2 h-4 w-4" /> Notifications
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="profile" className="mt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Full Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+251 91 234 5678"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      placeholder="Addis Ababa, Kolfe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>I am a:</Label>
                    <RadioGroup 
                      value={profileData.userType} 
                      onValueChange={handleUserTypeChange}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="farmer" id="farmer" />
                        <Label htmlFor="farmer">Farmer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer">Buyer</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    onClick={handleProfileUpdate}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="mt-0">
                {userProfile?.userType === 'farmer' ? (
                  <div>
                    {userProducts.length > 0 ? (
                      <div className="space-y-4">
                        {userProducts.map(product => (
                          <Card key={product.id}>
                            <CardContent className="p-4 flex items-center">
                              <img 
                                src={product.image} 
                                alt={product.title} 
                                className="w-16 h-16 object-cover rounded mr-4" 
                              />
                              <div className="flex-grow">
                                <h3 className="font-medium">{product.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {product.quantity} quintals • {product.price} ETB/quintal
                                </p>
                              </div>
                              <Button size="sm" variant="outline">Edit</Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">No Products Listed</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't listed any products for sale yet.
                        </p>
                        <Button>Add New Product</Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="font-medium text-lg mb-2">Buyer Account</h3>
                    <p className="text-muted-foreground">
                      Only farmer accounts can list products for sale.
                    </p>
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground">
                      Want to switch to a farmer account? Update your profile type.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No Notifications</h3>
                    <p className="text-muted-foreground">
                      You don't have any notifications at the moment.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
