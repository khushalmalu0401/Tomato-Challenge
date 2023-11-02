import React, { useState } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    width: "500px", // Set the width to 500px
    height: "220px", // Set the height to 220px
    margin: "auto", // Center the dialog horizontally
    borderRadius: "10px", // Rounded borders
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Set the overlay background to black with some transparency
  },
};

const TomatoWeightDialog = ({ isOpen, onRequestClose, onSubmit }) => {
  const [tomatoWeight, setTomatoWeight] = useState("");

  const handleSubmit = () => {
    // You can add validation here if needed
    onSubmit(tomatoWeight);
    setTomatoWeight(""); // Clear the input
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles} // Apply custom styles
      contentLabel="Tomato Weight Dialog"
    >
      <h3>Enter Tomato Weight</h3>
      <form method="POST" className="login-form mt-4">
        <div className="mb-3">
          <input
            type="tomatoWeight"
            id="tomatoWeight"
            name="tomatoWeight"
            className="form-control"
            autoComplete="off"
            placeholder="Enter Weight"
            value={tomatoWeight}
            onChange={(e) => setTomatoWeight(e.target.value)}
            required
          />
        </div>
        <div className="form-group form-button">
          <input
            type="submit"
            name="signin"
            id="signin"
            className="btn btn-primary"
            value="Submit"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </Modal>
  );
};

export default TomatoWeightDialog;
