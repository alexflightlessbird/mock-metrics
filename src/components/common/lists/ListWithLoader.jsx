import React from "react";
import LoadingErrorHandler from "../loaders/LoadingErrorHandler";
import ListComponent from "./ListComponent";

export default function ListWithLoader({
    items,
    loading,
    error,
    title,
    emptyMessage,
    linkPath,
    renderItem,
}) {
    return (
        <LoadingErrorHandler loading={loading} error={error}>
            <ListComponent
                items={items}
                title={title}
                emptyMessage={emptyMessage}
                linkPath={linkPath}
                renderItem={renderItem}
            />
        </LoadingErrorHandler>
    )
}