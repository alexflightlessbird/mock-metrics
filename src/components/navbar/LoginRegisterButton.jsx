import React, { memo } from "react";
import IconButton from "../common/buttons/IconButton";
import { useNavigate } from "react-router-dom";

function LoginRegisterButton() {
  const navigate = useNavigate();

  return (
    <IconButton
      className="login-register-button"
      type="primary"
      icon="login"
      onClick={() => navigate("/auth")}
      buttonText="Login/Register"
    />
  );
}

export default memo(LoginRegisterButton);
