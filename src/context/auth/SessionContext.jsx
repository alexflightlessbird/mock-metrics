import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserId(session?.user?.id || null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserId(session?.user?.id || null);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <SessionContext.Provider value={{ session, userId, loading }}>
      {children}
    </SessionContext.Provider>
  );
};