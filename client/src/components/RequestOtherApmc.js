import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import RequestOtherTomatoDialog from "./RequestOtherApmcDialog";

// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

const DataDisplay = () => {
  // const [selectedOption, setSelectedOption] = useState("APMC-Pune");

  const [data, setData] = useState([]);
  const [apmcWithExcessTomato, setApmcWithExcessTomato] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apmcSelectedName, setApmcSelectedName] = useState("");

  const handleOpenDialog = ({name, id}) => {
    // setApmcSelectedId(id); // Set the APMC id
    setApmcSelectedName(name); // Set the APMC name
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = async (tomatoWeight) => {
    // Handle the submitted tomato weight here

    console.log("Tomato Weight:", tomatoWeight);

    const res = await fetch("/api/apmcData/requestTomatoFromOtherApmc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token here
      },
      body: JSON.stringify({
        apmcRequestingId: decodedToken.apmc.id,
        apmcRequestingName: decodedToken.apmc.name,
        apmcProvidingName: apmcSelectedName,
        requestWeight: tomatoWeight,
      }),
    });

    if (res.status === 200) {
      toast.success("Data submitted successfully");
    } else {
      toast.error("Error submitting data");
    }
  };

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
      fetch(`/api/apmcData/apmc-requests?apmcName=${apmcName}`, {
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
    try {
      fetch(`/api/apmcData/getApmcWithExcessTomato`, {
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
          setApmcWithExcessTomato(jsonData);
          // setData(jsonData);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
  }, []);

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
          <h3>Request Other APMC's</h3>
          <div className="table-responsive">
            <div></div>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>APMC Name</th>
                  <th>Location</th>
                  <th>Stocks</th>
                  {/* <th>Time</th> */}
                  <th>Demand</th>
                  <th>Distance</th>
                  <th>Request</th>
                </tr>
              </thead>
              <tbody>
                {apmcWithExcessTomato.map((item) => (
                  <tr key={item.apmc}>
                    <td>{serialNo++}</td>
                    <td>{item.apmc}</td>
                    <td>{item.apmc}</td>
                    <td>{item.stocks}</td>
                    <td>{item.demand}</td>
                    <td>{item.distance}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleOpenDialog({
                            name: item.apmc,
                            // _id: item.apmc,
                          })
                        }
                      >
                        Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
      <RequestOtherTomatoDialog
        isOpen={isDialogOpen}
        onRequestClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />
    </>
  );
};

export default DataDisplay;
