import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { red } from "@mui/material/colors";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import {
  Grid,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  CardMedia,
  Button,
} from "@material-ui/core";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
const useStyles = makeStyles((theme) => ({
  root: {
    margin: "20px 100px",
    padding: "20px",
  },
  summaryItem: {
    border: "1px solid #ccc",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
  },
  tableContainer: {
    marginTop: theme.spacing(1),
  },
  chartContainer: {
    marginTop: theme.spacing(1),
  },
  summaryItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    height: "160px",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));
const DataDisplay = () => {
  const [data, setData] = useState([]);
  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const apmcName = decodedToken.apmc.name;

  useEffect(() => {
    try {
      fetch(`/api/transactions/farmer?selectedOption=${apmcName}`, {
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
          setData(jsonData.tomatoData);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
  }, []);

  let serialNo = 1;
  return (
    <>
      <div style={{ margin: "30px 100px" }}>
        <Typography variant="h6" align="center" gutterBottom>
          APMC Dashboard
        </Typography>

        <div style={{ marginTop: "20px" }}>
          <h3>Famer {apmcName} Transactions</h3>
          <div className="table-responsive">
            <div></div>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Farmer Name</th>
                  <th>Contact</th>
                  <th>Date</th>
                  {/* <th>Time</th> */}
                  <th>Weight</th>
                  <th>Trade Price</th>
                </tr>
              </thead>
              <tbody>
                {data ? data. map((item) => (
                  <tr key={item.apmcMarket._id}>
                    <td>{serialNo++}</td>
                    <td>{item.farmer.name}</td>
                    <td>{item.farmer.phone}</td>
                    <td>{new Date(item.date).toISOString().split("T")[0]}</td>
                    {/* <td>{item.currentTime}</td> */}
                    <td>{item.weight}</td>
                    <td>{item.price}</td>
                  </tr>
                )): (
                    <h6>No Farmer has trade tomato today!!!</h6>
                )}
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
