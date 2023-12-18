const TomatoData = require("../../models/TomatoTransactionSchema");
const TomatoRequest = require("../../models/TomatoRequest");
const RequestTomatoFromOtherApmc = require("../../models/RequestTomatoFromOtherApmc");
const TomatoStocksInApmc = require("../../models/TomatoStocksInApmc");

const GetApmcDashboard = async (req, res) => {
  const { selectedOption } = req.query;
  try {
    const { farmerPhone } = req.query;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    if (!farmerPhone && !selectedOption) {
      return res.status(400).json({ error: "Option is required." });
    }

    // Query your MongoDB collection for data based on the selected option
    if (farmerPhone) {
      const tomatoData = await TomatoData.find({
        "farmer.phone": farmerPhone,
        // date: today.toISOString(), 
      });
      // console.log(tomatoData);
      return res.status(200).json(tomatoData);
    } else if (selectedOption) {
      const tomatoData = await TomatoData.find({
        "apmcMarket.name": selectedOption,
        date: { $gte: today, $lt: tomorrow },
      });

      let totalTomatoInApmc = await TomatoData.aggregate([
        {
          $match: {
            "apmcMarket.name": selectedOption,
            date: { $gte: today, $lt: tomorrow },
          },
        },
        {
          $group: {
            _id: null,
            totalWeight: { $sum: "$weight" },
          },
        },
      ]);
      totalTomatoInApmc =
        totalTomatoInApmc.length > 0 ? totalTomatoInApmc[0].totalWeight : 0;
      totalTomatoInApmc = totalTomatoInApmc.toFixed(2);
      const vendorTomatoRequest = await TomatoRequest.aggregate([
        {
          $match: {
            "apmcMarket.name": selectedOption,
            date: { $gte: today, $lt: tomorrow },
          },
        },
        {
          $group: {
            _id: null,
            totalWeight: { $sum: "$weight" },
          },
        },
      ]);
      const apmcTomatoRequest = await RequestTomatoFromOtherApmc.aggregate([
        {
          $match: {
            "apmcProviding.name": selectedOption,
            date: { $gte: today, $lt: tomorrow },
          },
        },
        {
          $group: {
            _id: null,
            totalWeight: { $sum: "$weight" },
          },
        },
      ]);
      // console.log(vendorTomatoRequest);

      const totalTomatoRequestedToday =
        (vendorTomatoRequest.length > 0
          ? vendorTomatoRequest[0].totalWeight
          : 0) +
        (apmcTomatoRequest.length > 0 ? apmcTomatoRequest[0].totalWeight : 0);

      const uniqueFarmersCount = await TomatoData.aggregate([
        {
          $match: {
            "apmcMarket.name": selectedOption,
            date: { $gte: today, $lt: tomorrow },
          },
        },
        {
          $group: {
            _id: "$farmer.id",
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            totalUniqueFarmers: { $sum: 1 },
          },
        },
      ]);

      const totalUniqueFarmers =
        uniqueFarmersCount.length > 0
          ? uniqueFarmersCount[0].totalUniqueFarmers
          : 0;

      // console.log("Total unique farmers:", totalUniqueFarmers);

      const uniqueVendorCount = await TomatoRequest.aggregate([
        {
          $match: {
            "apmcMarket.name": selectedOption,
            date: { $gte: today, $lt: tomorrow },
          },
        },
        {
          $group: {
            _id: "$vendor.id",
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            totalUniqueVendors: { $sum: 1 },
          },
        },
      ]);

      const totalVendorsRequesting =
        uniqueVendorCount.length > 0
          ? uniqueVendorCount[0].totalUniqueVendors
          : 0;

      // console.log("Total unique farmers:", totalVendorsRequesting);

      const uniqueApmcsRequesting = await RequestTomatoFromOtherApmc.aggregate([
        {
          $match: {
            date: { $gte: today, $lt: tomorrow },
          },
        },
        {
          $group: {
            _id: {
              apmcRequesting: "$apmcProviding.id",
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            },
            totalApmcs: { $sum: 1 },
          },
        },
      ]);

      const totalApmcRequesting =
        uniqueApmcsRequesting.length > 0
          ? uniqueApmcsRequesting[0].uniqueApmcsRequesting
          : 0;

      const stocksData = await TomatoStocksInApmc.findOne({
        name: selectedOption,
        date: { $gte: today, $lt: tomorrow },
      });
      // console.log(stocksData);

      const stockForApmc = stocksData?.totalStocks
        ? stocksData?.totalStocks
        : 0;

      const vendorFullfilledTransactions = await TomatoRequest.find({
        "apmcMarket.name": selectedOption,
        fullfill: true,
        date: { $gte: today, $lt: tomorrow },
      });
      const vendorPaidTransactions = await TomatoRequest.find({
        "apmcMarket.name": selectedOption,
        paymentDone: true,
        date: { $gte: today, $lt: tomorrow },
      });

      const vendorFullfilledTransactionsCount =
        vendorFullfilledTransactions.length;
      const vendorPaidTransactionsCount = vendorPaidTransactions.length;

      res.status(200).json({
        tomatoData,
        totalTomatoInApmc,
        totalTomatoRequestedToday,
        totalUniqueFarmers,
        totalVendorsRequesting,
        totalApmcRequesting,
        stockForApmc,
        vendorPaidTransactionsCount,
        vendorFullfilledTransactionsCount,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = GetApmcDashboard;
