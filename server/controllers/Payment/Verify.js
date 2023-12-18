const TomatoRequest = require("../../models/TomatoRequest");
const Crypto = require("crypto");

const FullFillRequest = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    // console.log(req.body);
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = Crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const tomatoRequest = await TomatoRequest.findById(req.params.id);
      if (!tomatoRequest) {
        return res.status(404).json({ error: "Tomato request not found" });
      }
      tomatoRequest.paymentDone = true;
      await tomatoRequest.save();
      return res.status(200).json({ message: "Payment successfull" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = FullFillRequest;
