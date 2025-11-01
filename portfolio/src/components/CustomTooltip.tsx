


type SafeTooltipProps = {
    active?: boolean;
    payload?: { value?: number; name?: string; color?: string }[];
    label?: string;
};

export const CustomTooltip = ({
    active,
    payload,
}: SafeTooltipProps) => {
    if (active && payload && payload.length) {
        const name = payload?.[0]?.name ?? "Unknown Sector";
        const value = payload?.[0]?.value?.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
        });
        const color = payload?.[0]?.color || "#10b981"; // sector color dot

        return (
            <div className="rounded-xl shadow-lg bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-sm border border-gray-200 px-2 py-2 text-gray-800">
                <div className="flex items-center gap-2 mb-1">
                    <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                    ></div>
                    <p className="text-xs text-gray-500 font-medium">{name}</p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                    ₹{value}
                </p>
            </div>
        );
    }
    return null;
};