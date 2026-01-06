/**
 * Complete TypeScript type definitions matching the Firestore schema
 * These types should be used for all Firestore operations
 */

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// USER SCHEMA
// ============================================================================

export interface UserLocation {
  country?: string;
  city?: string;
  timezone?: string;
}

export interface UserBehaviorProfile {
  avgSessionDuration?: number;
  preferredCategories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface UserSchema {
  // Identity
  id: string;
  email: string;
  name: string;

  // Demographics
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location?: UserLocation;

  // Preferences & Behavior
  preferences: string[];
  interests: string[];
  behaviorProfile?: UserBehaviorProfile;

  // Statistics
  totalInteractions: number;
  totalPurchases: number;
  totalSpent: number;
  averageRating: number;

  // Metadata
  registrationDate: Timestamp;
  lastActiveDate: Timestamp;
  isActive: boolean;
  subscriptionTier?: 'free' | 'premium' | 'enterprise';

  // System fields
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
}

// ============================================================================
// ITEM SCHEMA
// ============================================================================

export interface ItemDiscount {
  percentage: number;
  validUntil: Timestamp;
}

export interface ItemSchema {
  // Identity
  id: string;
  title: string;
  description: string;

  // Classification
  category: string;
  subcategory?: string;
  tags: string[];
  brand?: string;

  // Pricing
  price: number;
  originalPrice?: number;
  currency: string;
  discount?: ItemDiscount;

  // Ratings & Reviews
  rating: number;
  ratingCount: number;
  reviewCount: number;

  // Inventory
  stock: number;
  isAvailable: boolean;
  sku?: string;

  // Media
  images: string[];
  thumbnailUrl?: string;
  videoUrl?: string;

  // Attributes
  attributes?: Record<string, string | number | boolean | string[]>;

  // SEO & Discovery
  keywords: string[];
  searchableText: string;

  // Statistics
  viewCount: number;
  clickCount: number;
  purchaseCount: number;
  conversionRate: number;

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  isPublished: boolean;
  version: number;
}

// ============================================================================
// INTERACTION SCHEMA
// ============================================================================

export type InteractionType =
  | 'view'
  | 'click'
  | 'add_to_cart'
  | 'purchase'
  | 'rating'
  | 'review'
  | 'share'
  | 'wishlist';

export interface InteractionPurchaseData {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountApplied: number;
  paymentMethod: string;
  transactionId: string;
}

export interface InteractionSchema {
  // Identity
  id: string;
  userId: string;
  itemId: string;

  // Interaction Details
  type: InteractionType;
  timestamp: Timestamp;

  // Context
  sessionId?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  platform?: 'web' | 'ios' | 'android';
  referrer?: string;

  // Interaction-specific Data
  duration?: number;
  rating?: number;
  reviewText?: string;

  // Purchase-specific Data
  purchaseData?: InteractionPurchaseData;

  // Recommendation Context
  recommendationId?: string;
  algorithm?: string;

  // Metadata
  metadata?: Record<string, unknown>;

  // System fields
  createdAt: Timestamp;
}

// ============================================================================
// RECOMMENDATION SCHEMA
// ============================================================================

export interface RecommendationContext {
  userPreferences?: string[];
  recentInteractions?: string[];
  sessionData?: Record<string, unknown>;
}

export interface RecommendationSchema {
  // Identity
  id: string;
  userId: string;
  itemId: string;

  // Recommendation Details
  score: number;
  algorithm: string;
  algorithmVersion?: string;
  reason: string;

  // Ranking
  rank: number;
  batchId?: string;

  // Performance Tracking
  shown: boolean;
  shownAt?: Timestamp;
  clicked: boolean;
  clickedAt?: Timestamp;
  converted: boolean;
  convertedAt?: Timestamp;

  // Context
  context?: RecommendationContext;

  // A/B Testing
  experimentId?: string;
  variant?: string;

  // Metadata
  timestamp: Timestamp;
  expiresAt?: Timestamp;
  createdAt: Timestamp;
}

// ============================================================================
// SYSTEM METRICS SCHEMA
// ============================================================================

export interface SystemMetricsSchema {
  // Document ID: 'current'
  id: 'current';

