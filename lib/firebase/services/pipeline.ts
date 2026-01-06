import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';
import { RecommendationPipeline } from '@/lib/types';

/**
 * Get a single pipeline stage by ID
 */
export async function getPipelineStage(stageId: string): Promise<RecommendationPipeline | null> {
  try {
    const stageDoc = await getDoc(doc(db, COLLECTIONS.PIPELINE_STAGES, stageId));
    if (!stageDoc.exists()) {
      return null;
    }
    const data = stageDoc.data();
    return {
      stage: data.stage,
      description: data.description,
      status: data.status,
      dataCount: data.dataCount,
      duration: data.duration,
    } as RecommendationPipeline;
  } catch (error) {
    console.error('Error getting pipeline stage:', error);
    throw error;
  }
}

/**
 * Get all pipeline stages
 */
export async function getPipelineStages(limitCount?: number): Promise<RecommendationPipeline[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy('startedAt', 'desc')];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.PIPELINE_STAGES), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        stage: data.stage,
        description: data.description,
        status: data.status,
        dataCount: data.dataCount,
        duration: data.duration,
      } as RecommendationPipeline;
    });
  } catch (error) {
    console.error('Error getting pipeline stages:', error);
    throw error;
  }
}

/**
 * Get pipeline stages by status
 */
export async function getPipelineStagesByStatus(
  status: RecommendationPipeline['status'],
  limitCount?: number
): Promise<RecommendationPipeline[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('status', '==', status),
      orderBy('startedAt', 'desc'),
    ];
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, COLLECTIONS.PIPELINE_STAGES), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        stage: data.stage,
        description: data.description,
        status: data.status,
        dataCount: data.dataCount,
        duration: data.duration,
      } as RecommendationPipeline;
    });
  } catch (error) {
    console.error('Error getting pipeline stages by status:', error);
    throw error;
  }
}

