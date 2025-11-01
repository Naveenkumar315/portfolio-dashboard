import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from "recharts";

import type { Stock } from "../lib/types";

// Color constants
const COLORS = {
    investment: "#60a5fa", // blue
    present: "#34d399", // green
};

// Group data by sector
const groupBySectorInvestmentVsValue = (data: Stock[]) => {
    const result: Record<
        string,
        { investment: number; presentValue: number }
    > = {};

    data.forEach((item) => {
        const investment =
            typeof item.investment === "string"
                ? parseFloat(item.investment)
                : item.investment;
        const presentValue =
            typeof item.presentValue === "string"
                ? parseFloat(item.presentValue)
                : item.presentValue;

        if (!result[item.sector]) {
            result[item.sector] = { investment: 0, presentValue: 0 };
        }
        result[item.sector].investment += investment;
        result[item.sector].presentValue += presentValue;
    });

    return Object.entries(result).map(([sector, values]) => ({
        sector,
        ...values,
    }));
};

// Custom Tooltip
type SafeTooltipProps = {
    active?: boolean;
    payload?: { name?: string; value?: number; color?: string }[];
    label?: string;
};

const CustomTooltip = ({ active, payload, label }: SafeTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl shadow-lg bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-sm border border-gray-200 px-3 py-2 text-gray-800">
                <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: p.color }}
                        ></div>
                        <p className="text-sm font-medium text-gray-700">
                            {p.name}:{" "}
                            <span className="font-semibold text-gray-900">
                                ₹{p.value?.toLocaleString("en-IN", {
                                    maximumFractionDigits: 0,
                                })}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

interface InvestmentVsValueProps {
    data: Stock[];
}

export const InvestmentVsValue = ({ data }: InvestmentVsValueProps) => {
    const groupedData = groupBySectorInvestmentVsValue(data);

    return (
        <div className="flex flex-col h-full w-full items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 text-center mb-2">
                Investment vs Present Value
            </h2>

            <div className="flex-1 w-full max-h-[280px] md:max-h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={groupedData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="sector"
                            tick={{ fontSize: 11 }}
                            interval={0}
                            angle={-10}
                            textAnchor="end"
                        />
                        <YAxis
                            tickFormatter={(value) => `₹${value / 1000}k`}
                            tick={{ fontSize: 11 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />

                        <Bar
                            dataKey="investment"
                            fill={COLORS.investment}
                            radius={[6, 6, 0, 0]}
                            name="Investment"
                        />
                        <Bar
                            dataKey="presentValue"
                            fill={COLORS.present}
                            radius={[6, 6, 0, 0]}
                            name="Present Value"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
