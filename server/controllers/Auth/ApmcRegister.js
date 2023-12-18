// import React from "react";
const Apmc = require("../../models/ApmcSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Register = async (req, res) => {
  const { name, location, pinCode, state, district, email, password, cpassword, phone } =
    req.body;
    // console.log(req.body);
  if (
    !name ||
    !location ||
    !pinCode ||
    !state ||
    !district ||
    !email ||
    !phone ||
    !password ||
    !cpassword
  ) {
    return res.status(422).json({ error: "Please fill in the data properly." });
  }

  try {
    const apmcExist = await Apmc.findOne({ email: email });
    // console.log(apmcExist);

    if (apmcExist) {
      return res.status(422).json({ error: "Apmc Already Exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Password does not match." });
    } else {
      const apmc = new Apmc({
        name,
        location,
        pinCode,
        state,
        district,
        email,
        password,
        cpassword,
        phone,
      });
      await apmc.save();
      res.status(201).json({ message: "APMC Registered Successfully.." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = Register;
