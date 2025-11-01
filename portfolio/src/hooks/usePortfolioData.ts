import { useEffect, useState } from "react";
import fetchPortfolilo from "../lib/fetchers";
import type { Stock } from "../lib/types";

export default function usePortfolioData(source: "yahoo" | "google") {
    const [data, setData] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)

    async function loadData() {
        try {
            const portfolio = await fetchPortfolilo(source);
            setData(portfolio);
        } catch (error) {
            setError("Failed to fetch portfolio data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData();
        // const interval = setInterval(loadData, 15000)
        // return () => clearInterval(interval)
    }, [source])

    return { data, error, loading }
}



