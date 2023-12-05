const TomatoRequest = require("../../models/TomatoRequest");
const APMC = require("../../models/ApmcSchema");
const Crypto = require("crypto");
const Razorpay = require("razorpay");

const FullFillRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    // Find the tomato request by ID
    const tomatoRequest = await TomatoRequest.findById(requestId);

    if (!tomatoRequest) {
      return res.status(404).json({ error: "Tomato request not found" });
    }
    const apmcId = tomatoRequest.apmcMarket.id;
    const weight = tomatoRequest.weight;

    // Fetch the APMC data
    const apmc = await APMC.findById(apmcId);
    const price = apmc.currentPrice;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: (weight / 100) * price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: Crypto.randomBytes(20).toString("hex"),  
    };

    const order = await instance.orders.create(options);
    if (!order) {
      return res.status(500).json({ error: "Some error occured" });
    } else {
      return res.status(200).json(order);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = FullFillRequest;
