import express from "express";
import cors from "cors";
import leadsRouter from "./routes/leads.js";

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/leads", leadsRouter);

// Default route
app.get("/", (req, res) => {
  res.send("✅ MCA Lead Finder API Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
