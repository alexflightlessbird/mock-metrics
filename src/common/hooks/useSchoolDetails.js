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

export function useManageSchoolUsers(schoolId) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  const invalidateAssignments = (userId) => {
    queryClient.invalidateQueries({ queryKey: ["school-users", schoolId] });
    queryClient.invalidateQueries({ queryKey: ["user-assignments", userId] });
  };

  const addMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      if (!["admin", "viewer"].includes(role)) {
        throw new Error("New users can only be assigned as admins or viewers");
      }
      const { error } = await supabase
        .from("users_schools")
        .insert({ user_id: userId, school_id: schoolId, role });
      if (error) throw error;
      return userId;
    },
    onSuccess: (userId) => {
      invalidateAssignments(userId);
      showSuccess({ message: "User access added successfully" });
    },
    onError: (error) => {
      showError({ title: "Failed to add user access", message: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      if (!["admin", "viewer"].includes(role)) {
        throw new Error("User roles can only be changed to admin or viewer");
      }
      const { data, error } = await supabase
        .from("users_schools")
        .update({ role })
        .eq("school_id", schoolId)
        .eq("user_id", userId)
        .neq("role", "primary")
        .select("user_id");
      if (error) throw error;
      if (!data?.length) throw new Error("Primary admin assignments cannot be changed");
      return userId;
    },
    onSuccess: (userId) => {
      invalidateAssignments(userId);
      showSuccess({ message: "User role updated successfully" });
    },
    onError: (error) => {
      showError({ title: "Failed to update user role", message: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ userId }) => {
      const { data, error } = await supabase
        .from("users_schools")
        .delete()
        .eq("school_id", schoolId)
        .eq("user_id", userId)
        .neq("role", "primary")
        .select("user_id");
      if (error) throw error;
      if (!data?.length) throw new Error("Primary admin assignments cannot be removed");
      return userId;
    },
    onSuccess: (userId) => {
      invalidateAssignments(userId);
      showSuccess({ message: "User access removed successfully" });
    },
    onError: (error) => {
      showError({ title: "Failed to remove user access", message: error.message });
    },
  });

  return {
    addUser: addMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    removeUser: deleteMutation.mutateAsync,
    isSaving:
      addMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
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
          .select("*, students_teams(*, teams(*))")
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
