import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import TomatoWeightDialog from "../Vendor/RequestDialog";

const ApmcList = () => {
  const [apmcCount, setApmcCount] = useState(0);
  const [apmcList, setApmcList] = useState([]);
  const [apmcSelected, setApmcSelected] = useState("");
  const [apmcSelectedId, setApmcSelectedId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (apmc) => {
    setApmcSelected(apmc.name); // Set the APMC name
    setApmcSelectedId(apmc._id); // Set the APMC id
    setIsDialogOpen(true);
  };
  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);

  const handleDialogSubmit = async (tomatoWeight) => {
    // Handle the submitted tomato weight here

    // console.log("Tomato Weight:", tomatoWeight);

    const res = await fetch("/api/request/vendor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token here
      },
      body: JSON.stringify({
        vendorId: decodedToken.vendor.id,
        vendorName: decodedToken.vendor.name,
        phoneNumber: decodedToken.vendor.phone,
        apmcMarketName: apmcSelected,
        apmcId: apmcSelectedId,
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

  useEffect(() => {
    try {
      fetch(`/api/stats/list`, {
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
          // console.log("jsonData", jsonData);
          setApmcCount(jsonData.apmcCount);
          setApmcList(jsonData.apmcList);
          // setData(jsonData);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
  }, []);

  const handleSubmit = () => {
    try {
      fetch(`/api/tomatoData/list`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
        body: JSON.stringify({
          name: decodedToken.name,
          email: decodedToken.email,
          phone: decodedToken.phone,
          state: decodedToken.state,
          location: decodedToken.location,
          price: decodedToken.price,
          quantity: decodedToken.quantity,
          date: formatDateString(decodedToken.date),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((jsonData) => {
          // console.log("jsonData", jsonData);
          toast.success("Request submitted successfully");
          // setData(jsonData);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
  };

  let serialNo = 1;
  return (
    <>
      <div style={{ margin: "30px 100px" }}>
        <div>
          <h3>There are total {apmcCount} APMC market in India</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>APMC Name</th>
                  <th>Location</th>
                  <th>State</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Trade Price</th>
                </tr>
              </thead>
              <tbody>
                {apmcList.map((item) => (
                  <tr key={item._id}>
                    <td>{serialNo++}</td>
                    <td>{item.name}</td>
                    <td>{item.location}</td>
                    <td>{item.state}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>₹{item.currentPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
      <TomatoWeightDialog
        isOpen={isDialogOpen}
        onRequestClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />
    </>
  );
};

export default ApmcList;
