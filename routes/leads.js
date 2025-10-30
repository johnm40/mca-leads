import express from "express";
import { fetchAllLeads } from "../services/scrapers/index.js";
import { saveToCSV, readCSV, deleteCSV } from "../services/csv.js";

const router = express.Router();

// GET leads with pagination
router.get("/", async (req, res) => {
  const { page = 1, limit = 100 } = req.query;
  const leads = await fetchAllLeads(page, limit);
  res.json(leads);
});

// Export to CSV
router.post("/export", async (req, res) => {
  const file = await saveToCSV(req.body);
  res.download(file);
});

// View saved CSVs
router.get("/csv", async (req, res) => {
  const files = await readCSV();
  res.json(files);
});

// Delete a CSV
router.delete("/csv/:filename", async (req, res) => {
  await deleteCSV(req.params.filename);
  res.send("Deleted");
});

export default router;
