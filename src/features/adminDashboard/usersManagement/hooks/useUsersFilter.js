import { useMemo } from "react";

export default function useUsersFilter({ users, searchTerm, searchColumn }) {
  return useMemo(() => {
    if (!users) return [];
    if (!searchTerm) return users;

    const lowerSearchTerm = searchTerm.toLowerCase();

    if (searchColumn === "all") {
      return users.filter(
        (user) =>
          user.id.toString().toLowerCase().includes(lowerSearchTerm) ||
          user.email.toString().toLowerCase().includes(lowerSearchTerm) ||
          user.name.toString().toLowerCase().includes(lowerSearchTerm)
      );
    }

    return users.filter((user) =>
      String(user[searchColumn]).toLowerCase().includes(lowerSearchTerm)
    );
  }, [users, searchTerm, searchColumn]);
}
