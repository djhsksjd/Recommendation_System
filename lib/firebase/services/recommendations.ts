import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';
import { Recommendation } from '@/lib/types';

/**
 * Get a single recommendation by ID
 */
export async function getRecommendation(recommendationId: string): Promise<Recommendation | null> {
  try {
    const recDoc = await getDoc(doc(db, COLLECTIONS.RECOMMENDATIONS, recommendationId));
    if (!recDoc.exists()) {
      return null;
    }
    return { id: recDoc.id, ...recDoc.data() } as Recommendation;
  } catch (error) {
    console.error('Error getting recommendation:', error);
    throw error;
  }
}

/**
 * Get all recommendations
 */
export async function getRecommendations(limitCount?: number): Promise<Recommendation[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy('timestamp', 'desc')];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.RECOMMENDATIONS), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Recommendation));
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

/**
 * Get recommendations for a specific user
 */
export async function getUserRecommendations(
  userId: string,
  limitCount: number = 20
): Promise<Recommendation[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.RECOMMENDATIONS),
      where('userId', '==', userId),
      orderBy('score', 'desc'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Recommendation));
  } catch (error) {
    console.error('Error getting user recommendations:', error);
    throw error;
  }
}

/**
 * Get recommendations by algorithm
 */
export async function getRecommendationsByAlgorithm(
  algorithm: string,
  limitCount?: number
): Promise<Recommendation[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('algorithm', '==', algorithm),
      orderBy('timestamp', 'desc'),
    ];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.RECOMMENDATIONS), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Recommendation));
  } catch (error) {
    console.error('Error getting recommendations by algorithm:', error);
    throw error;
  }
}

/**
 * Create a new recommendation
 */
export async function createRecommendation(
  recommendationData: Omit<Recommendation, 'id' | 'createdAt'>
): Promise<string> {
  try {
    const now = Timestamp.now();
    const recRef = await addDoc(collection(db, COLLECTIONS.RECOMMENDATIONS), {
      ...recommendationData,
      shown: recommendationData.shown || false,
      clicked: recommendationData.clicked || false,
      converted: recommendationData.converted || false,
      timestamp:
        recommendationData.timestamp instanceof Timestamp
          ? recommendationData.timestamp
          : Timestamp.fromDate(new Date(recommendationData.timestamp as string)),
      createdAt: now,
    });
    return recRef.id;
  } catch (error) {
    console.error('Error creating recommendation:', error);
    throw error;
  }
}

/**
 * Update a recommendation (e.g., mark as shown, clicked, converted)
 */
export async function updateRecommendation(
  recommendationId: string,
  updates: Partial<Recommendation>
): Promise<void> {
  try {
    const recRef = doc(db, COLLECTIONS.RECOMMENDATIONS, recommendationId);
    await updateDoc(recRef, updates);
  } catch (error) {
    console.error('Error updating recommendation:', error);
    throw error;
  }
}

/**
 * Mark recommendation as shown
 */
export async function markRecommendationAsShown(recommendationId: string): Promise<void> {
  await updateRecommendation(recommendationId, { shown: true });
}

/**
 * Mark recommendation as clicked
 */
export async function markRecommendationAsClicked(recommendationId: string): Promise<void> {
  await updateRecommendation(recommendationId, { clicked: true });
}

/**
 * Mark recommendation as converted
 */
export async function markRecommendationAsConverted(recommendationId: string): Promise<void> {
  await updateRecommendation(recommendationId, { converted: true });
}

