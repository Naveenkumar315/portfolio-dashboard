// backend/routes/stocks.js
import express from "express";
import fs from "fs";
import path from "path";
import { cleanPortfolioData } from "../utils/transformPortfolio.js";
import { getYahooFinanceLiveData } from "../services/yahooService.js";
import { getGoogleFinanceLiveData } from "../services/googleService.js";
import { logError, logInfo } from "../utils/logger.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { source } = req.query;
        console.log('API is calling');

        logInfo("API get started!", source)
        const filePath = path.join(process.cwd(), "utils", "portfolio.json");
        const rawData = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const stocks = cleanPortfolioData(rawData);
        const enriched = [];

        for (let stock of stocks) {
            console.log("Fetching:", stock.company);
            let live;
            if (source === "yahoo") {
                live = await getYahooFinanceLiveData(stock.company)
            } else {
                live = await getGoogleFinanceLiveData(stock.company)
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

            enriched.push({
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
            });
        }

        res.json(enriched);
    } catch (error) {
        res.status(500).json({ error: "Failed to process portfolio data" });
        logError('Error building portfolio', error.message)
    }
});

export default router;
