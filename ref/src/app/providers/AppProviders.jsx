// Dependency imports
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Other imports
import { theme } from "../theme";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

export default function AppProviders({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
                <ModalsProvider>
                    {children}
                    <ReactQueryDevtools />
                </ModalsProvider>
            </MantineProvider>
        </QueryClientProvider>
    )
}