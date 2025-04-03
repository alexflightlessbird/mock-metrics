// Dependency imports
import { TextInput, PasswordInput, Alert } from "@mantine/core";

// Component imports
import IconButton from "../../../../common/components/IconButton";

export default function AuthForm({
    form,
    onSubmit,
    isLoading,
    error,
    submitLabel = "Submit",
    showConfirmPassword = false,
    icon
}) {
    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            {error && (
                <Alert title="Error" color="red" mb="md">{error}</Alert>
            )}

            <TextInput
                label="Email"
                placeholder="your@email.com"
                withAsterisk
                {...form.getInputProps("email")}
            />
            <PasswordInput
                label="Password"
                placeholder="Your password"
                withAsterisk
                mt="md"
                {...form.getInputProps("password")}
            />
            {showConfirmPassword && (
                <>
                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        withAsterisk
                        mt="md"
                        {...form.getInputProps("confirmPassword")}
                    />
                </>
            )}
            <br />
            <IconButton type="submit" fullWidth loading={isLoading} icon={icon} buttonText={submitLabel} />
        </form>
    )
}
