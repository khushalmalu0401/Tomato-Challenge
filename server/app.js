const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
dotenv.config({path: './config.env'})
const PORT = process.env.PORT || 3000; // Ensure a default port is set if PORT is not specified
const db = require("./db/conn");
const passport = require("passport");
const passportConfig = require("./config/passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  // At this point, you should find the user in your database based on the payload
  // Example assuming you have a User model:
  // User.findById(payload.id)
  //   .then(user => {
  //     if (user) {
  //       return done(null, user);
  //     }
  //     return done(null, false);
  //   })
  //   .catch(err => done(err, false));

  // For simplicity, we'll just pass the payload directly for now
  done(null, payload);
});

passport.use(jwtStrategy);

// Router Files
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
  console.log(`Server is running at port no ${PORT}`);
});
