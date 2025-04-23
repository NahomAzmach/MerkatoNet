import { apiRequest } from "./queryClient";

// Send SMS notification
export const sendSmsNotification = async (phoneNumber: string, message: string) => {
  try {
    const response = await apiRequest("POST", "/api/sms/send", {
      to: phoneNumber,
      message,
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};

// Subscribe to price alerts via SMS
export const subscribeToPriceAlerts = async (phoneNumber: string, userPreferences: any) => {
  try {
    const response = await apiRequest("POST", "/api/sms/subscribe", {
      phoneNumber,
      preferences: userPreferences,
    });
    return await response.json();
  } catch (error) {
    console.error("Error subscribing to price alerts:", error);
    throw error;
  }
};

// Unsubscribe from price alerts
export const unsubscribeFromPriceAlerts = async (phoneNumber: string) => {
  try {
    const response = await apiRequest("POST", "/api/sms/unsubscribe", {
      phoneNumber,
    });
    return await response.json();
  } catch (error) {
    console.error("Error unsubscribing from price alerts:", error);
    throw error;
  }
};

// Get SMS subscription status
export const getSmsSubscriptionStatus = async (phoneNumber: string) => {
  try {
    const response = await apiRequest("GET", `/api/sms/status?phone=${encodeURIComponent(phoneNumber)}`, undefined);
    return await response.json();
  } catch (error) {
    console.error("Error checking SMS subscription status:", error);
    throw error;
  }
};
