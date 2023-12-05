import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const Navbar = (roleState, setRole) => {
  const token = Cookies.get("token");
  console.log(token);

  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink className="navbar-brand ms-4" to="/">
          Tomato Challenge
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item ">
              <span className="text-white nav-link me-3">Hello Admin</span>
            </li>
            <li className="nav-item active">
              <NavLink className="nav-link me-3" to="/">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item active">
              <NavLink className="nav-link me-3" to="/about">
                Trade Insights
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link me-3" to="/contact">
                Reports
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link me-3"
                to="/"
                onClick={() => {
                  Cookies.remove("token");
                  setRole("defaultRole");
                  navigate("/");
                }}
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
