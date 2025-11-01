import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Stock } from "../lib/types";

interface PortfolioTableProps {
    data: Stock[];
    source: "yahoo" | "google";
}

export default function PortfolioTable({ data, source }: PortfolioTableProps) {
    const columns: GridColDef<Stock>[] = [
        { field: "name", headerName: "Company", flex: 1.5, minWidth: 180 },
        { field: "symbol", headerName: "Symbol", flex: 1, minWidth: 120 },
        { field: "sector", headerName: "Sector", flex: 1, minWidth: 140 },
        {
            field: "cmp",
            headerName: "CMP (₹)",
            flex: 0.7,
            minWidth: 110,
            headerAlign: "right",
            align: "right",
            valueFormatter: (value: number) =>
                Number(value ?? 0).toLocaleString("en-IN"),
        },
        {
            field: "investment",
            headerName: "Investment (₹)",
            flex: 0.8,
            minWidth: 120,
            headerAlign: "right",
            align: "right",
            valueFormatter: (value: number) =>
                Number(value ?? 0).toLocaleString("en-IN"),
        },
        {
            field: "presentValue",
            headerName: "Present Value (₹)",
            flex: 0.8,
            minWidth: 120,
            headerAlign: "right",
            align: "right",
            valueFormatter: (value: number) =>
                Number(value ?? 0).toLocaleString("en-IN"),
        },
        {
            field: "gainLoss",
            headerName: "Gain / Loss (₹)",
            flex: 0.8,
            minWidth: 120,
            headerAlign: "right",
            align: "right",
            cellClassName: (params) =>
                Number(params.value ?? 0) >= 0 ? "text-green-600" : "text-red-600",
            valueFormatter: (value: number) =>
                Number(value ?? 0).toLocaleString("en-IN"),
        },
        {
            field: "gainLossPercent",
            headerName: "Gain / Loss %",
            flex: 0.6,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
            cellClassName: (params) =>
                Number(params.value ?? 0) >= 0 ? "text-green-600" : "text-red-600",
            valueFormatter: (value: number) =>
                `${Number(value ?? 0).toFixed(2)}%`,
        },
        {
            field: "stage2",
            headerName: "Stage",
            flex: 0.4,
            minWidth: 80,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const value = params.value?.toString().toLowerCase();
                const color =
                    value === "yes"
                        ? "bg-green-100 text-green-700"
                        : value === "no"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600";
                return (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}
                    >
                        {params.value ?? "-"}
                    </span>
                );
            },
        },
    ];

    // ✅ Assign unique IDs for DataGrid
    const rows = data.map((stock, index) => ({
        id: index + 1,
        ...stock,
    }));

    return (
        <div className="bg-white rounded-xl shadow p-4 mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                (
                {source === "yahoo" ? "Yahoo Finance" : "Google Finance"})
            </h2>

            <div style={{ height: 350, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    getRowHeight={() => "auto"}
                    sx={{
                        border: "1px solid #e0e0e0",
                        "& .MuiDataGrid-main": {
                            border: "none",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#1976d2",
                            color: "#ffffff",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            borderBottom: "2px solid #1565c0",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: "#1976d2",
                            color: "#ffffff",
                            "&:focus": {
                                outline: "none",
                            },
                            "&:focus-within": {
                                outline: "none",
                            },
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                        },
                        "& .MuiDataGrid-iconSeparator": {
                            color: "rgba(255, 255, 255, 0.5)",
                        },
                        "& .MuiDataGrid-sortIcon": {
                            color: "#ffffff",
                            opacity: 1,
                        },
                        "& .MuiDataGrid-menuIcon": {
                            color: "#ffffff",
                        },
                        "& .MuiDataGrid-menuIconButton": {
                            color: "#ffffff",
                        },
                        "& .MuiDataGrid-columnHeader--sortable:hover": {
                            backgroundColor: "#1565c0",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "1px solid #e0e0e0",
                            fontSize: "0.9rem",
                            padding: "12px 16px",
                        },
                        "& .MuiDataGrid-row": {
                            "&:nth-of-type(even)": {
                                backgroundColor: "#fafafa",
                            },
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                            },
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "2px solid #e0e0e0",
                            backgroundColor: "#fafafa",
                        },
                        "& .MuiTablePagination-root": {
                            color: "#333",
                        },
                    }}
                />
            </div>
        </div>
    );
}