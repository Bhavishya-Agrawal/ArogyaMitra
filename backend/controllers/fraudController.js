import FraudReport from "../models/FraudReport.js";

export const getFraudReport = async (req, res) => {
  const id = req.params.id;
  // if id == 'latest' return latest report for user (optional)
  if (id === "latest" && req.user?.id) {
    const r = await FraudReport.findOne().sort({ createdAt: -1 });
    if (!r) return res.json(null);
    return res.json(r);
  }

  const report = await FraudReport.findById(id);
  if (!report) return res.status(404).json({ message: "Not found" });
  res.json(report);
};
