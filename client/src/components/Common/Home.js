import React from "react";
import myImage from "../../images/tomatochallenge.jpg"; // Import the image file
import image1 from "../../images/Pic.jpg";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
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
  // Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Paper,
} from "@mui/material";
import { red } from "@mui/material/colors";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

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

const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const decodedToken = token && jwt_decode(token);
  // console.log(decodedToken);
  // Sample data for the cards
  const cardData = [
    {
      name: "Khushal Malu",
      imageSrc: image1,
    },
    {
      name: "Atharva Patil",
      imageSrc: "path_to_image2.jpg",
    },
    {
      name: "Ritesh Lade",
      imageSrc: "path_to_image3.jpg",
    },
    {
      name: "Dr. R. N. Bhimanpallewar",
      imageSrc: "path_to_image3.jpg",
    },
  ];

  return (
    <div className="container">
      <div className="image-container mt-4">
        <img src={myImage} alt="My Image" className="img-fluid" />
        <Grid
          style={{ marginTop: "20px", marginBottom: "20px" }}
          container
          spacing={4}
        >
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              Trusted By
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
                  Used by
                </Typography>
                <Typography variant="h4">150+</Typography>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="h6"
                  gutterBottom
                >
                  APMCs
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
                  Trusted By
                </Typography>
                <Typography variant="h4">400+</Typography>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="h6"
                  gutterBottom
                >
                  Farmers
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
                  More Than
                </Typography>
                <Typography variant="h4">1800+</Typography>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="h6"
                  gutterBottom
                >
                  Transactions
                </Typography>
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
                  Handled
                </Typography>
                <Typography variant="h4">10000+</Typography>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="h6"
                  gutterBottom
                >
                  Q   of Tomato
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Home;
