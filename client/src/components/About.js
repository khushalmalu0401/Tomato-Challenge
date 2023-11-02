import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./About.css";
const About = () => {
  // Initialize the user count
  const [userCount, setUserCount] = useState(0);

  // Function to update the user count
  const updateUserCount = () => {
    // Generate a random increase (for demonstration)
    const randomIncrease = Math.floor(Math.random() * 4) + 1; // Random increase between 1 and 5
    setUserCount((prevCount) => prevCount + randomIncrease);
  };

  // Use useEffect to update the user count at regular intervals
  useEffect(() => {
    const interval = setInterval(updateUserCount, 1000); // Update every 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">About Us</h1>
        <p className="lead">
          We are a dedicated team passionate about Tomatoes and Agriculture.
        </p>
        <hr className="my-4" />
        <p>
          Our mission is to help farmers submit their tomato data, including
          details such as crop weight, price expectations, and more, and connect
          them with potential buyers in various markets. By doing so, we aim to
          empower farmers with data-driven insights and facilitate fair pricing
          for their produce. Join our platform by registering or logging in to
          start benefiting from our services.
        </p>
        <div className="mt-4">
          <p>
            Please log in or register on our platform to submit your tomato
            data:
          </p>

          <NavLink to="/signup" className="btn btn-primary mr-4">
            Register
          </NavLink>
          <NavLink to="/login" className="btn btn-success ms-2">
            Login
          </NavLink>

          <div className="mt-4">
            {/* <p className="user-count">
            Currently,
            {` ${userCount} users have submitted their data to us.`}
          </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
