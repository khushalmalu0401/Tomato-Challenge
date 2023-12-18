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
      fetch(`/api/request/apmc?apmcName=${apmcName}`, {
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
          setData(jsonData);
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
      const response = await fetch(`/api/request/apmc/${id}`, {
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
        // console.log("Data deleted successfully");
        toast.success("Request canceled successfully");
      } else {
        console.error("Error deleting data");
        toast.error("Error deleting data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating verification status");
    }
  };
  const initPayment = async ({ response, id }) => {
    const paymentData = await response.json();
    // console.log("paymentData", paymentData);
    const options = {
      key: "rzp_test_1c7gU5by6b6C2M", // Enter the Key ID generated from the Dashboard
      amount: paymentData.amount * paymentData.weight, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: paymentData.currency,
      name: "Acme Corp",
      description:
        "This is the transaction that took place between APMC and Vendor",
      image:
        "https://st2.depositphotos.com/4035913/6124/i/450/depositphotos_61243733-stock-illustration-business-company-logo.jpg",
      order_id: paymentData.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        try {
          const paymentId = response.razorpay_payment_id;
          const orderId = response.razorpay_order_id;
          const signature = response.razorpay_signature;
          const response2 = await fetch(`/api/payment/apmc/verify/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the token here
            },
            body: JSON.stringify({
              razorpay_payment_id: paymentId,
              razorpay_order_id: orderId,
              razorpay_signature: signature,
            }),
          });

          if (response2.ok) {
            // Remove the deleted item from the data displayed in the frontend
            const updatedData = data.filter((item) => item._id !== id);
            setData(updatedData);
            // console.log(response2);
            toast.success("Payment done successfully");
          } else {
            console.error("Error paying");
            toast.error("Error paying");
          }
        } catch (error) {
          console.error(error);
          toast.error("Error occurred while paying");
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  const handlePayment = async (id) => {
    try {
      const response = await fetch(`/api/payment/apmc/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
      });

      if (response.ok) {
        // Remove the deleted item from the data displayed in the frontend
        // const updatedData = data.filter((item) => item._id !== id);
        // setData(updatedData);
        // console.log(response);
        initPayment({ response, id });
        // toast.success("Payment done success  fully");
      } else {
        console.error("Error paying");
        toast.error("Error paying");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while paying");
    }
  };

  let serialNo = 1;
  return (
    <>
      <div style={{ margin: "30px 100px" }}>
        <div>
          <h3>Tomato Requested From Other APMC's</h3>
          <h4 variant="h4" align="left" gutterBottom>
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date())}
          </h4>
          <div className="table-responsive">
            <div></div>
            {data.length !== 0 ? (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>APMC Name</th>
                    <th>Location</th>
                    <th>Weight</th>
                    <th>Pay</th>
                    <th>Cancel</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.apmcMarketRequesting.id}>
                      <td>{serialNo++}</td>
                      <td>{item.apmcProviding.name}</td>
                      <td>{item.apmcProviding.name}</td>
                      <td>{item.weight}</td>
                      {item.paymentDone ? (
                        <td>
                          <button className="btn btn-primary" disabled>
                            Paid
                          </button>
                        </td>
                      ) : (
                        <td>
                          <button
                            onClick={() => handlePayment(item._id)}
                            className="btn btn-primary"
                          >
                            Pay
                          </button>
                        </td>
                      )}
                      {item.paymentDone === false ? (
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(item._id)}
                          >
                            Cancel
                          </button>
                        </td>
                      ) : (
                        <td>
                          <button className="btn btn-danger" disabled>
                            Cancel
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h5>You have not requested any other apmc</h5>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default DataDisplay;
