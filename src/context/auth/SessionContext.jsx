import React, { createContext, lazy, useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "../../services/supabaseClient";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const prevSessionRef = useRef();

  useEffect(() => {
    // Fetch the current session
    supabase.auth.getSession().then(({ data: { sess } }) => {
      if (prevSessionRef.current !== sess) {
        prevSessionRef.current = sess;
        setSession(sess);
        setUserId(sess?.user?.id || null);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (prevSessionRef.current !== sess) {
        prevSessionRef.current = sess;
        setSession(sess);
        setUserId(sess?.user?.id || null);
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const contextValue = useMemo(() => ({ session, userId, loading }), [session, userId, loading]);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};
