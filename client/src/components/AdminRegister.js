import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
    appointedBy: "",
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;

    setUser({ ...user, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, cpassword, appointedBy } = user;

    const res = await fetch("/api/auth/adminRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        cpassword,
        appointedBy,
      }),
    });

    if (res.status === 422) {
      window.alert("Invalid Registration");
    } else if (res.status === 201) {
      const data = await res.json();
      window.alert("Registration Successful");
      navigate("/adminLogin");
    } else {
      window.alert("Registration Error");
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 mt-3">
            <h2>Admin Register</h2>
            <form method="POST" className="signup-form mt-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    autoComplete="off"
                    value={user.name}
                    onChange={handleInputs}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    autoComplete="off"
                    value={user.phone}
                    onChange={handleInputs}
                    placeholder="Your Phone Number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  autoComplete="off"
                  value={user.email}
                  onChange={handleInputs}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    autoComplete="off"
                    value={user.password}
                    onChange={handleInputs}
                    placeholder="Your Password"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="cpassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="cpassword"
                    name="cpassword"
                    className="form-control"
                    autoComplete="off"
                    value={user.cpassword}
                    onChange={handleInputs}
                    placeholder="Re-enter Password"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="appointedBy" className="form-label">
                  Appointed By
                </label>
                <input
                  type="text"
                  id="appointedBy"
                  name="appointedBy"
                  className="form-control"
                  autoComplete="off"
                  value={user.appointedBy}
                  onChange={handleInputs}
                  placeholder="Appointed By"
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
                Already registered? <NavLink to="/login">Login here</NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
