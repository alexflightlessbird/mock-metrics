import { useQuery } from "@tanstack/react-query";
import { Table } from "@mantine/core";
import { supabase } from "../../lib/supabase";

export default function UsersManagement() {
    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*');
            if (error) throw error;
            return data;
        }
    })

    if (isLoading) return <div>Loading...</div>;

    return (
        <Table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.name || "-"}</td>
                        <td><button>Edit</button><button>Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}