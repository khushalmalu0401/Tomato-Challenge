import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        password,
      }),
    });
    const data = await res.json();
    Cookies.set("token", data.token);

    if (data.error) {
      toast.error("Invalid Credentials");
    } else {
      Cookies.set("role", "farmer");
      toast.success("Login Successful");
      navigate("/farmer/dashboard");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 mt-3">
          <h2>Farmer Login</h2>
          <form method="POST" className="login-form mt-4">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                autoComplete="off"
                placeholder="Your Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                autoComplete="off"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group form-button">
              <input
                type="submit"
                name="signin"
                id="signin"
                className="btn btn-primary"
                value="Log In"
                onClick={loginUser}
              />
            </div>
          </form>
          <p className="mt-3">
            New user? <NavLink to="/signup">Register here</NavLink>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
