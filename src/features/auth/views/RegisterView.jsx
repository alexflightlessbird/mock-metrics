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
    const [email, setEmail] = useState("");
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
                email: values.email.toLowerCase(),
                password: values.password,
                options: {
                    emailRedirectTo: `https://mock-metrics.onrender.com/auth?type=email-verification`
                }
            });

            if (error) {
                if (error.message.includes("User already resigstered")) {
                    setError("This email is already registered. Please log in or use a different email.");
                } else {
                    setError(error.message);
                }
                return;
            }

            if (data.user?.identities?.length === 0) {
                setError("This email is already registered. Please log in or use a different email.");
                return;
            }

            if (data.user) {
                setIsSuccess(true);
                setEmail(values.email.toLowerCase());
            }
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
                <Text>We've sent a confirmation email to {email}.</Text>
                <Text mb="md">Please check your inbox and verify your email address.</Text>
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
