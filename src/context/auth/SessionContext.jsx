import React, {
  createContext,
  lazy,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { supabase } from "../../services/supabaseClient";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session: sess },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setSession(sess);
        setUserId(sess?.user?.id || null);
      }
      setLoading(false);
    };

    fetchSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUserId(sess?.user?.id || null);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const contextValue = useMemo(
    () => ({ session, userId, loading }),
    [session, userId, loading]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};
