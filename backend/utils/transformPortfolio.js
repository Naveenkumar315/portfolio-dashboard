// backend/utils/transformPortfolio.js
export function cleanPortfolioData(rawData) {
    return rawData
        .filter(
            row =>
                typeof row["__EMPTY"] === "number" && row["__EMPTY_1"] && !row["__EMPTY_1"].includes("Sector")
        )
        .map(row => ({
            company: row["__EMPTY_1"],
            purchasePrice: Number(row["__EMPTY_2"]),
            qty: Number(row["__EMPTY_3"]),
            investment: Number(row["__EMPTY_4"]),
            portfolioPercent: Number(row["__EMPTY_5"] || 0),
            symbol: row["__EMPTY_6"],
            cmp: Number(row["__EMPTY_7"]) || 0,
            presentValue: Number(row["__EMPTY_8"]) || 0,
            gainLoss: Number(row["__EMPTY_9"]) || 0,
            gainLossPercent: Number(row["__EMPTY_10"]) || 0,
            pe: row["__EMPTY_12"] || null,
            latestEarnings: row["__EMPTY_13"] || null,
            revenue: row["Core Fundamentals"] || null,
            ebitda: row["__EMPTY_14"] || null,
            pat: row["__EMPTY_16"] || null,
            stage2: row["__EMPTY_30"] || null,
        }));
}
