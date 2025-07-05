import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { notifications } from "@mantine/notifications";

export default function useSchoolAssignments(schoolId) {
    const showNotification = ({ title, message, color, position = "bottom-right" }) => {
        notifications.show({ title, message, color, position });
    }

    const { data: assignments, isLoading, refetch } = useQuery({
        queryKey: ["admin-school-assignments", schoolId],
        queryFn: async () => {
            if (!schoolId) return [];

            const { data, error } = await supabase
                .from("users_schools")
                .select(`user_id, users:user_id (id, email, name)`)
                .eq("school_id", schoolId);
            if (error) throw error;
            return data;
        }
    });

    const { data: availableUsers } = useQuery({
        queryKey: ["admin-available-users", schoolId],
        queryFn: async () => {
            if (!schoolId) return [];

            const { data: assignedUsers } = await supabase
                .from("users-schools")
                .select("user_id")
                .eq("school_id", schoolId);

            const { data, error } = await supabase
                .from("users")
                .select("id, email, name")
                .not("id", "in", `(${assignedUsers?.map(u => u.user_id).join(",") || ""}`);
            if (error) throw error;
            return data;
        }
    });

    const addMutation = useMutation({
        mutationFn: async (userId) => {
            const { error } = await supabase
                .from("users_schools")
                .insert({ user_id: userId, school_id: schoolId });
            if (error) throw error;
        },
        onSuccess: () => {
            refetch();
            showNotification({
                title: "Success",
                message: "User assigned successfully",
                color: "green"
            });
        },
        onError: (error) => {
            showNotification({
                title: "Assignment failed",
                message: error.message || "Failed to assign user",
                color: "red"
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ userId, updates }) => {
            const { error } = await supabase
                .from("users_schools")
                .update(updates)
                .eq("school_id", schoolId)
                .eq("user_id", userId);
            if (error) throw error;
        },
        onSuccess: () => {
            refetch();
            showNotification({
                title: "Success",
                message: "Assignment updated successfully",
                color: "green"
            });
        },
        onError: (error) => {
            showNotification({
                title: "Update failed",
                message: error.message || "Failed to update assignment",
                color: "red"
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (userId) => {
            const { error } = await supabase
                .from("users_schools")
                .delete()
                .eq("user_id", userId)
                .eq("school_id", schoolId);
            if (error) throw error;
        },
        onSuccess: () => {
            refetch();
            showNotification({
                title: "Success",
                message: "Assignment deleted successfully",
                color: "green"
            });
        },
        onError: (error) => {
            showNotification({
                title: "Delete failed",
                message: error.message || "Failed to delete assignment",
                color: "red"
            });
        }
    });

    return {
        assignments,
        availableUsers,
        isLoading,
        addAssignment: addMutation.mutateAsync,
        updateAssignment: updateMutation.mutateAsync,
        deleteAssignment: deleteMutation.mutateAsync
    }
}