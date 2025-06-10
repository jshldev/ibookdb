import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/main-icon.png";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

function Header() {
  const { user } = useAuthContext();

  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <Link to="/" className="logo">
        <img src={logo} alt="Logo" />
        ibdb - Internet Book Database
      </Link>
      <nav>
        {user && (
          <>
            <span>Welcome! {user.name}, </span>
            <NavLink onClick={handleLogout}>Log-out</NavLink>
            <NavLink to="/favouritebooks">Favourites</NavLink>
          </>
        )}
        <NavLink to="/">Home</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/about">About</NavLink>
        {!user && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign-up</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
