// backend/routes/stocks.js
import express from "express";
import fs from "fs";
import path, { dirname, join } from "path";
import pLimit from "p-limit";
import { fileURLToPath } from "url";
import { cleanPortfolioData } from "../utils/transformPortfolio.js";
import { getYahooFinanceLiveData } from "../services/yahooService.js";
import { getGoogleFinanceLiveData } from "../services/googleService.js";
import { logError, logInfo } from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, "../utils/portfolio.json");

const router = express.Router();
const limit = pLimit(3); // limit concurrent requests to 3

router.get("/", async (req, res) => {
    try {
        const { source } = req.query;
        console.log("API is calling");
        logInfo("API get started!", source);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Portfolio file not found at: ${filePath}`);
        }

        const rawData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const stocks = cleanPortfolioData(rawData);
        const enriched = [];


        for (let stock of stocks) {
            await limit(async () => {
                console.log(`Fetching live data for ${stock.company}`);

                let live;
                if (source === "yahoo") {
                    live = await getYahooFinanceLiveData(stock.company);
                } else {
                    live = await getGoogleFinanceLiveData(stock.company);
                }

                // CMP fallback to static value if live data fails
                const cmp = live?.cmp ?? stock.cmp ?? 0;
                const purchasePrice = Number(stock.purchasePrice) || 0;
                const qty = Number(stock.qty) || 0;
                const investment = purchasePrice * qty;
                const presentValue = cmp * qty;
                const gainLoss = presentValue - investment;
                const gainLossPercent = investment
                    ? ((gainLoss / investment) * 100).toFixed(2)
                    : 0;

                const enrichedData = {
                    name: stock.company,
                    symbol: live?.symbol ?? stock.symbol ?? "-",
                    cmp,
                    purchasePrice,
                    qty,
                    investment: investment.toFixed(2),
                    presentValue: presentValue.toFixed(2),
                    gainLoss: gainLoss.toFixed(2),
                    gainLossPercent,
                    pe: live?.pe ?? "-",
                    eps: live?.eps ?? "-",
                    marketCap: live?.marketCap ?? "-",
                    sector: live?.sector ?? "Unknown",
                    stage2: stock.stage2 || "-",
                };

                enriched.push(enrichedData);
            });
        }

        res.json(enriched);
    } catch (error) {
        console.error("Error in /api/stocks:", error);
        res.status(500).json({ error: "Failed to process portfolio data" });
        logError("Error building portfolio", error.message);
    }
});

export default router;
