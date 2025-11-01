// components/Dashboard.tsx (only the relevant parts shown)
import { useState } from "react";
import Header from "./Header";
import ChartCard from "./ChartCard";
import usePortfolioData from "../hooks/usePortfolioData";
import { SectorPieChart } from "../charts/SectorPieChart";
import { SectorGainLossBar } from "../charts/SectorGainLossBar";
import { InvestmentVsValue } from "../charts/InvestmentVsValue";
import { TopGainersLosers } from "../charts/TopGainersLosers";
import { ProfitabilityDistribution } from "../charts/Stage2Distribution";

import Loader from "./Loader";
import SkeletonGrid from "./SkeletonGrid";
import PortfolioTable from "./PortfolioTable";

export default function Dashboard() {
    const [dataSource, setDataSource] = useState<"yahoo" | "google">("yahoo");
    const { data, loading, error } = usePortfolioData(dataSource);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            <Header dataSource={dataSource} setDataSource={setDataSource} />

            {/* Optional: show a small status bar */}
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                {/* <div className="text-sm text-gray-500">
                    Source: <span className="font-medium text-gray-700">{dataSource}</span>
                </div> */}
                <div className="text-sm text-gray-400">
                    Last updated: <span className="font-medium text-gray-600">{new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Loading state */}
            {loading ? (
                <>
                    <div className="container mx-auto px-4">
                        <Loader message={`Fetching ${dataSource} data — please wait...`} />
                    </div>

                    {/* big skeleton for the full layout */}
                    <div className="container mx-auto px-4">
                        <SkeletonGrid />
                    </div>
                </>
            ) : error ? (
                // Error UI
                <div className="container mx-auto px-4 py-10">
                    <div className="bg-white rounded-xl shadow p-6 text-red-600">
                        Failed to load data. {typeof error === "string" ? error : "Please try again."}
                    </div>
                </div>
            ) : (
                // Real UI when data is ready
                <>
                    {/* summary + charts grid (you already have this) */}
                    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[400px]">
                        <ChartCard title="Sector Allocation">
                            <SectorPieChart data={data} />
                        </ChartCard>

                        <ChartCard title="Sector Gain/Loss">
                            <SectorGainLossBar data={data} />
                        </ChartCard>

                        <ChartCard title="Investment vs Present Value">
                            <InvestmentVsValue data={data} />
                        </ChartCard>

                        <ChartCard title="Top Gainers / Losers">
                            <TopGainersLosers data={data} />
                        </ChartCard>

                        <ChartCard title="Profitability Distribution">
                            <ProfitabilityDistribution data={data} />
                        </ChartCard>
                    </div>

                    {/* Portfolio Table */}
                    <div className="container mx-auto px-4 pb-8">
                        <PortfolioTable data={data} source={dataSource} />
                    </div>
                </>
            )}
        </div>
    );
}
