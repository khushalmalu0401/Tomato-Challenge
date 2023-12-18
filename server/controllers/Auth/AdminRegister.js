// import React from "react";
const Admin = require("../../models/AdminSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Register = async (req, res) => {
  const { name, email, password, cpassword, phone, appointedBy } = req.body;
  if (!name || !email || !password || !cpassword || !phone || !appointedBy) {
    return res.status(422).json({ error: "Please fill in the data properly." });
  }

  try {
    const adminExist = await Admin.findOne({ email: email });
    // console.log(adminExist);

    if (adminExist) {
      return res.status(422).json({ error: "Admin Already Exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Password does not match." });
    } else {
      const admin = new Admin({
        name,
        email,
        password,
        cpassword,
        phone,
        appointedBy,
      });
      await admin.save();
      res.status(201).json({ message: "Admin Registered Successfully.." });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = Register;
