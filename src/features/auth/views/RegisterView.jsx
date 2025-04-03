// Dependency imports
import { useState } from "react";
import { Text, useMantineTheme, Group } from "@mantine/core";
import { hasLength, isEmail, useForm, matchesField } from "@mantine/form";

// Component imports
import AuthForm from "../components/forms/AuthForm";
import IconButton from "../../../common/components/IconButton";

// Services imports
import { supabase } from "../../../services/supabaseClient";

export default function RegisterView({ onToggleView }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const theme = useMantineTheme();
    const [isSuccess, setIsSuccess] = useState(false);

    const registerForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validate: {
            email: isEmail("Invalid email"),
            password: hasLength({ min: 6 }, "Passwords must have at least 6 characters"),
            confirmPassword: matchesField("password", "Passwords are not the same")
        },
        validateInputOnBlur: true,
        onSubmitPreventDefault: "always",
    });

    async function handleSubmit (values) {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password
            });

            if (error) {
                setError(error.message);
                return;
            }

            setIsSuccess(true);
        } catch (error) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <>
                <h1>Registration Successful</h1>
                <Text>Please check your email to verify your account.</Text>
                <IconButton onClick={onToggleView} buttonText="Back to Login" variant="subtle" fontColor={theme.colors.primaryBlue[0]} />
            </>
        )
    }

    return (
        <>
            <h1>Register</h1>
            <Text>Create a new account to get started.</Text>
            <br />
            <AuthForm
                form={registerForm}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                submitLabel="Register"
                showConfirmPassword={true}
            />

            <Group justify="center" mt="md">
                <Text>Already have an account?</Text>
                <IconButton variant="subtle" onClick={onToggleView} fontColor={theme.colors.primaryBlue[0]} buttonText="Login here" />
            </Group>
        </>
    )
}
