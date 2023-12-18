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

function generatePrices() {
  const salesDataDynamic = [];
  const today = new Date();

  for (let i = 9; i >= 0; i--) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() - i);

    const formattedDate = currentDate.toISOString().split("T")[0];
    const price = getRandomPrice();

    salesDataDynamic.push({ date: formattedDate, price });
  }

  function getRandomPrice() {
    // Implement your logic to get dynamic prices
    // For now, returning a random number between 2000 and 5000
    return Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
  }
  return salesDataDynamic;
}

function generateStocks() {
  const tomatoStocksDynamic = [];
  const today = new Date();

  for (let i = 9; i >= 0; i--) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() - i);

    const formattedDate = currentDate.toISOString().split("T")[0];
    const stocks = getRandomStocks();

    tomatoStocksDynamic.push({ date: formattedDate, stocks });
  }

  function getRandomStocks() {
    // Implement your logic to get dynamic stocks
    // For now, returning a random number between 1000 and 5000
    return Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
  }

  // console.log(tomatoStocksDynamic);
  return tomatoStocksDynamic;
}

const salesDataDynamic = generatePrices();
const tomatoStocksDynamic = generateStocks();

// console.log(salesDataDynamic);

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
  const [stockForApmc, setStockForApmc] = useState(0); // [TODO] Update this with the actual stock for the APMC
  const [
    vendorFullfilledTransactionsCount,
    setVendorFullfilledTransactionsCount,
  ] = useState(0);

  const [vendorPaidTransactionsCount, setVendorPaidTransactionsCount] =
    useState(0);

  const navigate = useNavigate();

  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const apmcName = decodedToken.apmc.name;
  // console.log(apmcName);
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const onBarEnter = (data, index) => {
    setActiveIndex(index);
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0]; // Extract and format the date
    return formattedDate;
  };

  const [loading, setLoading] = useState(true); // New state for loading

  useEffect(() => {
    try {
      fetch(`/api/transactions/farmer?selectedOption=${apmcName}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((jsonData) => {
          setData(jsonData.tomatoData);
          setTotalSupply(jsonData.totalTomatoInApmc);
          setTotalDemand(jsonData.totalTomatoRequestedToday);
          setTotalFarmers(jsonData.totalUniqueFarmers);
          setTotalVendors(jsonData.totalVendorsRequesting);
          setTotalApmcRequesting(jsonData.totalApmcRequesting);
          setStockForApmc(jsonData.stockForApmc);
          setVendorFullfilledTransactionsCount(
            jsonData.vendorFullfilledTransactionsCount
          );
          setVendorPaidTransactionsCount(jsonData.vendorPaidTransactionsCount);

          setLoading(false); // Set loading to false once data is loaded
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
              APMC Dashboard
            </Typography>
            <Typography variant="h4" align="center" gutterBottom>
              Welcome {apmcName} Admin!!!
            </Typography>
            <Typography variant="h4" align="left" gutterBottom>
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date())}
            </Typography>
            {/* {totalSupply - totalDemand < 0 ? ( */}
            <>
              <Typography variant="h5">
                <span style={{ color: "red", background: "yellow" }}>
                  Alert!!! Tomato Demand is greater than Supply, need{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {(totalDemand - totalSupply).toFixed(2)} Q
                  </span>{" "}
                  more tomates
                </span>
              </Typography>
              <Button
                onClick={() => navigate("/apmc/requestOtherApmc")}
                variant="contained"
                color="primary"
              >
                Request Other APMC
              </Button>
            </>
            {/* ) : (
              ""
            )} */}
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
                  Total Supply
                </Typography>
                <Typography variant="h4">{totalSupply}</Typography>
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
                  Total Demand
                </Typography>
                <Typography variant="h4">{totalDemand}</Typography>
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
                  Stocks Remaining
                </Typography>
                <Typography variant="h4">{stockForApmc.toFixed(2)}</Typography>
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
                  Total Farmers
                </Typography>
                <Typography variant="h4">{totalFarmers}</Typography>
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
                  Total Vendors Requesting
                </Typography>
                <Typography variant="h4">{totalVendors}</Typography>
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
                  Total Apmc Requesting
                </Typography>
                <Typography variant="h4">
                  {totalApmcRequesting ? totalApmcRequesting : 0}
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
                  Total Vendor Fullfilled Request
                </Typography>
                <Typography variant="h4">
                  {vendorFullfilledTransactionsCount}
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
                  Total Vendor Payment Pending
                </Typography>
                <Typography variant="h4">
                  {vendorPaidTransactionsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} className={classes.chartContainer}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{ marginTop: "20px" }}
                    >
                      Last week tomato prices
                    </Typography>
                    <LineChart
                      width={1280}
                      height={300}
                      data={salesDataDynamic}
                    >
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid stroke="#ccc" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="price" stroke="blue" />
                    </LineChart>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} className={classes.chartContainer}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{ marginTop: "20px" }}
                    >
                      Last week stocks in APMC
                    </Typography>
                    <BarChart
                      width={1280}
                      height={300}
                      data={tomatoStocksDynamic}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="stocks"
                        fill={COLORS[0]} // You can customize the color as needed
                        onMouseEnter={onBarEnter}
                      />
                    </BarChart>
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
