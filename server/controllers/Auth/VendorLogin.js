// import React from "react";
const Vendor = require("../../models/VendorSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Login = async (req, res) => {
  try {
    // let token;
    const { phone, password } = req.body;
    // console.log(req.body);

    if (!phone || !password) {
      return res
        .status(400)
        .json({ error: "Please fill in the data properly." });
    }

    const vendorLogin = await Vendor.findOne({ phone: phone });

    // console.log(vendorLogin);

    if (vendorLogin) {
      const isMatch = await bcrypt.compare(password, vendorLogin.password);

      const payload = {
        vendor: {
          id: vendorLogin._id,
          name: vendorLogin.name, // Add the name to the payload
          phone: vendorLogin.phone, // Add the phone to the payload
        },
        role: "vendor",
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

          res.json({ token, message: "Vendor Signed In Successfully." });
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
