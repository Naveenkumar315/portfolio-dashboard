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
    type TooltipProps,
} from "recharts";
import type { Stock } from "../lib/types";

// Define colors for gain vs loss
const COLORS = {
    gain: "#34d399",  // green
    loss: "#f87171",  // red
};

// Group data by stock to find top gainers and losers
// For “Top Gainers / Losers” we might want to take e.g. top 5 gainers and top 5 losers.
const computeGainersLosers = (data: Stock[]) => {
    const enriched = data.map((item) => {
        const gainLoss =
            typeof item.gainLoss === "string"
                ? parseFloat(item.gainLoss)
                : item.gainLoss;
        return {
            name: item.symbol,
            gainLoss,
        };
    });

    // Sort descending for gain, ascending for loss
    const sorted = enriched.sort((a, b) => b.gainLoss - a.gainLoss);

    const topGainers = sorted.slice(0, 5);
    const topLosers = sorted.slice(-5).reverse();

    return [...topGainers, ...topLosers];
};

// Custom Tooltip
type SafeTooltipProps = {
    active?: boolean;
    payload?: any[];
    label?: string;
};

const CustomTooltip = ({
    active,
    payload,
}: SafeTooltipProps) => {
    if (active && payload && payload.length) {
        const entry = payload[0].payload; // 👈 Access full original data
        const value = entry.gainLoss ?? 0;
        const color = value >= 0 ? COLORS.gain : COLORS.loss;
        const label = entry.name ?? "Unknown Stock"; // 👈 Stock name or symbol

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
                    {value >= 0 ? "+" : ""}
                    ₹{value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
            </div>
        );
    }
    return null;
};


interface TopGainersLosersProps {
    data: Stock[];
}

export const TopGainersLosers = ({ data }: TopGainersLosersProps) => {
    const chartData = computeGainersLosers(data);

    return (
        <div className="flex flex-col h-full w-full items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 text-center mb-2">
                Top Gainers / Losers
            </h2>

            <div className="flex-1 w-full max-h-[280px] md:max-h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            interval={0}
                            angle={-10}
                            textAnchor="end"
                        />
                        <YAxis
                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                            tick={{ fontSize: 11 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: "11px", marginTop: "-4px", lineHeight: "12px" }} />
                        <Bar
                            dataKey="gainLoss"
                            name="Gain/Loss"
                            radius={[6, 6, 0, 0]}
                            isAnimationActive={true}
                            animationDuration={800}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.gainLoss >= 0 ? COLORS.gain : COLORS.loss}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
