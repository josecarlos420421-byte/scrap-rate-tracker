import AsyncStorage from "@react-native-async-storage/async-storage";

const SUBSCRIPTION_KEY = "@subscription_data";
const ACTIVATION_CODES_KEY = "@activation_codes";
const ADMIN_PASSWORD = "FATIMA2024"; // Password to access admin features

export interface SubscriptionData {
  isActive: boolean;
  activatedAt: string | null;
  expiresAt: string | null;
  phoneNumber: string | null;
  transactionId: string | null;
  usedCode: string | null;
}

export interface ActivationCode {
  code: string;
  createdAt: string;
  usedAt: string | null;
  usedBy: string | null; // phone number
  isUsed: boolean;
}

export const PAYMENT_INFO = {
  accountNumber: "0329-1238790",
  accountName: "FATIMA BIBI",
  monthlyFee: 200,
  currency: "Rs",
  methods: ["JazzCash", "EasyPaisa"],
};

// Generate a random 6-character code
function generateRandomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing chars like O, 0, 1, I
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Get all activation codes
export async function getActivationCodes(): Promise<ActivationCode[]> {
  try {
    const data = await AsyncStorage.getItem(ACTIVATION_CODES_KEY);
    if (data) {
      return JSON.parse(data) as ActivationCode[];
    }
    return [];
  } catch (error) {
    console.error("Error getting activation codes:", error);
    return [];
  }
}

// Generate new activation codes
export async function generateActivationCodes(count: number): Promise<ActivationCode[]> {
  const existingCodes = await getActivationCodes();
  const existingCodeStrings = existingCodes.map(c => c.code);
  
  const newCodes: ActivationCode[] = [];
  for (let i = 0; i < count; i++) {
    let code = generateRandomCode();
    // Make sure code is unique
    while (existingCodeStrings.includes(code) || newCodes.some(c => c.code === code)) {
      code = generateRandomCode();
    }
    newCodes.push({
      code,
      createdAt: new Date().toISOString(),
      usedAt: null,
      usedBy: null,
      isUsed: false,
    });
  }
  
  const allCodes = [...existingCodes, ...newCodes];
  await AsyncStorage.setItem(ACTIVATION_CODES_KEY, JSON.stringify(allCodes));
  
  return newCodes;
}

// Delete unused codes
export async function deleteUnusedCodes(): Promise<void> {
  const codes = await getActivationCodes();
  const usedCodes = codes.filter(c => c.isUsed);
  await AsyncStorage.setItem(ACTIVATION_CODES_KEY, JSON.stringify(usedCodes));
}

// Check if admin password is correct
export function verifyAdminPassword(password: string): boolean {
  return password.toUpperCase() === ADMIN_PASSWORD;
}

export async function getSubscription(): Promise<SubscriptionData> {
  try {
    const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
    if (data) {
      const subscription = JSON.parse(data) as SubscriptionData;
      // Check if subscription has expired
      if (subscription.expiresAt) {
        const expiryDate = new Date(subscription.expiresAt);
        if (expiryDate < new Date()) {
          // Subscription expired
          return {
            isActive: false,
            activatedAt: subscription.activatedAt,
            expiresAt: subscription.expiresAt,
            phoneNumber: subscription.phoneNumber,
            transactionId: subscription.transactionId,
            usedCode: subscription.usedCode || null,
          };
        }
      }
      return subscription;
    }
    return {
      isActive: false,
      activatedAt: null,
      expiresAt: null,
      phoneNumber: null,
      transactionId: null,
      usedCode: null,
    };
  } catch (error) {
    console.error("Error getting subscription:", error);
    return {
      isActive: false,
      activatedAt: null,
      expiresAt: null,
      phoneNumber: null,
      transactionId: null,
      usedCode: null,
    };
  }
}

export async function isSubscriptionActive(): Promise<boolean> {
  const subscription = await getSubscription();
  if (!subscription.isActive || !subscription.expiresAt) {
    return false;
  }
  const expiryDate = new Date(subscription.expiresAt);
  return expiryDate > new Date();
}

export async function activateSubscription(
  phoneNumber: string,
  transactionId: string,
  activationCode: string
): Promise<{ success: boolean; message: string }> {
  const code = activationCode.toUpperCase().trim();
  
  try {
    // Call server API to validate and use the code
    const { getApiUrl } = await import("@/lib/query-client");
    const apiUrl = getApiUrl();
    const response = await fetch(new URL("/api/activate", apiUrl).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        phoneNumber,
        transactionId,
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Activation failed",
      };
    }

    const now = new Date();
    const expiryDate = data.expiresAt ? new Date(data.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Save subscription locally
    const subscription: SubscriptionData = {
      isActive: true,
      activatedAt: now.toISOString(),
      expiresAt: expiryDate.toISOString(),
      phoneNumber,
      transactionId,
      usedCode: code,
    };

    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    return {
      success: true,
      message: data.message || "Subscription activate ho gaya! 30 din ke liye access mil gaya.",
    };
  } catch (error) {
    console.error("Error activating subscription:", error);
    return {
      success: false,
      message: "Subscription activate karne mein masla aaya. Dubara try karein.",
    };
  }
}

export async function clearSubscription(): Promise<void> {
  await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
}

export function getDaysRemaining(expiresAt: string | null): number {
  if (!expiresAt) return 0;
  const expiry = new Date(expiresAt);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function formatExpiryDate(expiresAt: string | null): string {
  if (!expiresAt) return "";
  const date = new Date(expiresAt);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
