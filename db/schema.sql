CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_name TEXT,
  owner_name TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  revenue_estimate TEXT,
  filing_date TEXT,
  source TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
