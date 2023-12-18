import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const VendorLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const loginVendor = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/vendorLogin", {
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

    if (data.error) {
      toast.error("Invalid Credentials");
    } else {
      Cookies.set("token", data.token);
      Cookies.set("role", "vendor");
      toast.success("Login Successful");
      navigate("/apmc/list");
    }
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    // Remove non-numeric characters
    const numericInput = input.replace(/[^0-9]/g, "");
    // Limit the input to 10 digits
    const limitedInput = numericInput.slice(0, 10);

    // Check if the length is within the limit before updating the state
    if (limitedInput.length <= 10) {
      setPhone(limitedInput);
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 mt-3">
          <h2>Vendor Login</h2>
          <form method="POST" className="login-form mt-4">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="form-control"
                autoComplete="off"
                placeholder="Your Number"
                value={phone}
                onInput={handlePhoneChange}
                maxLength="10"
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
                onClick={loginVendor}
              />
            </div>
          </form>
          <p className="mt-3">
            New Vendor? <NavLink to="/vendor/register">Register here</NavLink>
          </p>
          <p className="mt-3">
            Forget Password? <NavLink to="">Reset</NavLink>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default VendorLogin;
