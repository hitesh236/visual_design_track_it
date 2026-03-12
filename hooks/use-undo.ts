'use client';

import { useState, useCallback, useEffect } from 'react';

export type HistoryItem<T> = T;

export function useUndo<T>(initialState: T, onRevert: (state: T) => void) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);

  const push = useCallback((newState: T) => {
    setHistory(prev => {
      const sliced = prev.slice(0, index + 1);
      const next = [...sliced, newState];
      if (next.length > 21) next.shift(); // Max 20 undo levels + 1 current
      return next;
    });
    setIndex(prev => {
      const newLen = Math.min(index + 2, 21);
      return newLen - 1;
    });
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0) {
      const prevIndex = index - 1;
      setIndex(prevIndex);
      onRevert(history[prevIndex]);
    }
  }, [index, history, onRevert]);

  // Redo is not explicitly asked for but history is there.
  
  return { push, undo, canUndo: index > 0 };
}
