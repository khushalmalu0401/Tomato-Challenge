const jwt = require("jsonwebtoken");
const mongooose = require("mongoose");
const bcrypt = require("bcryptjs");

const farmerSchema = new mongooose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//We are Hashing the Password

farmerSchema.pre("save", async function (next) {
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
farmerSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const Farmers = mongooose.model("users", farmerSchema);
module.exports = Farmers;
