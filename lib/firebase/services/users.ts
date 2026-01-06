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
import { User } from '@/lib/types';

/**
 * Get a single user by ID
 */
export async function getUser(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) {
      return null;
    }
    return { id: userDoc.id, ...userDoc.data() } as User;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

/**
 * Get all users
 */
export async function getUsers(limitCount?: number): Promise<User[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy('registrationDate', 'desc')];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.USERS), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now();
    const userRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      registrationDate: userData.registrationDate || now,
      createdAt: now,
      updatedAt: now,
    });
    return userRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update a user
 */
export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Get users by preferences
 */
export async function getUsersByPreference(preference: string): Promise<User[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('preferences', 'array-contains', preference)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
  } catch (error) {
    console.error('Error getting users by preference:', error);
    throw error;
  }
}

