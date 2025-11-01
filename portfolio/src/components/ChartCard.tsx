import type { ReactNode } from "react";


interface ChartCardProps {
    title: string;
    children?: ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
    return (
        <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-all duration-200">
            <h2 className="text-md font-semibold mb-3 text-gray-700">{title}</h2>
            <div className="w-full h-[280px] flex items-center justify-center text-gray-400">
                {children || <p> Chart placeholder</p>}
            </div>
        </div>
    );
}
