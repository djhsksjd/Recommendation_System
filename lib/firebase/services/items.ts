import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';
import { Item } from '@/lib/types';

/**
 * Get a single item by ID
 */
export async function getItem(itemId: string): Promise<Item | null> {
  try {
    const itemDoc = await getDoc(doc(db, COLLECTIONS.ITEMS, itemId));
    if (!itemDoc.exists()) {
      return null;
    }
    return { id: itemDoc.id, ...itemDoc.data() } as Item;
  } catch (error) {
    console.error('Error getting item:', error);
    throw error;
  }
}

/**
 * Get all items
 */
export async function getItems(limitCount?: number): Promise<Item[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.ITEMS), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item));
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
}

/**
 * Get items by category
 */
export async function getItemsByCategory(category: string, limitCount?: number): Promise<Item[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('category', '==', category),
      orderBy('rating', 'desc'),
    ];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.ITEMS), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item));
  } catch (error) {
    console.error('Error getting items by category:', error);
    throw error;
  }
}

/**
 * Get popular items (by rating)
 */
export async function getPopularItems(limitCount: number = 10): Promise<Item[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.ITEMS),
      orderBy('rating', 'desc'),
      orderBy('ratingCount', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item));
  } catch (error) {
    console.error('Error getting popular items:', error);
    throw error;
  }
}

/**
 * Create a new item
 */
export async function createItem(itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now();
    const itemRef = await addDoc(collection(db, COLLECTIONS.ITEMS), {
      ...itemData,
      ratingCount: itemData.ratingCount || 0,
      createdAt: now,
      updatedAt: now,
    });
    return itemRef.id;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
}

/**
 * Update an item
 */
export async function updateItem(itemId: string, updates: Partial<Item>): Promise<void> {
  try {
    const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

/**
 * Delete an item
 */
export async function deleteItem(itemId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.ITEMS, itemId));
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

