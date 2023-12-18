import React, { useState, useCallback, useEffect } from "react";
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

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import { useNavigate } from "react-router";

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
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
}));

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF99E6",
  "#AF19FF",
  "#FFA919",
];

const chartData = [
  { name: "Pune", value: 2045 },
  { name: "Satara", value: 1022 },
  { name: "Jaysingpur", value: 560 },
  { name: "Kolhapur", value: 1560 },
];

const salesData = [
  { month: "Jan", price: 2200 },
  { month: "Feb", price: 2150 },
  { month: "Mar", price: 1866 },
  { month: "Apr", price: 2289 },
  { month: "May", price: 3566 },
  { month: "Jun", price: 4497 },
  { month: "Jul", price: 2610 },
  { month: "Aug", price: 2467 },
  { month: "Sep", price: 2399 },
  { month: "Oct", price: 3150 },
  { month: "Nov", price: 2950 },
  { month: "Dec", price: 3472 },
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Demand ${value} Q`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Demand % ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const DataDisplay = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalDemand, setTotalDemand] = useState(0);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalApmcRequesting, setTotalApmcRequesting] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0]; // Extract and format the date
    return formattedDate;
  };

  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const FarmerName = decodedToken.user.name;
  const FarmerPhone = decodedToken.user.phone;

  useEffect(() => {
    try {
      fetch(`/api/transactions/farmer/dashboard/${FarmerPhone}`, {
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
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
  }, []);

  let serialNo = 1;
  if (loading) {
    return (
      <div
        className={classes.loadingContainer}
        // class="spinner-border"
        // role="status"
      >
        <div class="spinner-border" role="status"></div>
      </div>
    );
  }
  return (
    <>
      <div style={{ margin: "30px 100px" }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6" align="center" gutterBottom>
              Farmer's Dashboard
            </Typography>
            <Typography variant="h4" align="center" gutterBottom>
              Welcome {FarmerName}!!!
            </Typography>
            <Typography variant="h5" align="left" gutterBottom>
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date())}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.summaryItem}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    Q
                  </Avatar>
                }
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Transactions
                </Typography>
                <Typography variant="h4">{data?.totalCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.summaryItem}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    Q
                  </Avatar>
                }
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Profit
                </Typography>
                <Typography variant="h4">
                  ₹{data?.totalProfitValue?.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.summaryItem}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    <PeopleAltIcon />
                  </Avatar>
                }
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Highest Price Today
                </Typography>
                <Typography variant="h4">
                  ₹{data?.highestPriceApmc?.currentPrice?.toFixed(2)}
                </Typography>
                <Typography variant="p" style={{ fontWeight: "bold" }}>
                  {data?.highestPriceApmc?.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.summaryItem}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    Σ
                  </Avatar>
                }
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Apmcs
                </Typography>
                <Typography variant="h4">{data?.totalApmcCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} className={classes.chartContainer}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{ marginTop: "20px" }}
                    >
                      Monthly Tomato Prices (2023)
                    </Typography>
                    <LineChart width={600} height={300} data={salesData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid stroke="#ccc" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="price" stroke="#ff5733" />
                    </LineChart>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} className={classes.chartContainer}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{ marginTop: "20px" }}
                    >
                      Top Apmcs Demanding Tomato
                    </Typography>
                    <PieChart width={600} height={300}>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={chartData}
                        cx={280}
                        cy={140}
                        innerRadius={70}
                        outerRadius={100}
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={entry.number}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <ToastContainer />
    </>
  );
};

export default DataDisplay;
