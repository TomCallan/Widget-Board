export interface MarketplaceWidget {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  version: string;
  author: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    verified: boolean;
    rating: number;
    totalSales: number;
  };
  category: string;
  tags: string[];
  price: {
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP';
    type: 'free' | 'paid' | 'freemium';
  };
  screenshots: string[];
  icon: string; // Base64 or URL
  downloadCount: number;
  rating: {
    average: number;
    count: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  reviews: MarketplaceReview[];
  features: string[];
  compatibility: {
    minVersion: string;
    maxVersion?: string;
  };
  size: {
    bundleSize: number; // in KB
    dependencies: string[];
  };
  license: 'MIT' | 'GPL' | 'Commercial' | 'Custom';
  repository?: string;
  documentation?: string;
  demo?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'deprecated' | 'pending' | 'rejected';
  trending: boolean;
  featured: boolean;
  // Widget code/configuration
  widgetCode?: string; // Base64 encoded widget code
  configSchema?: any; // Widget configuration schema
}

export interface MarketplaceReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: string;
  verified: boolean; // Verified purchase
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  joinedAt: string;
  stats: {
    widgetsPublished: number;
    totalDownloads: number;
    totalEarnings: number;
    averageRating: number;
  };
  paymentMethods: PaymentMethod[];
  preferences: {
    notifications: boolean;
    publicProfile: boolean;
    showEarnings: boolean;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'crypto';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'refund';
  widgetId: string;
  widgetName: string;
  amount: number;
  currency: string;
  buyerId?: string;
  sellerId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  completedAt?: string;
}

export interface MarketplaceFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  tags?: string[];
  author?: string;
  sortBy: 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high' | 'trending';
  priceType?: 'free' | 'paid' | 'freemium';
}

export interface WidgetSubmission {
  name: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  price: {
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP';
    type: 'free' | 'paid' | 'freemium';
  };
  screenshots: File[];
  icon: File;
  widgetCode: File;
  license: string;
  repository?: string;
  documentation?: string;
  demo?: string;
}