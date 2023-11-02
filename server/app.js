const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT;
const db = require("./db/conn");
const passport = require("passport");
const passportConfig = require("./config/passport");
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
app.use("/api/auth/", require("./router/AuthRouter"));
app.use(
  "/api/tomatoData/",
  passport.authenticate("jwt", { session: false }),
  require("./router/TomatoData")
);
app.use(
  "/api/apmcData/",
  passport.authenticate("jwt", { session: false }),
  require("./router/ApmcRouter")
);

app.listen(PORT, () => {
  console.log(`server is running at port no ${PORT}`);
});
