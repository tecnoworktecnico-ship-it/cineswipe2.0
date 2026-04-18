import { useState, useCallback, useEffect, useRef } from 'react';
import { TMDBMovie, TMDBResponse } from '../../types/tmdb.types';
import { useTMDBCache } from './useTMDBCache';
import { useMoviePagination } from './useMoviePagination';

const RAW_URL = 'https://api.themoviedb.org/3';

export interface UseMoviesOptions {
  genre?: number;
  year?: number;
}

/**
 * Hook principal (Orquestador) para la gestión de películas en CineSwipe.
 * 
 * Resuelve la separación de responsabilidades delegando en:
 * - useTMDBCache: Persistencia en sessionStorage.
 * - useMoviePagination: Gestión de listas acumuladas y punteros de página.
 * 
 * @param {UseMoviesOptions} [options] - Filtros de búsqueda opcionales.
 */
export const useMovies = (options?: UseMoviesOptions) => {
  // Estado local de metadatos de la petición (Desacoplado de la paginación de datos)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { getCache, setCache } = useTMDBCache();
  const { movies, page, hasMore, addResults, resetPagination } = useMoviePagination();
  
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Lógica centralizada de obtención de datos.
   * Orquesta: Abort Controller -> Caché -> Fetch -> Actualización de Estado.
   */
  const handleFetch = useCallback(async (currentPage: number, reset: boolean = false) => {
    // 1. Gestión de Aborto
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const apiKey = import.meta.env.VITE_TMDB_KEY;
    if (!apiKey) {
      setError("VITE_TMDB_KEY no configurada.");
      return;
    }

    const queryParams = new URLSearchParams({
      api_key: apiKey,
      page: currentPage.toString(),
      sort_by: 'popularity.desc',
      language: 'es-MX'
    });

    if (options?.genre) queryParams.append('with_genres', options.genre.toString());
    if (options?.year) queryParams.append('primary_release_year', options.year.toString());

    const cacheKey = `cineswipe_v2_${queryParams.toString()}`;

    // 2. Intento de recuperación desde Caché
    const cachedData = getCache<TMDBResponse>(cacheKey);
    if (cachedData) {
      if (reset) resetPagination(cachedData.results, cachedData.total_pages, cachedData.page);
      else addResults(cachedData.results, cachedData.total_pages, cachedData.page);
      return;
    }

    // 3. Petición de Red
    setLoading(true);
    setError(null);

    try {
      let data: TMDBResponse | null = null;

      // Optimización LCP: Interceptar prefetch si existe
      if (currentPage === 1 && !options?.genre && !options?.year && (window as any).__TMDB_PREFETCH__) {
        data = await (window as any).__TMDB_PREFETCH__;
        delete (window as any).__TMDB_PREFETCH__;
      }

      if (!data) {
        const url = `${RAW_URL}/discover/movie?${queryParams.toString()}`;
        const response = await fetch(url, { signal: abortController.signal });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        data = await response.json();
      }

      if (data) {
        // Guardar en Caché para futuras consultas idénticas
        setCache(cacheKey, data);
        
        // Actualizar el estado de datos/paginación
        if (reset) {
          resetPagination(data.results, data.total_pages, data.page);
        } else {
          addResults(data.results, data.total_pages, data.page);
        }
      }

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Error Desconocido');
      }
    } finally {
      // Solo apagar loading si esta petición es la última activa
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [options?.genre, options?.year, getCache, setCache, addResults, resetPagination]);

  // Observer de inicialización y cambios de filtros
  useEffect(() => {
    handleFetch(1, true);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [handleFetch]);

  /**
   * Interfaz pública para cargar la siguiente página.
   */
  const loadMore = useCallback(() => {
    if (!loading && hasMore && !error) {
      handleFetch(page + 1, false);
    }
  }, [loading, hasMore, error, page, handleFetch]);

  return { movies, loading, error, loadMore, hasMore };
};
