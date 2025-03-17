import React from "react";
import { useSession } from "../../hooks/auth/useSession";
import logo from "../../assets/logo.png";
import NavLinks from "./NavLinks";
import AuthSection from "./AuthSection";

export default function NavBar() {
  const { session } = useSession();

  return (
    <nav>
      <img src={logo} alt="MockMetrics logo" width="50px" height="auto" />
      <NavLinks session={session} />
      <AuthSection />
    </nav>
  )
}
