// db/migrate.js
import sqlite3 from "sqlite3";
import fs from "fs";

const DB_PATH = "db/leads.db";
const SCHEMA_PATH = "db/schema.sql";

if (!fs.existsSync(SCHEMA_PATH)) {
  console.error("❌ Missing schema.sql");
  process.exit(1);
}

const db = new sqlite3.Database(DB_PATH);

const schema = fs.readFileSync(SCHEMA_PATH, "utf8");

db.exec(schema, (err) => {
  if (err) {
    console.error("❌ Migration failed:", err);
  } else {
    console.log("✅ Database migration completed!");
  }
  db.close();
});
