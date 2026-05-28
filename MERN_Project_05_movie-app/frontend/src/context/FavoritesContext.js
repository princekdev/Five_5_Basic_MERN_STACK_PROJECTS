import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { favoritesAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) { setFavorites([]); setFavoriteIds(new Set()); return; }
    setLoading(true);
    try {
      const { data } = await favoritesAPI.getAll();
      setFavorites(data.data);
      setFavoriteIds(new Set(data.data.map((f) => f.movieId)));
    } catch (err) {
      console.error('Failed to fetch favorites', err);
    } finally {
      setLoading(false);
    } 
  }, [isAuthenticated]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const addFavorite = async (movie) => {
    try {
      const { data } = await favoritesAPI.add(movie);
      setFavorites((prev) => [data.data, ...prev]);
      setFavoriteIds((prev) => new Set([...prev, movie.movieId]));
      toast.success('Added to favorites!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add favorite';
      toast.error(msg);
    }
  };

  const removeFavorite = async (movieId) => {
    try {
      await favoritesAPI.remove(movieId);
      setFavorites((prev) => prev.filter((f) => f.movieId !== movieId));
      setFavoriteIds((prev) => { const s = new Set(prev); s.delete(movieId); return s; });
      toast.success('Removed from favorites.');
    } catch (err) {
      toast.error('Failed to remove favorite');
    }
  };

  const isFavorited = (movieId) => favoriteIds.has(Number(movieId));

  const toggleFavorite = (movie) => {
    const id = Number(movie.movieId || movie.id);
    if (isFavorited(id)) removeFavorite(id);
    else addFavorite({ ...movie, movieId: id });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, loading, addFavorite, removeFavorite, isFavorited, toggleFavorite, refetch: fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};
