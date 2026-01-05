import { useCallback, useReducer } from 'react';

export interface Action {
  id: string;
  type: 'create' | 'update' | 'delete' | 'bulk_upload' | 'other';
  resource: string;
  description: string;
  timestamp: number;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  data?: any;
}

interface HistoryState {
  past: Action[];
  present: Action | null;
  future: Action[];
}

type HistoryAction = 
  | { type: 'PUSH'; action: Action }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' };

const initialState: HistoryState = {
  past: [],
  present: null,
  future: [],
};

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'PUSH': {
      return {
        past: state.present ? [...state.past, state.present] : state.past,
        present: action.action,
        future: [], // Clear future when new action is performed
      };
    }
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const newPresent = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        past: newPast,
        present: newPresent,
        future: state.present ? [state.present, ...state.future] : state.future,
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const newPresent = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: state.present ? [...state.past, state.present] : state.past,
        present: newPresent,
        future: newFuture,
      };
    }
    case 'CLEAR': {
      return initialState;
    }
    default:
      return state;
  }
}

export function useActionHistory() {
  const [state, dispatch] = useReducer(historyReducer, initialState);

  const push = useCallback((action: Action) => {
    dispatch({ type: 'PUSH', action });
  }, []);

  const undo = useCallback(async () => {
    if (state.present && state.present.undo) {
      try {
        await state.present.undo();
        dispatch({ type: 'UNDO' });
      } catch (error) {
        console.error('Undo failed:', error);
        throw error;
      }
    }
  }, [state.present]);

  const redo = useCallback(async () => {
    if (state.future.length > 0 && state.future[0].redo) {
      try {
        await state.future[0].redo();
        dispatch({ type: 'REDO' });
      } catch (error) {
        console.error('Redo failed:', error);
        throw error;
      }
    }
  }, [state.future]);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const canUndo = state.past.length > 0 || state.present !== null;
  const canRedo = state.future.length > 0;

  const history = [
    ...(state.present ? [state.present] : []),
    ...state.future,
  ];

  return {
    push,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    history,
    currentAction: state.present,
  };
}
