import { createContext } from 'react';
import { MovieHistoryState, MovieHistoryAction } from './MovieContext';

export const MovieHistoryStateContext = createContext<MovieHistoryState | undefined>(undefined);
export const MovieHistoryDispatchContext = createContext<React.Dispatch<MovieHistoryAction> | undefined>(undefined);
