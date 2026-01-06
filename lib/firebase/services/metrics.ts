import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';
import { SystemMetrics } from '@/lib/types';

const METRICS_DOC_ID = 'current';

/**
 * Get current system metrics
 */
export async function getSystemMetrics(): Promise<SystemMetrics | null> {
  try {
    const metricsDoc = await getDoc(doc(db, COLLECTIONS.SYSTEM_METRICS, METRICS_DOC_ID));
    if (!metricsDoc.exists()) {
      return null;
    }
    return metricsDoc.data() as SystemMetrics;
  } catch (error) {
    console.error('Error getting system metrics:', error);
    throw error;
  }
}

/**
 * Update system metrics
 */
export async function updateSystemMetrics(metrics: Partial<SystemMetrics>): Promise<void> {
  try {
    const metricsRef = doc(db, COLLECTIONS.SYSTEM_METRICS, METRICS_DOC_ID);
    const existingDoc = await getDoc(metricsRef);

    if (existingDoc.exists()) {
      await updateDoc(metricsRef, {
        ...metrics,
        lastUpdated: Timestamp.now(),
      });
    } else {
      await setDoc(metricsRef, {
        ...metrics,
        lastUpdated: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error updating system metrics:', error);
    throw error;
  }
}

/**
 * Calculate and update system metrics from current data
 * Note: This should ideally be done in a Cloud Function or scheduled job
 */
export async function calculateSystemMetrics(): Promise<SystemMetrics> {
  // This is a placeholder - in production, you'd want to:
  // 1. Query all collections to get counts
  // 2. Calculate averages and rates
  // 3. Update the metrics document
  // For now, this is just a structure example

  const metrics: SystemMetrics = {
    totalUsers: 0,
    totalItems: 0,
    totalInteractions: 0,
    totalRecommendations: 0,
    averageRating: 0,
    clickThroughRate: 0,
    conversionRate: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    lastUpdated: Timestamp.now(),
  };

  await updateSystemMetrics(metrics);
  return metrics;
}

