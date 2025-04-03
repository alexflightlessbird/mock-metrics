// Dependency imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mantine/core";
import { hasLength, isEmail, useForm, matchesField } from "@mantine/form";

// Component imports
import AuthForm from "../components/forms/AuthForm";

// Services imports
import { supabase } from "../../../services/supabaseClient";

export default function RegisterView() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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

            navigate("/auth");
        } catch (error) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <h1>Register</h1>
            <Text>Create a new account to get started.</Text>

            <AuthForm
                form={registerForm}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                submitLabel="Register"
                showConfirmPassword={true}
            />
        </>
    )
}
