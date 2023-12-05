// import React from "react";
const User = require("../../models/FarmerSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Login = async (req, res) => {
  try {
    let token;
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res
        .status(400)
        .json({ error: "Please fill in the data properly." });
    }

    const userLogin = await User.findOne({ phone: phone });

    // console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const payload = {
        user: {
          id: userLogin._id,
          name: userLogin.name, // Add the name to the payload
          phone: userLogin.phone, // Add the phone to the payload
        },
        role: "farmer",
      };

      // Sign the token
      jwt.sign(
        payload,
        process.env.SECRET_KEY, // Use your secret key here
        { expiresIn: 3600 }, // Adjust the expiration time as needed
        (err, token) => {
          if (err) throw err;

          // Set the token in the cookie
          res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true,
          });

          res.json({ token, message: "User Signed In Successfully." });
        }
      );
    } else {
      res.status(400).json({ error: "Invalid Credentials. " });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = Login;
