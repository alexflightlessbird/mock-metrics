import { Button } from "@mantine/core";

export default function RefreshAnalysisButton ({ onRefresh }) {
    return (
        <Button onClick={onRefresh} fullWidth>
            Refresh
        </Button>
    )
}