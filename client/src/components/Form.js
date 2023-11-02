import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Form = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
    setCurrentTime(formattedTime);
  }, []);

  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    todaydate: "",
    weight: "",
    price: "",
    selectedOption: "",
    currentTime: "",
  });
  let name, value;

  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault();

    const {
      name,
      phoneNumber,
      todaydate,
      weight,
      price,
      selectedOption,
      currentTime,
    } = user;
    const res = await fetch("/api/tomatoData/submit-tomato-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phoneNumber,
        todaydate,
        weight,
        price,
        selectedOption,
        currentTime,
      }),
    });

    if (res.status === 200) {
      toast.success("Data submitted successfully");
      setUser({
        name: "",
        phoneNumber: "",
        todaydate: "",
        weight: "",
        price: "",
        selectedOption: "",
        currentTime: "",
      });
    } else {
      toast.error("Error submitting data");
    }
  };
  return (
    <>
      <div
        className="container"
        style={{ marginTop: "30px", marginBottom: "100px" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">Tomato Data</h2>
                <form method="POST">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Farmer's Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      autoComplete="off"
                      value={user.name}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Farmer Phone Number:
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phoneNumber"
                      name="phoneNumber"
                      autoComplete="off"
                      value={user.phoneNumber}
                      onChange={handleInputs}
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="todaydate" className="form-label">
                      Date:
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="todaydate"
                      name="todaydate"
                      value={user.todaydate}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="weight" className="form-label">
                      Tomato (in Quintal):
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="weight"
                      name="weight"
                      value={user.weight}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="weight" className="form-label">
                      Trade Price (in Rs./Quintal):
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={user.price}
                      onChange={handleInputs}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value="Submit"
                      onClick={PostData}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Form;
