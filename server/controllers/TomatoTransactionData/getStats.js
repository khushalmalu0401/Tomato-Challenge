const TomatoTransaction = require("../../models/TomatoTransactionSchema");
const ApmcSchema = require("../../models/ApmcSchema");
const UserSchema = require("../../models/FarmerSchema");

const GetStatistics = async (req, res) => {
  try {
    const uniqueApmcs = await ApmcSchema.distinct("apmc").countDocuments();
    const uniqueFarmers = await UserSchema.distinct("farmer").countDocuments();
    const transactionCount = await TomatoTransaction.countDocuments();

    // Calculate the total weight of tomatoes in quintal
    const aggregationResult = await TomatoTransaction.aggregate([
      {
        $group: {
          _id: null,
          totalWeight: { $sum: "$weight" },
        },
      },
    ]);
    const totalWeightInQuintal =
      aggregationResult.length > 0
        ? (aggregationResult[0].totalWeight / 100).toFixed(2)
        : "0.00";

    res.status(200).json({
      uniqueApmcs: uniqueApmcs,
      uniqueFarmers: uniqueFarmers,
      transactionCount,
      totalWeightInQuintal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetStatistics;