  // User Metrics
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;

  // Item Metrics
  totalItems: number;
  availableItems: number;
  newItemsToday: number;
  newItemsThisWeek: number;

  // Interaction Metrics
  totalInteractions: number;
  interactionsToday: number;
  interactionsThisWeek: number;
  averageInteractionsPerUser: number;

  // Recommendation Metrics
  totalRecommendations: number;
  recommendationsGeneratedToday: number;
  averageRecommendationsPerUser: number;

  // Performance Metrics
  averageRating: number;
  clickThroughRate: number;
  conversionRate: number;
  averageOrderValue: number;

  // Model Performance
  precision: number;
  recall: number;
  f1Score: number;
  meanReciprocalRank: number;
  normalizedDiscountedCumulativeGain: number;

  // Business Metrics
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;

  // Timestamps
  lastUpdated: Timestamp;
  calculatedAt: Timestamp;
  periodStart: Timestamp;
  periodEnd: Timestamp;
}

// ============================================================================
// PIPELINE STAGE SCHEMA
// ============================================================================

export type PipelineStageStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';

export interface PipelineStageErrorDetails {
  code?: string;
  message: string;
  stack?: string;
}

export interface PipelineStageSchema {
  // Identity
  id: string;
  stage: string;
  description: string;

  // Status
  status: PipelineStageStatus;

  // Execution Details
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  duration?: number;

  // Data Processing
  dataCount: number;
  inputCount?: number;
  outputCount?: number;

  // Error Handling
  error?: string;
  errorDetails?: PipelineStageErrorDetails;

  // Dependencies
  dependsOn?: string[];
  nextStages?: string[];

  // Configuration
  config?: Record<string, unknown>;

  // Metadata
  runId: string;
  version: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// ALGORITHM SCHEMA
// ============================================================================

export interface AlgorithmPerformance {
  precision: number;
  recall: number;
  f1Score: number;
  accuracy?: number;
  meanReciprocalRank?: number;
  normalizedDiscountedCumulativeGain?: number;
}

export interface AlgorithmSchema {
  // Identity
  id: string;
  name: string;
  description: string;

  // Status
  enabled: boolean;
  isDefault: boolean;

  // Configuration
  parameters: Record<string, unknown>;

  // Performance Metrics
  performance: AlgorithmPerformance;

  // Usage Statistics
  usageCount: number;
  lastUsedAt?: Timestamp;

  // Training Information
  lastTrained?: Timestamp;
  trainingDuration?: number;
  trainingDataSize?: number;

  // Versioning
  version: string;
  changelog?: string[];

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Type for creating a new document (without id and timestamps)
 */
export type CreateUserInput = Omit<UserSchema, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateItemInput = Omit<ItemSchema, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateInteractionInput = Omit<InteractionSchema, 'id' | 'createdAt'>;
export type CreateRecommendationInput = Omit<RecommendationSchema, 'id' | 'createdAt'>;
export type CreatePipelineStageInput = Omit<PipelineStageSchema, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateAlgorithmInput = Omit<AlgorithmSchema, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Type for updating a document (all fields optional except id)
 */
export type UpdateUserInput = Partial<Omit<UserSchema, 'id'>> & { id: string };
export type UpdateItemInput = Partial<Omit<ItemSchema, 'id'>> & { id: string };
export type UpdateInteractionInput = Partial<Omit<InteractionSchema, 'id'>> & { id: string };
export type UpdateRecommendationInput = Partial<Omit<RecommendationSchema, 'id'>> & { id: string };
export type UpdatePipelineStageInput = Partial<Omit<PipelineStageSchema, 'id'>> & { id: string };
export type UpdateAlgorithmInput = Partial<Omit<AlgorithmSchema, 'id'>> & { id: string };

import { DocumentReference } from 'firebase/firestore';

/**
 * Type for query results (with Firestore document metadata)
 */
export interface FirestoreDocument<T> {
  id: string;
  data: T;
  exists: boolean;
  ref: DocumentReference<T>;
}

