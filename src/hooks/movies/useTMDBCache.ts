import { useCallback } from 'react';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Hook secundario para gestionar la persistencia temporal de respuestas de TMDB.
 * Utiliza sessionStorage para evitar peticiones redundantes en la misma sesión.
 */
export const useTMDBCache = () => {
  /**
   * Recupera un valor del caché si no ha expirado.
   */
  const getCache = useCallback(<T>(key: string): T | null => {
    const cachedRecordStr = sessionStorage.getItem(key);
    if (!cachedRecordStr) return null;

    try {
      const cachedRecord = JSON.parse(cachedRecordStr);
      if (Date.now() - cachedRecord.timestamp < CACHE_TTL_MS) {
        return cachedRecord.data as T;
      }
      // Limpieza si el dato es antiguo
      sessionStorage.removeItem(key);
    } catch (e) {
      sessionStorage.removeItem(key);
    }
    return null;
  }, []);

  /**
   * Almacena un valor en el caché con un timestamp actual.
   */
  const setCache = useCallback(<T>(key: string, data: T): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch (e) {
      console.warn('[useTMDBCache] No se pudo guardar en sessionStorage:', e);
    }
  }, []);

  return { getCache, setCache };
};
