import { fetchUCC } from "./ucc.js";
import { fetchSOS } from "./sos.js";
import { fetchIRS } from "./irs.js";
import { fetchLenders } from "./lenders.js";

export async function fetchAllLeads(page = 1, limit = 100) {
  // Placeholder combining multiple sources
  const [ucc, sos, irs, lenders] = await Promise.all([
    fetchUCC(page, limit),
    fetchSOS(page, limit),
    fetchIRS(page, limit),
    fetchLenders(page, limit),
  ]);

  return [...ucc, ...sos, ...irs, ...lenders];
}
