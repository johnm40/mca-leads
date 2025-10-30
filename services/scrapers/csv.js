import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";

const csvDir = "./exports";
if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir);

export async function saveToCSV(data) {
  const filename = `${csvDir}/leads_${Date.now()}.csv`;
  const writer = createObjectCsvWriter({
    path: filename,
    header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
  });
  await writer.writeRecords(data);
  return filename;
}

export async function readCSV() {
  return fs.readdirSync(csvDir);
}

export async function deleteCSV(filename) {
  const filePath = path.join(csvDir, filename);
  fs.unlinkSync(filePath);
}
