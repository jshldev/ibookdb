import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/main-icon.png";

function Header() {
  return (
    <header>
      <Link to="/" className="logo">
        <img src={logo} alt="Logo" />
        ibdb - Internet Book Database
      </Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Sign-up</NavLink>
      </nav>
    </header>
  );
}

export default Header;
