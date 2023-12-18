// import React from "react";
const Vendor = require("../../models/VendorSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const VendorRegister = async (req, res) => {
  const { name, phone, password, cpassword } = req.body;
  if (!name || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill in the data properly." });
  }

  try {
    const vendorExist = await Vendor.findOne({ phone: phone });
    // console.log(vendorExist);

    if (vendorExist) {
      return res.status(422).json({ error: "Vendor Already Exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Password does not match." });
    } else {
      const vendor = new Vendor({ name, phone, password, cpassword });
      await vendor.save();
      res.status(201).json({ message: "Vendor Registered Successfully.." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = VendorRegister;
