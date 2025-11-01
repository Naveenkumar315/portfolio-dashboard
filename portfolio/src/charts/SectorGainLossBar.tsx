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

// green / red
const COLORS = {
    gain: "#34d399", // green
    loss: "#f87171", // red
};

//  Group data by sector and calculate total gain/loss
const groupBySectorGainLoss = (data: Stock[]) => {
    const result: Record<string, number> = {};
    data.forEach((item) => {
        const gainLoss =
            typeof item.gainLoss === "string"
                ? parseFloat(item.gainLoss)
                : item.gainLoss;
        result[item.sector] = (result[item.sector] || 0) + gainLoss;
    });

    return Object.entries(result).map(([sector, totalGainLoss]) => ({
        sector,
        totalGainLoss,
    }));
};

// Custom Tooltip 
type SafeTooltipProps = {
    active?: boolean;
    payload?: { value?: number; name?: string; color?: string }[];
    label?: string;
};

const CustomTooltip = ({
    active,
    payload,
    label,
}: SafeTooltipProps) => {
    if (active && payload && payload.length) {
        const value = payload?.[0]?.value ?? 0;
        const color = value >= 0 ? COLORS.gain : COLORS.loss;

        return (
            <div className="rounded-xl shadow-lg bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-sm border border-gray-200 px-3 py-2 text-gray-800">
                <div className="flex items-center gap-2 mb-1">
                    <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                    ></div>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                </div>
                <p
                    className={`text-base font-semibold ${value >= 0 ? "text-emerald-500" : "text-rose-500"
                        }`}
                >
                    ₹{value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
            </div>
        );
    }
    return null;
};

interface SectorGainLossBarProps {
    data: Stock[];
}

export const SectorGainLossBar = ({ data }: SectorGainLossBarProps) => {
    const groupedData = groupBySectorGainLoss(data);

    return (
        <div className="flex flex-col h-full w-full items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 text-center mb-2">
                Sector Gain / Loss
            </h2>

            <div className="flex-1 w-full max-h-[280px] md:max-h-[330px]">
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
                            tickFormatter={(value) =>
                                `₹${value / 1000}k`
                            }
                            tick={{ fontSize: 11 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />

                        <Bar
                            dataKey="totalGainLoss"
                            radius={[6, 6, 0, 0]}
                            isAnimationActive={true}
                            animationDuration={900}
                        >
                            {groupedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.totalGainLoss >= 0 ? COLORS.gain : COLORS.loss}
                                />
                            ))}
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
