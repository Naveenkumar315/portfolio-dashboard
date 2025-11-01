import YahooFinance from "yahoo-finance2";
import { logError, logInfo } from "../utils/logger.js"

export async function getYahooFinanceLiveData(companyName) {
    try {
        console.log('fetching yahoo data');

        const yahooFinance = new YahooFinance();
        const searchResults = await yahooFinance.search(companyName);
        const nseListing = searchResults.quotes.find(q => q.exchange === "NSI");
        const symbol = nseListing?.symbol || searchResults.quotes[0]?.symbol;

        const quote = await yahooFinance.quote(symbol);

        return {
            name: quote.shortName,
            symbol,
            cmp: quote.regularMarketPrice,
            currency: quote.currency,
            sector: nseListing?.sector,
            industry: nseListing?.industry,
            exchange: nseListing?.exchDisp,
        };
    } catch (err) {
        console.error("Yahoo Finance error:", companyName, err.message);
        // logError('Yahoo Finance error:', companyName, "error: ", err)
        return null;
    }
}
