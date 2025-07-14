import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isDbManager, setIsDbManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [superAdminLoading, setSuperAdminLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          checkSuperAdmin(session.user.id);
        } else {
          setUser(null);
          setIsSuperAdmin(false);
          setIsDbManager(false);
          setSuperAdminLoading(false);
        }
        setLoading(false);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const checkSuperAdmin = async (userId) => {
    const { data } = await supabase
      .from("super_admins")
      .select("*")
      .eq("user_id", userId)
      .single();

    setIsSuperAdmin(!!data);

    if (data.db_manager) {
      setIsDbManager(true);
    }

    setSuperAdminLoading(false);
  };

  const value = {
    user,
    isSuperAdmin,
    isDbManager,
    loading,
    superAdminLoading,
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    signOut: async () => {
      localStorage.removeItem("school");
      await supabase.auth.signOut();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
