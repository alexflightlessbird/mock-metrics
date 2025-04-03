// Dependency imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";

// Component imports
import AuthForm from "../components/forms/AuthForm";

// Services imports
import { supabase } from "../../../services/supabaseClient";

export default function LoginView() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: ""
        },
        validate: {
            email: isEmail("Invalid email"),
            password: hasLength({ min: 6 }, "Passwords are at least 6 characters")
        },
        validateInputOnBlur: true,
        onSubmitPreventDefault: "always"
    });

    async function handleSubmit (values) {
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            navigate("/settings");
        } catch (error) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <h1>Login</h1>
            <Text>Welcome back! Please enter your credentials.</Text>

            <AuthForm
                form={loginForm}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                submitLabel="Login"
            />
        </>
    )
}
