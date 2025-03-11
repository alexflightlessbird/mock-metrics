import React from "react";
import { NavLink } from "react-router-dom";
import Auth from "./Auth";
import { useSession } from "../context/SessionContext";
import logo from "../assets/logo.png";

export default function NavBar() {
  const { session } = useSession();
  
  if (!session) {
    return (
      <div>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/cases">Cases</NavLink>
          <Auth />
        </nav>
      </div>
    );
  } else {
    return (
      <div>
        <nav>
          <img src={logo} alt="MockMetrics logo" width="50px" height="auto" />
          <NavLink to="/">Home</NavLink>
          <NavLink to="/cases">Cases</NavLink>
          <NavLink to="/schools">Schools</NavLink>
          <Auth />
        </nav>
      </div>
    );
  }
}
