import axios from "axios";
import type { Stock } from "./types";

const BASEURL = 'http://localhost:4000';

const fetchPortfolilo = async (source: "yahoo" | "google"): Promise<Stock[]> => {
    try {
        const res = await axios.get(`${BASEURL}/api/stocks?source=${source}`);
        console.log('api is calling', res);
        return res.data;

    } catch {
        console.error('error fetching portfolio data')
        return []
    }
}

export default fetchPortfolilo 