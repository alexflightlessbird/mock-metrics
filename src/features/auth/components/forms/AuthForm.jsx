// Dependency imports
import { TextInput, PasswordInput, Alert, Box, useMantineTheme } from "@mantine/core";

// Component imports
import IconButton from "../../../../common/components/IconButton";

export default function AuthForm({
    form,
    onSubmit,
    isLoading,
    error,
    setError,
    submitLabel = "Submit",
    showConfirmPassword = false,
    icon
}) {
    const theme = useMantineTheme();
    const sizeProps = {
        labelProps: { fz: theme.fontSizes.md },
        errorProps: { fz: theme.fontSizes.sm }
    };
    return (
        <div style={{ alignItems: "center", justifyContent: "center", display: "flex" }}>
            <Box p="xl" bg="darkBlue.0" c="lightGray.0" bd="1px solid darkBlue.0" style={{ borderRadius: "10px", backdropFilter: "blur(8px)", width: "clamp(300px, 90%, 800px)" }} >
                <form onSubmit={form.onSubmit(onSubmit)}>
                    {error && (
                        <Alert title="Error" withCloseButton onClose={() => setError("")} color="red" mb="md" variant="filled" >{error}</Alert>
                    )}

                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        withAsterisk
                        {...form.getInputProps("email")}
                        {...sizeProps}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        withAsterisk
                        mt="md"
                        {...form.getInputProps("password")}
                        {...sizeProps}
                    />
                    {showConfirmPassword && (
                        <>
                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                withAsterisk
                                mt="md"
                                {...form.getInputProps("confirmPassword")}
                                {...sizeProps}
                            />
                        </>
                    )}
                    <br />
                    <IconButton type="submit" fullWidth loading={isLoading} icon={icon} buttonText={submitLabel} />
                </form>
            </Box>
        </div>
    )
}
