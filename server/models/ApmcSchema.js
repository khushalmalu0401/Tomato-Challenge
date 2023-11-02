const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Define the APMC schema
const apmcSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  commodities: [
    {
      type: String,
    },
  ],
  currentPrice: {
    type: Number, // You can change the type to match your data structure
    default: 0, // You can set a default value if needed
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

apmcSchema.pre("save", async function (next) {
  // console.log("hi from inside");
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 12);
      this.cpassword = await bcrypt.hash(this.cpassword, 12);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

//We are generating Token
apmcSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

// Create a model from the schema
const APMC = mongoose.model("APMC", apmcSchema);

module.exports = APMC;
