interface HeaderProps {
    dataSource: "yahoo" | "google";
    setDataSource: (v: "yahoo" | "google") => void;
}

export default function Header({ dataSource, setDataSource }: HeaderProps) {
    return (
        <header className="bg-white shadow p-4 flex items-center justify-between sticky top-0 z-50">
            <h1 className="text-xl font-bold text-gray-800">Dynamic Portfolio Dashboard</h1>

            <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">Source:</span>

                <button
                    onClick={() =>
                        setDataSource(dataSource === "yahoo" ? "google" : "yahoo")
                    }
                    className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors ${dataSource === "yahoo"
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                        }`}
                >
                    {dataSource === "yahoo" ? "Yahoo Finance" : "Google Finance"}
                </button>
            </div>
        </header>
    );
}
