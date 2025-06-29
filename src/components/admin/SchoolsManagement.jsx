import { useQuery } from "@tanstack/react-query";
import { Table } from "@mantine/core";
import { supabase } from "../../lib/supabase";

export default function SchoolsManagement () {
    const { data: schools, isLoading } = useQuery({
        queryKey: ['admin-schools'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("schools")
                .select("*")
                .order("name");
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
                    <th>Name</th>
                    <th>Premium</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {schools.map(school => (
                    <tr key={school.id}>
                        <td>{school.id}</td>
                        <td>{school.name}</td>
                        <td>{school.is_premium === true ? "True" : "False"}</td>
                        <td><button>Edit</button><button>Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}