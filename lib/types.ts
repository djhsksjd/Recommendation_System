// Type definitions for the recommendation system
import { Timestamp } from 'firebase/firestore';

// Base types for Firestore (with Timestamp)
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  preferences: string[];
  registrationDate: Timestamp | string;
  totalInteractions: number;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface Item {
  id: string;
  title: string;
  category: string;
  tags: string[];
  price: number;
  rating: number;
  ratingCount?: number;
  description: string;
  createdAt: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface Interaction {
  id: string;
  userId: string;
  itemId: string;
  type: 'view' | 'click' | 'purchase' | 'rating';
  rating?: number;
  timestamp: Timestamp | string;
  duration?: number; // in seconds
  metadata?: Record<string, unknown>;
}

export interface Recommendation {
  id: string;
  userId: string;
  itemId: string;
  score: number;
  algorithm: string;
  timestamp: Timestamp | string;
  reason: string;
  shown?: boolean;
  clicked?: boolean;
  converted?: boolean;
  createdAt?: Timestamp | string;
}

export interface SystemMetrics {
  totalUsers: number;
  totalItems: number;
  totalInteractions: number;
  totalRecommendations: number;
  averageRating: number;
  clickThroughRate: number;
  conversionRate: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastUpdated?: Timestamp | string;
}

export interface RecommendationPipeline {
  stage: string;
  description: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  dataCount: number;
  duration: number; // in milliseconds
  startedAt?: Timestamp | string;
  completedAt?: Timestamp | string;
  error?: string;
}

export interface Algorithm {
  name: string;
  description: string;
  enabled: boolean;
  parameters: Record<string, unknown>;
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
  };
  lastTrained?: Timestamp | string;
}

