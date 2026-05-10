import { useState, useEffect, useCallback } from 'react';
import type { Anime, Genre, JikanResponse } from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url);
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      continue;
    }
    if (!res.ok) throw new Error(String(res.status));
    return res;
  }
  throw new Error('429');
}

export function useTopAnime(page = 1) {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchWithRetry(`${BASE_URL}/top/anime?page=${page}&limit=20`)
      .then(r => r.json())
      .then((data: JikanResponse<Anime[]>) => {
        if (!cancelled) {
          setAnime(data.data ?? []);
          setHasNext(data.pagination?.has_next_page ?? false);
        }
      })
      .catch(() => {
        if (!cancelled) setError('데이터를 불러오지 못했습니다. 잠시 후 새로고침해주세요.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page]);

  return { anime, loading, error, hasNext };
}

export function useSearchAnime() {
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);

  const search = useCallback(async (query: string, genreId?: number, page = 1) => {
    if (!query.trim() && !genreId) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (query.trim()) params.set('q', query.trim());
      if (genreId) params.set('genres', String(genreId));

      const res = await fetchWithRetry(`${BASE_URL}/anime?${params}`);
      const data: JikanResponse<Anime[]> = await res.json();
      setResults(data.data ?? []);
      setHasNext(data.pagination?.has_next_page ?? false);
    } catch {
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, hasNext, search };
}

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    // Stagger genres request to avoid concurrent 429s
    const timer = setTimeout(() => {
      fetchWithRetry(`${BASE_URL}/genres/anime`)
        .then(r => r.json())
        .then((data: JikanResponse<Genre[]>) => setGenres((data.data ?? []).slice(0, 20)))
        .catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return genres;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('anime-favorites') ?? '[]');
    } catch {
      return [];
    }
  });

  const toggle = useCallback((id: number) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('anime-favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  return { favorites, toggle };
}
