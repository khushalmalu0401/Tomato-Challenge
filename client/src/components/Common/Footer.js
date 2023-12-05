import React from "react";
import { MDBFooter } from "mdb-react-ui-kit";

export default function App() {
  return (
    <MDBFooter bgColor="dark" className="text-center text-lg-left">
      <div
        className="text-center p-3 text-light"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        &copy; {new Date().getFullYear()} Copyright:{" "}
        <span className="text-light">tomatochallenge.com</span>
      </div>
    </MDBFooter>
  );
}
