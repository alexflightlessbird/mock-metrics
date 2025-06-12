import { useSearchParams } from "react-router-dom";

export default function useQueryParamFilter(initialValues = {}) {
    const [searchParams, setSearchParams] = useSearchParams();

    const getParam = (key) => searchParams.get(key) || initialValues[key];

    const setParam = (key, value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(key, value);
        setSearchParams(newSearchParams);
    }

    return { getParam, setParam };
}