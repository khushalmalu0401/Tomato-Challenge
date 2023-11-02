// import React from "react";
const User = require("../../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Register = async (req, res) => {
  const { name, phone, password, cpassword } = req.body;
  if (!name || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill in the data properly." });
  }

  try {
    const userExist = await User.findOne({ phone: phone });
    console.log(userExist);

    if (userExist) {
      return res.status(422).json({ error: "User Already Exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Password does not match." });
    } else {
      const user = new User({ name, phone, password, cpassword });
      await user.save();
      res.status(201).json({ message: "User Registered Successfully.." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = Register;
