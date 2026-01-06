import { useState, useEffect } from 'react';
import {
  getUsers,
  getItems,
  getInteractions,
  getRecommendations,
  getSystemMetrics,
  getPipelineStages,
} from '@/lib/firebase/services';
import { User, Item, Interaction, Recommendation, SystemMetrics, RecommendationPipeline } from '@/lib/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return { users, loading, error };
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        setError(null);
        const data = await getItems();
        setItems(data);
      } catch (err) {
        console.error('Error loading items:', err);
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  return { items, loading, error };
}

export function useInteractions() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInteractions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getInteractions();
        setInteractions(data);
      } catch (err) {
        console.error('Error loading interactions:', err);
        setError('Failed to load interactions');
      } finally {
        setLoading(false);
      }
    }
    loadInteractions();
  }, []);

  return { interactions, loading, error };
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecommendations();
        setRecommendations(data);
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, []);

  return { recommendations, loading, error };
}

export function useSystemMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        setError(null);
        const data = await getSystemMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Error loading metrics:', err);
        setError('Failed to load system metrics');
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return { metrics, loading, error };
}

export function usePipelineStages() {
  const [stages, setStages] = useState<RecommendationPipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStages() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPipelineStages();
        setStages(data);
      } catch (err) {
        console.error('Error loading pipeline stages:', err);
        setError('Failed to load pipeline stages');
      } finally {
        setLoading(false);
      }
    }
    loadStages();
  }, []);

  return { stages, loading, error };
}

