import React, { useState } from "react";
import Spin from "antd/es/spin";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function Login () {
    const navigate = useNavigate();
    const [loggingIn, setLoggingIn] = useState(false);

    const handleLogin = async () => {
        setLoggingIn(true);
        try {
            await supabase.auth.signInWithPassword({ email: "taliahdebate@gmail.com", password: "Taliah Blom" });
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoggingIn(false);
            navigate("/test", { replace: true });
        }
    }

    return (
        <>
            {loggingIn && <Spin fullscreen delay={500} tip={<><p>logging you in...<br />welcome back!</p></>} />}
            <div>
                <h1>Login Page</h1>
                <button onClick={handleLogin}>Login</button>
            </div>
        </>
    )
}