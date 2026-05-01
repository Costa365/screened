import { useState, useEffect, useCallback } from 'react';
import { api, Movie, MovieCreate, MovieUpdate } from '../api/client';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    try {
      if (!silent) setIsLoading(true);
      const data = await api.getMovies();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    const refresh = () => fetchMovies({ silent: true });
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
    };
  }, [fetchMovies]);

  const addMovie = async (movie: MovieCreate) => {
    const newMovie = await api.createMovie(movie);
    setMovies(prev => [newMovie, ...prev]);
    return newMovie;
  };

  const updateMovie = async (id: number, update: MovieUpdate) => {
    const updated = await api.updateMovie(id, update);
    setMovies(prev => prev.map(m => m.id === id ? updated : m));
    return updated;
  };

  const deleteMovie = async (id: number) => {
    await api.deleteMovie(id);
    setMovies(prev => prev.filter(m => m.id !== id));
  };

  return {
    movies,
    isLoading,
    error,
    fetchMovies,
    addMovie,
    updateMovie,
    deleteMovie,
  };
}
