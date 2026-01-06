/**
 * Firestore Collection Names
 * 
 * This file defines all collection names used in the recommendation system.
 * Using constants helps prevent typos and makes refactoring easier.
 */

export const COLLECTIONS = {
  USERS: 'users',
  ITEMS: 'items',
  INTERACTIONS: 'interactions',
  RECOMMENDATIONS: 'recommendations',
  SYSTEM_METRICS: 'system_metrics',
  PIPELINE_STAGES: 'pipeline_stages',
  ALGORITHMS: 'algorithms',
  USER_PREFERENCES: 'user_preferences',
} as const;

/**
 * Firestore Subcollection Paths
 */
export const SUBCOLLECTIONS = {
  USER_INTERACTIONS: (userId: string) => `users/${userId}/interactions`,
  USER_RECOMMENDATIONS: (userId: string) => `users/${userId}/recommendations`,
  ITEM_INTERACTIONS: (itemId: string) => `items/${itemId}/interactions`,
} as const;

/**
 * Firestore Index Hints
 * 
 * These are used to optimize queries. Make sure to create corresponding
 * composite indexes in Firebase Console.
 */
export const INDEXES = {
  INTERACTIONS_BY_USER_AND_TIME: 'interactions_userId_timestamp',
  INTERACTIONS_BY_ITEM_AND_TIME: 'interactions_itemId_timestamp',
  RECOMMENDATIONS_BY_USER_AND_SCORE: 'recommendations_userId_score',
  RECOMMENDATIONS_BY_ALGORITHM: 'recommendations_algorithm',
} as const;

