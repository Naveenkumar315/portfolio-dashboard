
function SkeletonBox({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-gray-100 rounded-xl shadow animate-pulse ${className}`} />
    );
}

export default function SkeletonGrid() {
    return (
        <div className="space-y-4 p-4">
            {/* summary skeleton row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SkeletonBox className="h-20" />
                <SkeletonBox className="h-20" />
                <SkeletonBox className="h-20" />
                <SkeletonBox className="h-20" />
            </div>

            {/* chart placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[400px]">
                <SkeletonBox className="h-full" />
                <SkeletonBox className="h-full" />
                <SkeletonBox className="h-full" />
                <SkeletonBox className="h-full" />
                <SkeletonBox className="h-full" />
            </div>

            {/* table placeholder */}
            <div className="bg-white rounded-xl shadow p-4">
                <div className="h-12 w-1/4 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}
