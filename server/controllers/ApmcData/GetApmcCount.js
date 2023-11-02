const TomatoTransaction = require("../../models/TomatoTransactionSchema");
const ApmcSchema = require("../../models/ApmcSchema");
const UserSchema = require("../../models/userSchema");

const GetApmcCount = async (req, res) => {
  try {
    const apmcs = await ApmcSchema.find({}, {
        _id: 1,
        name: 1,
        location: 1,
        state: 1,
        email: 1,
        phone: 1,
        currentPrice: 1,
        // Add any other fields you want to include
      });
    const apmcCount = await ApmcSchema.distinct("name").countDocuments();
    // console.log(apmcs);
    res.status(200).json({
      apmcCount: apmcCount,
      apmcList: apmcs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetApmcCount;
