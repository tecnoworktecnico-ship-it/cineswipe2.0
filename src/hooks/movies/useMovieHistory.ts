import { useContext } from 'react';
import { MovieHistoryStateContext, MovieHistoryDispatchContext } from '../../context/movies/MovieHistoryContext';

/**
 * Hook para leer la lista histórica (solo lectura).
 */
export const useMovieHistory = () => {
  const context = useContext(MovieHistoryStateContext);
  if (context === undefined) {
    throw new Error('useMovieHistory debe ser utilizado dentro de un MovieHistoryProvider');
  }
  return context;
};

/**
 * Hook estricto para despachar eventos (no triggerea renders al leer estado).
 */
export const useMovieActions = () => {
  const context = useContext(MovieHistoryDispatchContext);
  if (context === undefined) {
    throw new Error('useMovieActions debe ser utilizado dentro de un MovieHistoryProvider');
  }
  return context;
};
