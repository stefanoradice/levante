"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface HistoryContextValue {
  history: number[] | null;
  addToHistory: (postId: number) => void;
}

const HistoryContext = createContext<HistoryContextValue>({
  history: [],
  addToHistory: () => {},
});

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<number[] | null>([]);
  const addToHistory = (postId: number) => {
    const currentLocalHistory = localStorage.getItem("history");
    const currentHistory = currentLocalHistory
      ? JSON.parse(currentLocalHistory)
      : [];
    const newHistory = [...new Set([...currentHistory, postId])];
    localStorage.setItem("history", JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  useEffect(() => {
    const stored = localStorage.getItem("history");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(stored ? JSON.parse(stored) : []);
  }, []);

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}
