import { useState, useEffect, useCallback } from 'react';
import { moviesAPI } from '../utils/api';

export const usePopularMovies = (page = 1) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    moviesAPI.getPopular(page)
      .then(({ data: res }) => { if (!cancelled) { setData(res.data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page]);

  return { data, loading, error };
};

export const useTrendingMovies = () => { 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    moviesAPI.getTrending()
      .then(({ data: res }) => { setData(res.data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

export const useSearchMovies = (query, page = 1, year) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) { setData(null); return; }
    let cancelled = false;
    setLoading(true);
    moviesAPI.search(query, page, year)
      .then(({ data: res }) => { if (!cancelled) { setData(res.data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [query, page, year]);

  return { data, loading, error };
};

export const useMovieDetails = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    moviesAPI.getDetails(id)
      .then(({ data: res }) => { if (!cancelled) { setData(res.data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  return { data, loading, error };
};

export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    moviesAPI.getGenres()
      .then(({ data }) => setGenres(data.data.genres || []))
      .catch(console.error);
  }, []);
  return genres;
};

export const useDiscoverMovies = (filters) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(() => {
    setLoading(true);
    moviesAPI.discover(filters)
      .then(({ data: res }) => { setData(res.data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
};
