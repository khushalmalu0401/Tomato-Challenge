const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT;
const db = require("./db/conn");
const passport = require("passport");
const passportConfig = require("./config/Passport");
// const multer = require("multer");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(passport.initialize());
passportConfig(passport);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
  // console.log("payload", payload);
  done(null, payload);
});

passport.use(jwtStrategy);

//Router Files
app.use("/api/auth/", require("./router/Auth"));
app.use(
  "/api/transactions/",
  passport.authenticate("jwt", { session: false }),
  require("./router/Transactions")
);
app.use(
  "/api/request/",
  passport.authenticate("jwt", { session: false }),
  require("./router/Requests")
);
app.use(
  "/api/payment/",
  passport.authenticate("jwt", { session: false }),
  require("./router/Payment")
);
app.use(
  "/api/fullfill/",
  passport.authenticate("jwt", { session: false }),
  require("./router/FullFill")
);
app.use(
  "/api/stats/",
  passport.authenticate("jwt", { session: false }),
  require("./router/Statistics")
);

app.listen(PORT, () => {
  console.log(`server is running at port no ${PORT}`);
});
