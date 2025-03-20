import React, { lazy, useState, memo } from "react";
import { useSession } from "../../hooks/auth/useSession";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import Spin from "antd/es/spin";
import logo from "../../assets/logo.png";

const UserDropdown = lazy(() => import("./UserDropdown"));
const LoginRegisterButton = lazy(() => import("./LoginRegisterButton"));

function NavBar() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) {
    return <Spin delay={500} />;
  }

  return (
    <div className="navbar">
      <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <div className="logo">
          <img
            src={logo}
            alt="logo"
            className={imageLoaded ? "loaded" : ""}
            onLoad={() => setImageLoaded(true)}
          />
          <h1>MockMetrics</h1>
        </div>
      </span>
      <div className="navbar-user navbar-login">
        {session ? (
          <UserDropdown supabase={supabase} />
        ) : (
          <LoginRegisterButton />
        )}
      </div>
    </div>
  );
}

export default memo(NavBar);
