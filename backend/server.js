import express from "express";
import cors from "cors";
import stockRoutes from "./routes/stocks.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/stocks", stockRoutes);

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});


// Start only when running locally
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
}

export default app;
