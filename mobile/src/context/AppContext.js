import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as storage from "../storage/storage";
import { predictSession, simulateSession } from "../api/client";
 
const AppContext = createContext(null);
 
export function AppProvider({ children }) {
  const [history, setHistory] = useState([]);
 
  useEffect(() => {
    storage.loadHistory().then(setHistory);
  }, []);
 
  const addResult = useCallback((result, source) => {
    const entry = { id: String(Date.now()), timestamp: Date.now(), source, result };
    setHistory((prev) => {
      const next = [entry, ...prev];
      storage.saveHistory(next);
      return next;
    });
    return entry;
  }, []);
 
  const deleteEntry = useCallback((id) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      storage.saveHistory(next);
      return next;
    });
  }, []);
 
  const clearHistory = useCallback(async () => {
    await storage.clearHistory();
    setHistory([]);
  }, []);
 
  return (
    <AppContext.Provider value={{ history, addResult, deleteEntry, clearHistory }}>
      {children}
    </AppContext.Provider>
  );
}
 
export const useApp = () => useContext(AppContext);
 
// Runs one check, saves it, and opens the matching result screen.
export function useRunCheck(navigation) {
  const { addResult } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const run = async (features) => {
    setLoading(true);
    setError(null);
    try {
      const result = features ? await predictSession(features) : await simulateSession();
      const entry = addResult(result, features ? "manual" : "simulated");
      navigation.navigate(result.risk_label === "high_risk" ? "Alert" : "LowRiskResult", { entry });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
 
  return { run, loading, error };
}
