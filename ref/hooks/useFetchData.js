import React, { useEffect, useState } from "react";

export default function useFetchData(fetchFunction, needSetter = false, dependencies = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchFunction();
                setData(result.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, dependencies);

    if (needSetter) return { data, setData, loading, error };

    return { data, loading, error };
}