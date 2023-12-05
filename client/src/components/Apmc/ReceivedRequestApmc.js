import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

const DataDisplay = () => {
  // const [selectedOption, setSelectedOption] = useState("APMC-Pune");
  const [data, setData] = useState([]);
  const [tomatoRequestedData, setTomatoRequestedData] = useState([]); // Data for the table
  const [apmcWithExcessTomato, setApmcWithExcessTomato] = useState([]);
  const [reload, setReload] = useState(false);

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0]; // Extract and format the date
    return formattedDate;
  };

  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const apmcName = decodedToken.apmc.name;
  // console.log(apmcName);

  useEffect(() => {
    try {
      fetch(`/api/request/apmc/received-requests?apmcName=${apmcName}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((jsonData) => {
          console.log("jsonData", jsonData);
          setData(jsonData["vendorsRequesting"]);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
    try {
      fetch(`/api/request/apmc/received-requests?apmcName=${apmcName}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((jsonData) => {
          console.log("jsonData", jsonData);
          setTomatoRequestedData(jsonData["apmcsRequesting"]);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
  }, [reload]);

  const handleVendorRequest = async (id) => {
    try {
      // Make a POST request to the backend to update the data
      const response = await fetch(`/api/fullfill/vendor/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
      });

      if (response.ok) {
        // Update the data displayed in the frontend
        const updatedData = data.map((item) => {
          if (item._id === id) {
            item.verified = true;
          }
          return item;
        });
        setData(updatedData);
        setReload(!reload);
        console.log("Data updated successfully");
        toast.success("Data updated successfully");
      } else {
        console.error("Error updating data");
        toast.error("Error updating data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating verification status");
    }
  };

  const handleApmcRequest = async (id) => {
    console.log(id);
    try {
      // Make a POST request to the backend to update the data
      const response = await fetch(`/api/fullfill/apmc/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
      });

      if (response.ok) {
        // Update the data displayed in the frontend
        const updatedData = data.map((item) => {
          if (item._id === id) {
            item.verified = true;
          }
          return item;
        });
        setData(updatedData);
        setReload(!reload);
        console.log("Data updated successfully");
        toast.success("Data updated successfully");
      } else {
        console.error("Error updating data");
        toast.error("Error updating data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating verification status");
    }
  };

  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to the backend to delete the data
      const response = await fetch(`/api/request/vendor/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
      });

      if (response.ok) {
        // Remove the deleted item from the data displayed in the frontend
        const updatedData = data.filter((item) => item._id !== id);
        setData(updatedData);
        console.log("Data deleted successfully");
        toast.success("Data deleted successfully");
      } else {
        console.error("Error deleting data");
        toast.error("Error deleting data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating verification status");
    }
  };

  let serialNo = 1;
  return (
    <>
      <div style={{ margin: "30px 100px" }}>
        <div>
          <h3>Vendor Requests</h3>

          <div className="table-responsive">
            <div></div>
            {data ? (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Vendor Name</th>
                    <th>Contact</th>
                    <th>Date</th>
                    {/* <th>Time</th> */}
                    <th>Weight</th>
                    <th>Fullfill</th>
                    <th>Deny</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .filter((item) => !item.fullfill) // Filter items where fullfill is false
                    .map((item) => (
                      <tr key={item.apmcMarket._id}>
                        <td>{serialNo++}</td>
                        <td>{item.vendor.name}</td>
                        <td>{item.vendor.phone}</td>
                        <td>
                          {new Date(item.date).toISOString().split("T")[0]}
                        </td>
                        {/* <td>{item.currentTime}</td> */}
                        <td>{item.weight}</td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => handleVendorRequest(item._id)}
                          >
                            Fulfill
                          </button>
                        </td>
                        <td>
                          {/* Add the delete button */}
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btn btn-danger"
                          >
                            Deny
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <h6>Today, no vendor has requested tomato</h6>
            )}
          </div>
        </div>
      </div>
      <div style={{ margin: "30px 100px" }}>
        <div>
          <h3>Tomato Requested By Other APMC's</h3>
          <div className="table-responsive">
            <div></div>
            {tomatoRequestedData.length !== 0 ? (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>APMC Name</th>
                    <th>Location</th>
                    <th>Weight</th>
                    <th>Fullfill</th>
                    <th>Deny</th>
                  </tr>
                </thead>
                <tbody>
                  {tomatoRequestedData
                    ?.filter((item) => !item.fullfill)
                    .map((item) => (
                      <tr key={item.apmcMarketRequesting.id}>
                        <td>{serialNo++}</td>
                        <td>{item.apmcMarketRequesting.name}</td>
                        <td>{item.apmcMarketRequesting.name}</td>
                        <td>{item.weight}</td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => handleApmcRequest(item._id)}
                          >
                            Fullfill
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              toast.success("Request cancel successfully")
                            }
                          >
                            Deny
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <h5>Today, no APMC Market has requested tomato!!!</h5>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default DataDisplay;
