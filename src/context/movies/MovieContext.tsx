import React, { useReducer, useEffect, useMemo, useRef } from 'react';
import { TMDBMovie } from '../../types/tmdb.types';
import { supabase } from '../../lib/supabase';

// ==========================================
// TIPOS E INTERFACES
// ==========================================

export interface HistoryItem {
  movie: TMDBMovie;
  action: 'LIKE' | 'DISLIKE';
  timestamp: number;
}

export interface MovieHistoryState {
  history: HistoryItem[];
}

export type MovieHistoryAction =
  | { type: 'SWIPE_RIGHT'; payload: TMDBMovie } // Equivalente a LIKE
  | { type: 'SWIPE_LEFT'; payload: TMDBMovie }  // Equivalente a DISLIKE
  | { type: 'UNDO_LAST' }
  | { type: 'CLEAR_HISTORY' };

const MAX_HISTORY_ITEMS = 50;
const STORAGE_KEY = 'cineswipe_user_history';
const SESSION_KEY = 'cineswipe_session_id';

// Obtener o generar un session_id único para este navegador
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// ==========================================
// ESTADO INICIAL Y REDUCER PURO
// ==========================================

const initialState: MovieHistoryState = {
  history: []
};

// Lazy initializer para evitar flash de hidratación (flicker) al cargar el provider
const initHistoryState = (fallbackState: MovieHistoryState): MovieHistoryState => {
  if (typeof window === 'undefined') return fallbackState;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : fallbackState;
  } catch (err) {
    console.error("Error leyendo historial guardado:", err);
    return fallbackState;
  }
};

/**
 * Función Reducer pura.
 * Computa el estado entrante y saliente sin ejecutar "Side-Effects" (no llama APIs ni Storage).
 */
function movieHistoryReducer(state: MovieHistoryState, action: MovieHistoryAction): MovieHistoryState {
  switch (action.type) {
    case 'SWIPE_RIGHT':
    case 'SWIPE_LEFT': {
      const newItem: HistoryItem = {
        movie: action.payload,
        action: action.type === 'SWIPE_RIGHT' ? 'LIKE' : 'DISLIKE',
        timestamp: Date.now()
      };

      // Apilamos primero (última acción en el index 0)
      const newHistory = [newItem, ...state.history];

      // Limitamos aplicando FIFO (remover el más antiguo al sobrepasar el umbral)
      if (newHistory.length > MAX_HISTORY_ITEMS) {
        newHistory.pop();
      }

      return { ...state, history: newHistory };
    }

    case 'UNDO_LAST': {
      if (state.history.length === 0) return state;
      // Remueve el primer elemento (la acción más reciente)
      const newHistory = [...state.history];
      newHistory.shift(); 
      return { ...state, history: newHistory };
    }

    case 'CLEAR_HISTORY': {
      return { ...state, history: [] };
    }

    default:
      return state;
  }
}

import { MovieHistoryStateContext, MovieHistoryDispatchContext } from './MovieHistoryContext';

// ==========================================
// PROVIDER COMPONENT
// ==========================================

export const MovieHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(movieHistoryReducer, initialState, initHistoryState);

  // Efecto Secundario (Side-Effect): Sincronizamos con localStorage cuando el estado cambia.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Error guardando el historial:", err);
    }
  }, [state]);

  const lastSyncedRef = useRef<number>(0);

  // Efecto Secundario (Supabase): Sincronizamos con la nube en cada nueva interacción.
  useEffect(() => {
    const lastItem = state.history[0]; 
    if (!lastItem || lastItem.timestamp <= lastSyncedRef.current) return;

    lastSyncedRef.current = lastItem.timestamp;

    const syncWithSupabase = async () => {
      try {
        const tableName = lastItem.action === 'LIKE' ? 'likes' : 'dislikes';
        
        const { error } = await supabase
          .from(tableName as 'likes' | 'dislikes')
          .insert([
            {
              movie_id: lastItem.movie.id,
              title: lastItem.movie.title,
              poster_path: lastItem.movie.poster_path,
              session_id: getSessionId()
            }
          ]);

        if (error) {
          console.warn(`Error sincronizando con Supabase en la tabla ${tableName}:`, error.message);
        } else {
          console.log(`✅ Sincronizado exitosamente en la tabla ${tableName}`);
        }
      } catch (err) {
        console.error('Error inesperado en sync Supabase:', err);
      }
    };

    syncWithSupabase();
  }, [state.history]); // Sincronizar cada vez que el array de historial cambie (referencia nueva)

  // Memoizar el valor del state para proteger componentes hijos de re-renderizados forzados
  const stateContextValue = useMemo(() => state, [state]);

  return (
    <MovieHistoryStateContext.Provider value={stateContextValue}>
      {/* Contexto W (Escritura/Dispatch) no cambia su ref, pasamos directamente el dispatch */}
      <MovieHistoryDispatchContext.Provider value={dispatch}>
        {children}
      </MovieHistoryDispatchContext.Provider>
    </MovieHistoryStateContext.Provider>
  );
};


