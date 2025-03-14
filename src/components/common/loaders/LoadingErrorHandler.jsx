import React from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function LoadingErrorHandler({ loading, error, children }) {
    if (loading) return <LoadingSpinner />;
    if (error) return <p>{error}</p>;
    return children;
}