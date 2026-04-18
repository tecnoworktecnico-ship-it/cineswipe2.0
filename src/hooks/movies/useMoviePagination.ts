import { useState, useCallback } from 'react';
import { TMDBMovie } from '../../types/tmdb.types';

/**
 * Hook secundario para la gestión del estado de paginación y acumulación de películas.
 * Desacopla la lógica de listas del estado de carga/error.
 */
export const useMoviePagination = () => {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  /**
   * Agrega resultados de una nueva página al mazo existente.
   */
  const addResults = useCallback((newMovies: TMDBMovie[], totalPages: number, currentPage: number) => {
    setMovies(prev => {
      // Evitar duplicados por ID (defensa en profundidad)
      const existingIds = new Set(prev.map(m => m.id));
      const filtered = newMovies.filter(m => !existingIds.has(m.id));
      return [...prev, ...filtered];
    });
    setPage(currentPage);
    setHasMore(currentPage < totalPages);
  }, []);

  /**
   * Reinicia el estado de paginación (útil para cambios de filtros).
   */
  const resetPagination = useCallback((initialMovies: TMDBMovie[], totalPages: number, currentPage: number = 1) => {
    setMovies(initialMovies);
    setPage(currentPage);
    setHasMore(currentPage < totalPages);
  }, []);

  return { 
    movies, 
    page, 
    hasMore, 
    addResults, 
    resetPagination,
    setPage 
  };
};
