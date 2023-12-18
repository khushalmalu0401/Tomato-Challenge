import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ApmcRegister = () => {
  const navigate = useNavigate();
  const [apmc, setApmc] = useState({
    name: "",
    location: "",
    pinCode: "",
    state: "",
    district: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  let name, value;

  const handleInputs = (e) => {
    // console.log(e);
    name = e.target.name;
    value = e.target.value;

    setApmc({ ...apmc, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault();
    const {
      name,
      location,
      pinCode,
      state,
      district,
      email,
      phone,
      password,
      cpassword,
    } = apmc;

    const res = await fetch("/api/auth/apmcRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        location,
        pinCode,
        state,
        district,
        email,
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
      navigate("/apmc/login");
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
            <h2>APMC Register</h2>
            <form method="POST" className="signup-form mt-4">
              <div className="mb-3">
                <label htmlFor="apmcname" className="form-label">
                  APMC Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  autoComplete="off"
                  value={apmc.name}
                  onChange={handleInputs}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                    autoComplete="off"
                    value={apmc.location}
                    onChange={handleInputs}
                    placeholder="Your Location"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="pinCode" className="form-label">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    className="form-control"
                    autoComplete="off"
                    value={apmc.pinCode}
                    onChange={handleInputs}
                    placeholder="Your Pin Code"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="form-control"
                    autoComplete="off"
                    value={apmc.state}
                    onChange={handleInputs}
                    placeholder="Your State"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="district" className="form-label">
                    District
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    className="form-control"
                    autoComplete="off"
                    value={apmc.district}
                    onChange={handleInputs}
                    placeholder="Your District"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="apmcEmail" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="form-control"
                  autoComplete="off"
                  value={apmc.email}
                  onChange={handleInputs}
                  placeholder="Your Email"
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
                  value={apmc.phone}
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
                  value={apmc.password}
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
                  value={apmc.cpassword}
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
                Already registered? <NavLink to="/apmc/login">Login here</NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApmcRegister;
