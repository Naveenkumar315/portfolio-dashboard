import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { Stock } from "../lib/types";
import { CustomTooltip } from "../components/CustomTooltip";

interface SectorPieChartProps {
    data: Stock[];
}

const groupBySector = (data: Stock[]) => {
    const result: Record<string, number> = {};
    data.forEach((item) => {
        const investment =
            typeof item.investment === "string"
                ? parseFloat(item.investment)
                : item.investment;
        result[item.sector] = (result[item.sector] || 0) + investment;
    });
    return Object.entries(result).map(([sector, totalInvestment]) => ({
        sector,
        totalInvestment,
    }));
};

// Colors
const COLORS = [
    "#34d399", "#60a5fa", "#f87171", "#fbbf24",
    "#a78bfa", "#fb923c", "#2dd4bf", "#f472b6",
];

export const SectorPieChart = ({ data }: SectorPieChartProps) => {
    const groupedData = groupBySector(data);

    return (
        <div className="flex flex-col h-full w-full items-center justify-between">
            {/* Header */}
            <h2 className="text-base font-semibold text-gray-800 text-center mb-1">
                Sector Allocation
            </h2>

            {/* Chart container (fills available card height gracefully) */}
            <div className="flex-1 w-full max-h-[280px] md:max-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <Pie
                            data={groupedData}
                            dataKey="totalInvestment"
                            nameKey="sector"
                            cx="50%"
                            cy="45%"
                            outerRadius="100%"
                            innerRadius="50%"
                            labelLine={false}
                        // label={(props: PieLabelRenderProps) => {
                        //     const percent = Number(props.percent ?? 0);
                        //     raeturn `${props.name ?? ""}: ${(percent * 100).toFixed(0)}%`;
                        // }}
                        >
                            {groupedData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
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







