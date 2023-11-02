const jwt = require("jsonwebtoken");
const express = require("express");
const tomatoDataRouter = express.Router();
const authenticate = require("../middleware/authenticate");
const PostData = require("../controllers/ApmcWiseTomatoData/PostData");
const GetData = require("../controllers/ApmcWiseTomatoData/GetData");
const DeleteData = require("../controllers/ApmcWiseTomatoData/DeleteData");
const GetTransactions = require("../controllers/TomatoTransactionData/getTransactionData");
const GetApmcCount = require("../controllers/TomatoTransactionData/getStats");

//Farmer Tomato Data
tomatoDataRouter.post("/submit-tomato-data", PostData);
//Getting the farmer submitted data
tomatoDataRouter.get("/get-tomato-data", GetData);
//Deleting the farmer submitted data
tomatoDataRouter.delete("/delete-tomato/:id", DeleteData);

tomatoDataRouter.get("/get-transactions", GetTransactions);
tomatoDataRouter.get("/get-stats", GetApmcCount);

module.exports = tomatoDataRouter;
