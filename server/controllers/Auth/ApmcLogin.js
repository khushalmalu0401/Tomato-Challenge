const Apmc = require("../../models/ApmcSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Login = async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please fill in the data properly." });
    }

    const apmcLogin = await Apmc.findOne({ email: email });

    // console.log(ApmcLogin);

    if (apmcLogin) {
      const isMatch = await bcrypt.compare(password, apmcLogin.password);

      const payload = {
        apmc: {
          id: apmcLogin._id,
          name: apmcLogin.name, // Add the name to the payload
          email: apmcLogin.email, // Add the email to the payload
        },
        role: "apmc",
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

          res.json({ token, message: "Apmc Signed In Successfully." });
        }
      );
    } else {
      res.status(400).json({ error: "Invalid Credentials. " });
    }
  } catch (err) {
    // console.log(err);
  }
};

module.exports = Login;
