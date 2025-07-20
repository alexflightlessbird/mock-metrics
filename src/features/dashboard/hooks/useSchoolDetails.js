import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useSchoolDetails(schoolId) {
  const { showError } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ["school-details", schoolId],
    queryFn: async () => {
      if (!schoolId) return {};

      try {
        const { data, error } = await supabase
          .from("schools")
          .select("*")
          .eq("id", schoolId)
          .maybeSingle();
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load school details",
          message: error.message,
        });
        return {};
      }
    },
  });

  return {
    data,
    isLoading,
  };
}

export function useSchoolUsers(schoolId) {
  const { showError } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ["school-users", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];

      try {
        const { data, error } = await supabase
          .from("users_schools")
          .select("*, users(*)")
          .eq("school_id", schoolId);
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load school users",
          message: error.message,
        });
        return [];
      }
    },
  });

  return {
    data,
    isLoading,
  };
}

export function useSchoolTeams(schoolId) {
  const { showError } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ["school-teams", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];

      try {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .eq("school_id", schoolId);
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load school teams",
          message: error.message,
        });
        return [];
      }
    },
  });

  return {
    data,
    isLoading,
  };
}

export function useSchoolStudents(schoolId) {
  const { showError } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ["school-students", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];

      try {
        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("school_id", schoolId);
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load school students",
          message: error.message,
        });
        return [];
      }
    },
  });

  return {
    data,
    isLoading,
  };
}

export function useSchoolTournaments(schoolId) {
  const { showError } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ["school-tournaments", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];

      try {
        const { data, error } = await supabase
          .from("tournaments")
          .select("*")
          .eq("school_id", schoolId);
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load school tournaments",
          message: error.message,
        });
        return [];
      }
    },
  });

  return {
    data,
    isLoading,
  };
}
