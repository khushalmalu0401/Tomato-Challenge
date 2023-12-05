const jwt = require("jsonwebtoken");
const express = require("express");
const PaymentRouter = express.Router();
const PostPayment = require("../controllers/Payment/Post");
const VerifyPayment = require("../controllers/Payment/Verify");
const PostApmcPayment = require("../controllers/Payment/ApmcPost");
const VerifyApmcPayment = require("../controllers/Payment/ApmcVerify");

PaymentRouter.post("/vendor/:id", PostPayment);
PaymentRouter.post("/vendor/verify/:id", VerifyPayment);

PaymentRouter.post("/apmc/:id", PostApmcPayment);
PaymentRouter.post("/apmc/verify/:id", VerifyApmcPayment);

module.exports = PaymentRouter;
