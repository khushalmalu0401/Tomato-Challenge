const mongoose = require("mongoose");
const Apmc = require("../models/ApmcSchema");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

const passportConfig = (passport) => {
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.find({ id: jwt_payload._id }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      });
    })
  );
};

module.exports = passportConfig;
