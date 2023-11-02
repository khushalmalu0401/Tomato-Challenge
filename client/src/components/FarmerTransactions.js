import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

const DataDisplay = () => {
  // const [selectedOption, setSelectedOption] = useState("APMC-Pune");
  const [data, setData] = useState([]);

  // const handleOptionChange = (e) => {
  //   setSelectedOption(e.target.value);
  // };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0]; // Extract and format the date
    return formattedDate;
  };

  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const farmerName = decodedToken.user.name;
  const farmerPhone = decodedToken.user.phone;
  // const farmerName = decodedToken.apmc.name;
  // console.log(farmerName);

  useEffect(() => {
    try {
      fetch(`/api/tomatoData/get-tomato-data?farmerPhone=${farmerPhone}`, {
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
          setData(jsonData);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/get-tomato-data?selectedOption=${farmerName}`
      );

      if (response.ok) {
        const jsonData = await response.json();

        // Format the date field in the fetched data
        const formattedData = jsonData.map((item) => ({
          ...item,
          todaydate: formatDateString(item.todaydate),
        }));
        setData(formattedData);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to the backend to delete the data
      const response = await fetch(`/api/tomatoData/delete-tomato/${id}`, {
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
          <h3>Tomato Data for {farmerName}</h3>
          <div className="table-responsive">
            <div></div>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>APMC Name</th>
                  <th>Contact</th>
                  <th>Date</th>
                  {/* <th>Time</th> */}
                  <th>Weight</th>
                  <th>Trade Price</th>
                  {/* <th>Verify</th>
                  <th>Delete</th> */}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.apmcMarket._id}>
                    <td>{serialNo++}</td>
                    <td>{item.apmcMarket.name}</td>
                    <td>{item.farmer.phone}</td>
                    <td>{new Date(item.date).toISOString().split("T")[0]}</td>
                    {/* <td>{item.currentTime}</td> */}
                    <td>{item.weight}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default DataDisplay;
