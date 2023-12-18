import React, { useCallback, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
} from "@material-ui/core";
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

import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Paper,
} from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import PendingIcon from "@mui/icons-material/Pending";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
// import apiClient from "../../apis/api-client";
// import urls from "../../apis/urls";
import Cookies from "js-cookie";

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
      >{`Sales ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const Dashboard = () => {
  const classes = useStyles();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [apmcCount, setApmcCount] = useState(0);
  const [farmerCount, setFarmerCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [apmcMonthlyData, setApmcMonthlyData] = useState([]);

  const [month, setMonth] = useState(new Date().getMonth());
  const [wholeData, setWholeData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    months[new Date().getFullYear()]
  );
  const [yearlyData, setYearlyData] = useState([]);
  // Define a function to handle year selection

  // console.log("months", month);
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data when the selected year changes
    fetchDataForYear(selectedYear);
  }, [selectedYear]);

  const fetchDataForYear = (year) => {
    // Send a request to your backend to fetch data for the selected year
    const token = Cookies.get("token");
    fetch(`/api/tomatoData/get-transactions?year=${year}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token here
      },
    })
      .then((response) => {
        setYearlyData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const token = Cookies.get("token");
    try {
      fetch(`/api/transactions/get-transactions`, {
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
          // console.log(jsonData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
    try {
      fetch(`/api/transactions/get-stats`, {
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
          setApmcCount(jsonData.uniqueApmcs);
          setFarmerCount(jsonData.uniqueFarmers);
          setTransactionCount(jsonData.transactionCount);
          setTotalWeight(jsonData.totalWeightInQuintal);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
    try {
      fetch(`/api/stats/getTomatoStocks`, {
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
          setWholeData(jsonData);
          setApmcMonthlyData(jsonData[new Date().getMonth()].data);
          // console.log(jsonData);
        })
        .catch((error) => {
          console.error("Error fetching or processing data: " + error);
        });
    } catch (error) {
      console.error("Error in the fetch request: " + error);
    }
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const chartData = [
    { name: "Pune", value: 30 },
    { name: "Satara", value: 20 },
    { name: "Jaysingpur", value: 15 },
    { name: "Kolhapur", value: 35 },
  ];

  const formatDate = (date) => {
    // console.log(date);
    const originalDate = new Date(date);
    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1; // Months are zero-indexed
    const year = originalDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };

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
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Tomato Admin Dashboard
          </Typography>
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
                Total APMC
              </Typography>
              <Typography variant="h4">{apmcCount}</Typography>
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
              <Typography variant="h4">{farmerCount}</Typography>
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
                Total Transactions
              </Typography>
              <Typography variant="h4">{transactionCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.summaryItem}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  q
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Weight(in q)
              </Typography>
              <Typography variant="h4">{totalWeight}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} className={classes.chartContainer}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ marginTop: "20px" }}
                  >
                    Monthly Tomato Demand and Supply (in KG)
                  </Typography>

                  {/* Dropdown for year selection */}
                  <Select
                    native
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ marginBottom: "10px" }}
                  >
                    <option value={new Date().getFullYear()}>
                      {new Date().getFullYear()}
                    </option>
                    <option value={2022}>2022</option>
                    <option value={2021}>2021</option>
                    <option value={2020}>2020</option>
                  </Select>
                  <Select
                    native
                    value={months[month]}
                    onChange={(e) => {
                      const selectedMonth = e.target.value;
                      setMonth(months[selectedMonth]); // Set the selected month in the state
                      setApmcMonthlyData(wholeData[selectedMonth].data); // You can call your data-fetching function here
                    }}
                    style={{ marginBottom: "10px" }}
                  >
                    <option value="">{months[new Date().getMonth()]}</option>
                    {months.map((monthName, index) => (
                      <option value={index} key={monthName}>
                        {monthName}
                      </option>
                    ))}
                  </Select>

                  <BarChart width={1200} height={300} data={apmcMonthlyData}>
                    <XAxis dataKey="apmc" type="category" />
                    <YAxis />
                    <CartesianGrid stroke="#ccc" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="demand"
                      fill="#FF0000"
                      barSize={20}
                      name="Demand"
                    />
                    <Bar
                      dataKey="stocks"
                      fill="#097969"
                      barSize={20}
                      name="Stocks"
                    />
                  </BarChart>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={6} className={classes.chartContainer}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ marginTop: "20px" }}
                  >
                    Tomatoes in APMC (in KG)
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
        </Grid> */}
        {/* <Grid item xs={12} sm={4} className={classes.tableContainer}>
          <Paper style={{ padding: "20px" }}>
            <Typography variant="h6" className={classes.tableTitle}>
              Latest Products
            </Typography>
            {latestProducts?.map((product) => (
              <Card
                key={product.orderId}
                sx={{ fullWidth: 400, marginBottom: "10px" }}
              >
                <CardHeader
                  avatar={
                    <CardMedia
                      style={{
                        objectFit: "contain",
                        width: "60px",
                        height: "60px",
                      }}
                      component="img"
                      alt={product[0]}
                      src={product[1]}
                    />
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={product[0]}
                  subheader="September 14, 2016"
                />
              </Card>
            ))}
          </Paper>
        </Grid> */}
        {/* <Grid item xs={12} sm={8} className={classes.tableContainer}>
          <TableContainer component={Card} style={{ padding: "20px" }}>
            <Typography variant="h6" className={classes.tableTitle}>
              Recent Orders
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order[0]}</TableCell>
                    <TableCell>
                      {order[1]} {order[2]}
                    </TableCell>
                    <TableCell>{order[3]}</TableCell>
                    <TableCell>{formatDate(order[4])}</TableCell>
                    <TableCell>₹{order[5]}</TableCell>
                    <TableCell>{order[6]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid> */}

        {/* <div style={{ margin: "30px 100px" }}>
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
                    <th>Request Tomato</th>
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

                      <td>
                        <button
                          className="btn btn-success"
                          onClick={handleOpenDialog}
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}
      </Grid>
    </div>
  );
};

export default Dashboard;
