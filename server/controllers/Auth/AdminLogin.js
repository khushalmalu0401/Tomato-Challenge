// import React from "react";
const Admin = require("../../models/AdminSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const AdminLogin = async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (email === "admin" && password === "admin") {
      token = jwt.sign({ email: email, role: "admin" }, process.env.SECRET_KEY);
      return res.json({ token, message: "Admin Signed In Successfully." });
    }
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please fill in the data properly." });
    }

    const adminLogin = await Admin.findOne({ email: email });

    // console.log(adminLogin);

    if (adminLogin) {
      const isMatch = await bcrypt.compare(password, adminLogin.password);

      const payload = {
        admin: {
          id: adminLogin._id,
          name: adminLogin.name, // Add the name to the payload
          email: adminLogin.email, // Add the email to the payload
        },
        role: "admin",
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

          res.json({ token, message: "Admin Signed In Successfully." });
        }
      );
    } else {
      res.status(400).json({ error: "Invalid Credentials. " });
    }
  } catch (err) {
    // console.log(err);
  }
};

module.exports = AdminLogin;
