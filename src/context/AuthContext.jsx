import { useSessionStorage } from "@mantine/hooks";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [
    isPasswordRecovery,
    setIsPasswordRecovery,
    removePasswordRecovery,
  ] = useSessionStorage({
    key: "password-recovery",
    defaultValue: false,
  });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isDbManager, setIsDbManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [superAdminLoading, setSuperAdminLoading] = useState(true);

  const clearPasswordRecovery = () => {
    removePasswordRecovery();
    setIsPasswordRecovery(false);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsPasswordRecovery(true);
        } else if (event === "SIGNED_OUT" || event === "USER_UPDATED") {
          removePasswordRecovery();
          setIsPasswordRecovery(false);
        }

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
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, [removePasswordRecovery, setIsPasswordRecovery]);

  const checkSuperAdmin = async (userId) => {
    const { data } = await supabase
      .from("super_admins")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    setIsSuperAdmin(!!data);

    if (data?.db_manager) {
      setIsDbManager(true);
    }

    setSuperAdminLoading(false);
  };

  const value = {
    user,
    isPasswordRecovery,
    isSuperAdmin,
    isDbManager,
    loading,
    superAdminLoading,
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    },
    verifyEmailOtp: async (email, token) => {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "signup",
      });
      if (error) throw error;
      return data;
    },
    resendEmailOtp: async (email) => {
      const { data, error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) throw error;
      return data;
    },
    requestPasswordReset: async (email) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return data;
    },
    verifyPasswordResetOtp: async (email, token) => {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "recovery",
      });
      if (error) throw error;
      return data;
    },
    updatePassword: async (password) => {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return data;
    },
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      clearPasswordRecovery();

      if (data.user) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ last_sign_in: new Date().toISOString() })
          .eq("id", data.user.id);

        if (updateError) {
          console.error("Failed to update last_sign_in:", updateError);
        }
      }
      return data;
    },
    signOut: async () => {
      localStorage.removeItem("school");
      localStorage.removeItem("nav-collapsed");
      localStorage.removeItem("nav-width");
      localStorage.removeItem("cookieConsent");
      localStorage.removeItem("ballotExtractedData");
      localStorage.removeItem("ballotForm");
      localStorage.removeItem("mantine-color-scheme-value");
      await supabase.auth.signOut();
      clearPasswordRecovery();
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
