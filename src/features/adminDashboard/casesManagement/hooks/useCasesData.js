import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { notifications } from "@mantine/notifications";

export default function useCasesData() {
    const queryClient = useQueryClient();

    const showNotification = ({ title, message, color, position = "bottom-right" }) => {
        notifications.show({ title, message, color, position });
    }

    const { data: cases, isLoading } = useQuery({
        queryKey: ["admin-cases"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("cases")
                .select("*")
                .order("is_active", { ascending: false });
            if (error) throw error;
            return data;
        }
    });

    const addMutation = useMutation({
        mutationFn: async ({ name, year, type, area = null, is_active }) => {
            let safeArea;
            if (area.trim() === "" || area.trim() === null) safeArea = null;
            if (area.trim() !== "" && area.trim() !== null) safeArea = area;  

            const { error } = await supabase
                .from("cases")
                .insert({ name, year, type, area: safeArea, is_active });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-cases"]);
            showNotification({
                title: "Success",
                message: "Case added successfully",
                color: "green"
            });
        },
        onError: (error) => {
            showNotification({
                title: "Add failed",
                message: error.message || "Failed to add case",
                color: "red"
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, updates }) => {
            if (updates.area === "" || updates.area === null) {
                updates.area === null;
            }

            const { error } = await supabase
                .from("cases")
                .update(updates)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-cases"]);
            showNotification({
                title: "Success",
                message: "Case updated successfully",
                color: "green"
            });
        },
        onError: (error) => {
            showNotification({
                title: "Update failed",
                message: error.message || "Failed to update case",
                color: "red"
            });
        }
    });

    const deleteMutaiton = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from("cases")
                .delete()
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-cases"]);
            showNotification({
                title: "Success",
                message: "Case deleted successfully",
                color: "green"
            });
        },
        onError: (error) => {
            showNotification({
                title: "Delete failed",
                message: error.message || "Failed to delete case",
                color: "red"
            });
        }
    });

    return {
        cases,
        isLoading,
        addCase: addMutation.mutateAsync,
        updateCase: updateMutation.mutateAsync,
        deleteCase: deleteMutaiton.mutateAsync
    }
}