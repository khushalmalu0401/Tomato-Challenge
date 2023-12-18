import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    name: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  let name, value;

  const handleInputs = (e) => {
    // console.log(e);
    name = e.target.name;
    value = e.target.value;

    setVendor({ ...vendor, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { name, phone, password, cpassword } = vendor;

    const res = await fetch("/api/auth/vendorRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        password,
        cpassword,
      }),
    });

    if (res.status === 422) {
      window.alert("Invalid Registration");
      // console.log("Invalid Registration");
    } else if (res.status === 201) {
      const data = await res.json();
      window.alert("Registration Successful");
      // console.log("Registration Successful");
      navigate("/login");
    } else {
      window.alert("Registration Error");
      // console.log("Registration Error");
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 mt-3">
            <h2>Vendor Register</h2>
            <form method="POST" className="signup-form mt-4">
              <div className="mb-3">
                <label htmlFor="vendorname" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  autoComplete="off"
                  value={vendor.name}
                  onChange={handleInputs}
                  placeholder="Your Name"
                  required
                />
              </div>
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
                  value={vendor.phone}
                  onChange={handleInputs}
                  placeholder="Your Number"
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
                  value={vendor.password}
                  onChange={handleInputs}
                  placeholder="Your Password"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="cpassword"
                  name="cpassword"
                  className="form-control"
                  autoComplete="off"
                  value={vendor.cpassword}
                  onChange={handleInputs}
                  placeholder="Renter Password"
                  required
                />
              </div>

              <div className="form-group form-button">
                <input
                  type="submit"
                  name="signup"
                  id="signup"
                  className="btn btn-primary"
                  value="Register"
                  onClick={PostData}
                />
              </div>
              <p className="mt-3">
                Already registered?{" "}
                <NavLink to="/vendor/login">Login here</NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
