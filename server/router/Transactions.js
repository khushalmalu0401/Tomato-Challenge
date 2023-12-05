const jwt = require("jsonwebtoken");
const express = require("express");
const TransactionsRouter = express.Router();
const authenticate = require("../middleware/authenticate");
const PostData = require("../controllers/Farmer/Post");
const GetData = require("../controllers/APMC/GetDashboard");
const DeleteData = require("../controllers/Farmer/Delete");
const GetTransactions = require("../controllers/TomatoTransactionData/getTransactionData");
const GetApmcCount = require("../controllers/TomatoTransactionData/getStats");
const GetFarmerDashboard = require("../controllers/Farmer/GetDashboard");

//Farmer Apmc Transaction Tomato Data
// TransactionsRouter.get("/get-tomato-data", GetData);
TransactionsRouter.get("/farmer", GetData);
TransactionsRouter.get("/farmer/dashboard/:farmerPhone", GetFarmerDashboard);

//Getting the farmer submitted data
// TransactionsRouter.post("/submit-tomato-data", PostData);
TransactionsRouter.post("/farmer", PostData);

//Deleting the farmer submitted data
// TransactionsRouter.delete("/delete-tomato/:id", DeleteData);
TransactionsRouter.delete("/farmer/:id", DeleteData);

TransactionsRouter.get("/get-transactions", GetTransactions);
TransactionsRouter.get("/get-stats", GetApmcCount);

module.exports = TransactionsRouter;
