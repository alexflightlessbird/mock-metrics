import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useSchoolDetails(schoolId) {
  const { showError, showSuccess } = useNotifications();
  const queryClient = useQueryClient();

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

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      if (!updates || Object.keys(updates).length === 0)
        return { noUpdates: true };
      const { error } = await supabase
        .from("schools")
        .update(updates)
        .eq("id", schoolId);
      if (error) throw error;

      return { noUpdates: false };
    },
    onSuccess: (result) => {
      if (result.noUpdates) {
        showSuccess({ message: "No changes to update", title: "No changes" });
      } else {
        queryClient.invalidateQueries(["school-details", schoolId]);
        showSuccess({ message: "School updated successfully" });
      }
    },
    onError: (error) => {
      showError({
        title: "Failed to update school",
        message: error.message,
      });
    },
  });

  return {
    data,
    isLoading,
    updateSchool: updateMutation.mutateAsync,
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
