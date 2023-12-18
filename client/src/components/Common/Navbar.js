import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const Navbar = () => {
  let token, role;
  try {
    token = jwt_decode(Cookies.get("token"));
    role = token.role;
  } catch (err) {
    role = "defaultRole";
  }
  // console.log(role);
  const navigate = useNavigate();
  return (
    <>
      <nav
        style={{ padding: "10px 100px" }}
        className="navbar navbar-expand-lg navbar-dark bg-dark"
      >
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
            <li className="nav-item active">
              <NavLink className="nav-link me-3" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item active">
              <NavLink className="nav-link me-3" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link me-3" to="/contact">
                Contact Us
              </NavLink>
            </li>

            {role === "defaultRole" ? (
              <>
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle"
                    to="#"
                    id="loginDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Login
                  </NavLink>
                  <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="loginDropdown"
                  >
                    <NavLink className="dropdown-item" to="/login">
                      Farmer Login
                    </NavLink>
                    <NavLink className="dropdown-item" to="/apmc/login">
                      APMC Login
                    </NavLink>
                    <NavLink className="dropdown-item" to="/vendor/login">
                      Vendor Login
                    </NavLink>
                    <NavLink className="dropdown-item" to="/admin">
                      Admin Login
                    </NavLink>
                  </div>
                </li>
                <li className="nav-item">
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      to="#"
                      id="loginDropdown"
                      role="button"
                      data-toggle="dropdown"
                      // aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Register
                    </NavLink>
                    <div
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="loginDropdown"
                    >
                      <NavLink className="dropdown-item" to="/signup">
                        Farmer Register
                      </NavLink>
                      <NavLink className="dropdown-item" to="/apmc/register">
                        APMC Register
                      </NavLink>
                      <NavLink className="dropdown-item" to="/vendor/register">
                        Vendor Register
                      </NavLink>
                      <NavLink className="dropdown-item" to="/admin/register">
                        Admin Register
                      </NavLink>
                    </div>
                  </li>
                </li>
              </>
            ) : role === "apmc" ? (
              <>
                <li></li>

                <li>
                  <NavLink className="nav-link me-3" to="/apmc/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-link me-3" to="/apmc/addSupply">
                    Add Supply
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-link me-3" to="/apmc/farmerTransactions">
                    Farmer Trans
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-link me-3" to="/apmc/tomatoRequest">
                    Requests
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-link me-3" to="/apmc/tomatoRequested">
                    Requested
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="nav-link me-3"
                    to="/apmc/fullfilledRequest"
                  >
                    FullFilled
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link me-3"
                    to="/"
                    onClick={() => {
                      Cookies.remove("token");
                      Cookies.set("role", "defaultRole");
                      // navigate("/");
                    }}
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            ) : role === "vendor" ? (
              <>
                <li></li>
                <li>
                  <NavLink className="nav-link me-3" to="/apmc/list">
                    APMCs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="nav-link me-3"
                    to="/vendor/tomatoRequested"
                  >
                    Tomato Requested
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    className="nav-link me-3"
                    to="/"
                    onClick={() => {
                      Cookies.remove("token");
                      Cookies.set("role", "defaultRole");
                      // navigate("/");
                    }}
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            ) : role === "farmer" ? (
              <>
                <li></li>
                <li>
                  <NavLink className="nav-link me-3" to="/farmer/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-link me-3" to="/farmer/transactions">
                    Transactions
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-link me-3" to="/farmer/apmcList">
                    APMCs
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    className="nav-link me-3"
                    to="/"
                    onClick={() => {
                      Cookies.remove("token");
                      Cookies.set("role", "defaultRole");
                      // navigate("/");
                    }}
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink
                  className="nav-link me-3"
                  to="/"
                  onClick={() => {
                    Cookies.remove("token");
                    Cookies.set("role", "defaultRole");
                    // navigate("/");
                  }}
                >
                  Logout
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
