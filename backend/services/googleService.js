import axios from "axios";
import * as cheerio from "cheerio";
import { logError, logInfo } from "../utils/logger.js";

// Solution 1: Web Scraping Google Finance (Most Direct)
export async function getGoogleFinanceLiveData(companyName) {
    try {
        console.log("Fetching Google Finance data for:", companyName);

        // Try different symbol formats
        const symbols = [
            `NSE:${companyName.toUpperCase().replace(/\s/g, "")}`,
            companyName.toUpperCase().replace(/\s/g, ""),
        ];

        for (const symbol of symbols) {
            console.log("Trying symbol:", symbol);

            try {
                const url = `https://www.google.com/finance/quote/${symbol}`;
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'text/html,application/xhtml+xml',
                        'Accept-Language': 'en-US,en;q=0.9',
                    },
                    timeout: 10000
                });

                const $ = cheerio.load(response.data);

                // Extract price from Google Finance HTML
                const price = $('.YMlKec.fxKbKc').first().text();
                const name = $('.zzDege').first().text();
                const change = $('.JwB6zf').first().text();
                const changePercent = $('.JwB6zf').eq(1).text();

                if (!price) continue; // Try next symbol if no price found

                // Extract additional data
                const previousClose = $('div:contains("Previous close")').next().text();
                const dayHigh = $('div:contains("Day range")').parent().find('.P6K39c').text().split(' - ')[1];
                const dayLow = $('div:contains("Day range")').parent().find('.P6K39c').text().split(' - ')[0];
                const fiftyTwoWeekHigh = $('div:contains("52-week high")').next().text();
                const fiftyTwoWeekLow = $('div:contains("52-week low")').next().text();

                const data = {
                    name: name || companyName,
                    symbol,
                    cmp: parseFloat(price.replace(/,/g, '')),
                    change: parseFloat(change.replace(/[₹,]/g, '')),
                    changePercent: parseFloat(changePercent.replace(/[%()]/g, '')),
                    previousClose: parseFloat(previousClose?.replace(/,/g, '') || 0),
                    high: parseFloat(dayHigh?.replace(/,/g, '') || 0),
                    low: parseFloat(dayLow?.replace(/,/g, '') || 0),
                    fiftyTwoWeekHigh: parseFloat(fiftyTwoWeekHigh?.replace(/,/g, '') || 0),
                    fiftyTwoWeekLow: parseFloat(fiftyTwoWeekLow?.replace(/,/g, '') || 0),
                    currency: "INR",
                    exchange: "NSE",
                    source: "Google Finance",
                    timestamp: new Date().toISOString(),
                };

                logInfo(`✅ Google Finance data fetched for ${companyName}`, data);
                return data;
            } catch (err) {
                console.log(`Failed with symbol ${symbol}, trying next...`);
                continue;
            }
        }

        throw new Error("No data found for any symbol format");
    } catch (err) {
        console.error("Google Finance error:", companyName, err.message);
        logError("Google Finance error:", companyName, err);
        return null;
    }
}

// Solution 2: Using Google Sheets API (if you have API key)
export async function getGoogleSheetsFinanceData(symbol, apiKey) {
    try {
        // You can use GOOGLEFINANCE function in Google Sheets via Sheets API
        const spreadsheetId = "YOUR_SPREADSHEET_ID";
        const range = "Sheet1!A1";

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

        // In the sheet, use: =GOOGLEFINANCE("NSE:SYMBOL", "price")
        const response = await axios.get(url);

        return response.data;
    } catch (err) {
        console.error("Google Sheets API error:", err);
        return null;
    }
}

// Solution 3: NSE India Official API (Most Reliable for NSE)
export async function getNSEOfficialData(symbol) {
    try {
        const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.nseindia.com/',
            }
        });

        const data = response.data.priceInfo;

        return {
            name: response.data.info.companyName,
            symbol: symbol,
            cmp: data.lastPrice,
            open: data.open,
            high: data.intraDayHighLow.max,
            low: data.intraDayHighLow.min,
            previousClose: data.previousClose,
            change: data.change,
            changePercent: data.pChange,
            volume: data.totalTradedVolume,
            fiftyTwoWeekHigh: data.weekHighLow.max,
            fiftyTwoWeekLow: data.weekHighLow.min,
            exchange: "NSE",
            source: "NSE India",
            timestamp: new Date().toISOString(),
        };
    } catch (err) {
        console.error("NSE API error:", err);
        return null;
    }
}