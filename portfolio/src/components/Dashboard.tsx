import { useEffect, useState } from "react";
import Header from "./Header";
import ChartCard from "./ChartCard";
import usePortfolioData from "../hooks/usePortfolioData";
import { SectorPieChart } from "../charts/SectorPieChart";
import { SectorGainLossBar } from "../charts/SectorGainLossBar";
import { InvestmentVsValue } from "../charts/InvestmentVsValue";
import { TopGainersLosers } from "../charts/TopGainersLosers";
import { ProfitabilityDistribution } from "../charts/Stage2Distribution";

import type { Stock } from "../lib/types";
import PortfolioTable from "./PortfolioTable";

export function getPortfolioSummary(data: Stock[]) {
    const totals = data.reduce(
        (acc, stock) => {
            const inv = parseFloat(stock.investment) || 0;
            const value = parseFloat(stock.presentValue) || 0;
            const gain = parseFloat(stock.gainLoss) || 0;

            acc.totalInvestment += inv;
            acc.totalCurrentValue += value;
            acc.totalGainLoss += gain;

            return acc;
        },
        { totalInvestment: 0, totalCurrentValue: 0, totalGainLoss: 0 }
    );

    const totalGainLossPercent = totals.totalInvestment
        ? ((totals.totalGainLoss / totals.totalInvestment) * 100).toFixed(2)
        : "0.00";

    return {
        totalInvestment: totals.totalInvestment,
        totalCurrentValue: totals.totalCurrentValue,
        totalGainLoss: totals.totalGainLoss,
        totalGainLossPercent,
    };
}


export default function Dashboard() {
    const [dataSource, setDataSource] = useState<"yahoo" | "google">("yahoo");
    const { data } = usePortfolioData(dataSource);

    interface SummaryCardProps {
        title: string;
        value: string | number;
        color?: string;
    }



    const SummaryCard = ({ title, value, color = "text-gray-800" }: SummaryCardProps) => (
        <div className="bg-white shadow rounded-xl p-4 text-center hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className={`text-xl font-bold ${color} mt-1`}>
                {typeof value === "number" ? value.toLocaleString("en-IN") : value}
            </p>
        </div>
    );

    const summary = getPortfolioSummary(data);

    // Helper function to format Indian currency
    const formatIndianCurrency = (value: number): string => {
        return value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Helper function to format percentage
    const formatPercentage = (value: string): string => {
        return value;
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            {/* Header */}
            <Header dataSource={dataSource} setDataSource={setDataSource} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                <SummaryCard
                    title="Total Investment"
                    value={`₹${formatIndianCurrency(summary.totalInvestment)}`}
                />
                <SummaryCard
                    title="Current Value"
                    value={`₹${formatIndianCurrency(summary.totalCurrentValue)}`}
                />
                <SummaryCard
                    title="Total Gain / Loss"
                    value={`₹${formatIndianCurrency(summary.totalGainLoss)}`}
                    color={summary.totalGainLoss >= 0 ? "text-emerald-600" : "text-rose-600"}
                />
                <SummaryCard
                    title="Gain / Loss %"
                    value={`${summary.totalGainLoss >= 0 ? '+' : ''}${formatPercentage(summary.totalGainLossPercent)}%`}
                    color={summary.totalGainLoss >= 0 ? "text-emerald-600" : "text-rose-600"}
                />
            </div>


            {/* Charts Grid */}
            <div className="flex-1 container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[400px]">
                <ChartCard title="">
                    <SectorPieChart data={data} />
                </ChartCard>

                <ChartCard title="">
                    <SectorGainLossBar data={data} />
                </ChartCard>

                <ChartCard title="">
                    <InvestmentVsValue data={data} />
                </ChartCard>

                <ChartCard title="">
                    <TopGainersLosers data={data} />
                </ChartCard>

                <ChartCard title="">
                    <ProfitabilityDistribution data={data} />
                </ChartCard>

            </div>

            {/* Portfolio Table (Coming later) */}
            <div className="container mx-auto px-4 pb-8">
                <PortfolioTable data={data} source={dataSource} />
            </div>
        </div>
    );
}
