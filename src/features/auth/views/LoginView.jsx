// Dependency imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Text, Group, useMantineTheme } from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";

// Component imports
import AuthForm from "../components/forms/AuthForm";
import IconButton from "../../../common/components/IconButton";

// Services imports
import { supabase } from "../../../services/supabaseClient";

export default function LoginView({ onToggleView }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const theme = useMantineTheme();

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
            const { data, error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            const { data: existingRelationship, error: selectError } = await supabase
                .from("users")
                .select("*")
                .eq("email", values.email)
                .maybeSingle();

            if (existingRelationship) console.log("Existing:", existingRelationship);
            if (selectError) console.log("Error selecting:", selectError);
            
            if (!existingRelationship) {
                try {
                    console.log("Inserting user");
                    const { data: insertData, error: insertError } = await supabase
                    .from("users")
                    .insert({ 
                        id: data.user.id,
                        email: data.user.email
                    });
                    console.log("Insert Data:", insertData);
                    console.log("Insert error:", insertError);
                    if (insertError) throw new Error(insertError);
                } catch (error) {
                    console.error(error);
                }
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
            <br />
            <AuthForm
                form={loginForm}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                submitLabel="Login"
                icon="login"
            />

            <Group justify="center" mt="md">
                <Text>Don't have an account?</Text>
                <IconButton variant="subtle" onClick={onToggleView} fontColor={theme.colors.primaryBlue[0]} buttonText="Register here" />
            </Group>
        </>
    )
}
