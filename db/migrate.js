import { openDb } from "./connection.js";

(async () => {
  const db = await openDb();
  await db.exec(`
    ALTER TABLE leads ADD COLUMN filing_source TEXT;
    ALTER TABLE leads ADD COLUMN entity_type TEXT;
    ALTER TABLE leads ADD COLUMN agent_name TEXT;
    ALTER TABLE leads ADD COLUMN entity_status TEXT;
    ALTER TABLE leads ADD COLUMN confidence_owner INTEGER DEFAULT 0;
    ALTER TABLE leads ADD COLUMN enriched_ts TEXT;
  `);
  console.log("DB migration complete ✅");
})();
