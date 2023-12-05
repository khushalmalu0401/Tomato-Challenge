// PageNotFound.js

import React from "react";
import "./PageNotFound.css"; // Import a custom CSS file for styling

const PageNotFound = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-title">404</h1>
        <p className="error-message">Oops! Page not found.</p>
        <p className="error-description">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <a href="/" className="error-link">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
