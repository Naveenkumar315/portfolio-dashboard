import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { Stock } from "../lib/types";

interface ProfitabilityDistributionProps {
    data: Stock[];
}

// Color Scheme
const COLORS = {
    Profit: "#34d399", // green
    Loss: "#f87171",   // red
    Neutral: "#a1a1aa", // gray (optional)
};

// Calculate count of profitable vs loss-making stocks
const getProfitabilityData = (data: Stock[]) => {
    let profit = 0;
    let loss = 0;
    data.forEach((item) => {
        const gainLoss =
            typeof item.gainLoss === "string"
                ? parseFloat(item.gainLoss)
                : item.gainLoss;
        if (gainLoss > 0) profit++;
        else if (gainLoss < 0) loss++;
    });

    return [
        { label: "Profit", value: profit },
        { label: "Loss", value: loss },
    ];
};

// Elegant Tooltip
type SafeTooltipProps = {
    active?: boolean;
    payload?: any[];
};

const CustomTooltip = ({ active, payload }: SafeTooltipProps) => {
    if (active && payload && payload.length) {
        const entry = payload[0]?.payload;
        const color = entry?.label === "Profit" ? COLORS.Profit : COLORS.Loss;
        return (
            <div className="rounded-xl shadow-lg bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-sm border border-gray-200 px-3 py-2 text-gray-800">
                <div className="flex items-center gap-2 mb-1">
                    <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                    ></div>
                    <p className="text-xs text-gray-500 font-medium">{entry?.label}</p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                    {entry?.value} Stocks
                </p>
            </div>
        );
    }
    return null;
};

// Component
export const ProfitabilityDistribution = ({
    data,
}: ProfitabilityDistributionProps) => {
    const chartData = getProfitabilityData(data);

    return (
        <div className="flex flex-col h-full w-full items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 text-center mb-2">
                Profit vs Loss Stocks
            </h2>

            <div className="flex-1 w-full max-h-[260px] md:max-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius="70%"
                            innerRadius="45%"
                            labelLine={false}
                            label={({ name, percent }: any) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {chartData.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={COLORS[entry.label as keyof typeof COLORS]}
                                    stroke="#fff"
                                    strokeWidth={1}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            wrapperStyle={{
                                fontSize: "11px",
                                marginTop: "0px",
                                lineHeight: "14px",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
