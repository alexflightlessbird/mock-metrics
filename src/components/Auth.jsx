import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useSession } from "../context/SessionContext";

export default function Auth() {
  const [email, setEmail] = useState("");
  const { session } = useSession();
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return alert(error.message);
    }

    const user = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id);

    if (user.data.length === 0) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");
    if (!regex.test(password)) {
      alert(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number!"
      );
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email for the confirmation link!");
  };

  return (
    <div>
      {session ? (
        <div>
          <p>Logged in as {session.user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
          />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </form>
      )}
    </div>
  );
}
