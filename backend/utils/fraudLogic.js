import fs from "fs";
import path from "path";

const ratesPath = path.join(process.cwd(), "utils", "pmjayRates.json");
const rules = JSON.parse(fs.readFileSync(ratesPath, "utf8"));

// Extract ALL valid numbers from a line → qty, unit, total
const extractNumbers = (text) => {
  const matches = text.match(/(\d+(\.\d+)?)/g);
  return matches ? matches.map(Number) : [];
};

export function detectFraud(ocrText) {
  // IMPORTANT FIX: Do NOT remove currency symbols before reading numbers
  // Only normalize them later
  const normalized = ocrText
    .replace(/[¥$€]/g, "₹") // Fix unexpected currencies
    .toLowerCase();

  const lines = normalized.split("\n");
  const frauds = [];

  for (const line of lines) {
    if (line.trim().length < 3) continue;

    for (const rule of rules) {
      const keywordMatch = rule.keywords.some((kw) =>
        line.includes(kw.toLowerCase())
      );
      if (!keywordMatch) continue;

      // Extract numbers → qty, unit price, total price
      const nums = extractNumbers(line);

      if (nums.length === 0) continue;

      const qty = nums[0] || null;
      const unitPrice = nums[1] || null;
      const totalPrice = nums[2] || (qty && unitPrice ? qty * unitPrice : null);

      // If unit price not detected, skip
      if (!unitPrice) continue;

      // FRAUD CHECK
      if (unitPrice > rule.max) {
        frauds.push({
          service: rule.name,
          qty,
          charged: unitPrice,     // 👈 FIX: now always stored
          allowed: rule.max,
          totalPrice,
          message: `${rule.name} per-unit price is overpriced.`,
        });
      }
    }
  }

  return frauds;
}
