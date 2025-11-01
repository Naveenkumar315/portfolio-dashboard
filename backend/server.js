import express from "express";
import cors from "cors";
import stockRoutes from "./routes/stocks.js"

const app = express();
app.use(cors("*"));
app.use(express.json());

// Mount routes
app.use("/api/stocks", stockRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
