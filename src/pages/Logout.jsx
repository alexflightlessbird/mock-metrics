import React, { useState } from "react";
import Spin from "antd/es/spin";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function Logout() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      {loggingOut && (
        <Spin
          fullscreen
          delay={500}
          tip={
            <>
              <p>
                logging you out...
                <br />
                goodbye!
              </p>
            </>
          }
        />
      )}
      <div>
        <h1>Logout Page</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
}
