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
  }, []);

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
      const response = await fetch(`/api/transactions/farmer/${id}`, {
        method: "DELETE",
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
            {data.length !== 0 ? (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Vendor Name</th>
                    <th>Contact</th>
                    <th>Date</th>
                    {/* <th>Time</th> */}
                    <th>Weight</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .filter((item) => item.fullfill) // Filter items where fullfill is false
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
                          {item.paymentDone === false ? "Unpaid" : "Paid"}
                        </td>
                      </tr>
                    ))}
                  {data.filter((item) => item.fullfill).length === 0 && (
                    <tr>
                      <td colSpan="5">
                        You have not fullfilled any vendor's request today !!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <h5>No data available</h5>
            )}
          </div>
        </div>
      </div>
      <div style={{ margin: "30px 100px" }}>
        <div>
          <h3>Tomato Requested By Other APMC's</h3>
          <div className="table-responsive">
            <div></div>
            {tomatoRequestedData ? (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>APMC Name</th>
                    <th>Location</th>
                    <th>Weight</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tomatoRequestedData?.map((item) => (
                    <tr key={item.apmcMarketRequesting.id}>
                      <td>{serialNo++}</td>
                      <td>{item.apmcMarketRequesting.name}</td>
                      <td>{item.apmcMarketRequesting.name}</td>
                      <td>{item.weight}</td>
                      <td>{item.paymentDone === false ? "Unpaid" : "Paid"}</td>
                    </tr>
                  ))}
                  {tomatoRequestedData?.filter((item) => item.fullfill)
                    .length === 0 && (
                    <tr>
                      <td colSpan="5">
                        You have not fullfilled any apmc's request today !!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <h5>No Data Available</h5>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default DataDisplay;
