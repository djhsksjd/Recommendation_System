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
import { Interaction } from '@/lib/types';

/**
 * Get a single interaction by ID
 */
export async function getInteraction(interactionId: string): Promise<Interaction | null> {
  try {
    const interactionDoc = await getDoc(doc(db, COLLECTIONS.INTERACTIONS, interactionId));
    if (!interactionDoc.exists()) {
      return null;
    }
    return { id: interactionDoc.id, ...interactionDoc.data() } as Interaction;
  } catch (error) {
    console.error('Error getting interaction:', error);
    throw error;
  }
}

/**
 * Get all interactions
 */
export async function getInteractions(limitCount?: number): Promise<Interaction[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy('timestamp', 'desc')];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.INTERACTIONS), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Interaction));
  } catch (error) {
    console.error('Error getting interactions:', error);
    throw error;
  }
}

/**
 * Get interactions for a specific user
 */
export async function getUserInteractions(
  userId: string,
  limitCount?: number
): Promise<Interaction[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
    ];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.INTERACTIONS), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Interaction));
  } catch (error) {
    console.error('Error getting user interactions:', error);
    throw error;
  }
}

/**
 * Get interactions for a specific item
 */
export async function getItemInteractions(
  itemId: string,
  limitCount?: number
): Promise<Interaction[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('itemId', '==', itemId),
      orderBy('timestamp', 'desc'),
    ];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.INTERACTIONS), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Interaction));
  } catch (error) {
    console.error('Error getting item interactions:', error);
    throw error;
  }
}

/**
 * Get interactions by type
 */
export async function getInteractionsByType(
  type: Interaction['type'],
  limitCount?: number
): Promise<Interaction[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('type', '==', type),
      orderBy('timestamp', 'desc'),
    ];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.INTERACTIONS), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Interaction));
  } catch (error) {
    console.error('Error getting interactions by type:', error);
    throw error;
  }
}

/**
 * Create a new interaction
 */
export async function createInteraction(
  interactionData: Omit<Interaction, 'id'>
): Promise<string> {
  try {
    const interactionRef = await addDoc(collection(db, COLLECTIONS.INTERACTIONS), {
      ...interactionData,
      timestamp:
        interactionData.timestamp instanceof Timestamp
          ? interactionData.timestamp
          : Timestamp.fromDate(new Date(interactionData.timestamp as string)),
    });
    return interactionRef.id;
  } catch (error) {
    console.error('Error creating interaction:', error);
    throw error;
  }
}

/**
 * Update an interaction
 */
export async function updateInteraction(
  interactionId: string,
  updates: Partial<Interaction>
): Promise<void> {
  try {
    const interactionRef = doc(db, COLLECTIONS.INTERACTIONS, interactionId);
    await updateDoc(interactionRef, updates);
  } catch (error) {
    console.error('Error updating interaction:', error);
    throw error;
  }
}

