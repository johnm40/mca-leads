export default async function handler(req, res) {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const query = req.query.q;

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Missing Google API Key" });
  }

  try {
    // Step 1: Search US businesses
    const searchURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&key=${GOOGLE_API_KEY}&locationbias=ipcountry:US`;

    const results = await fetch(searchURL).then(r => r.json());

    if (!results.results || results.results.length === 0) {
      return res.json({ leads: [] });
    }

    const leads = [];

    for (const biz of results.results.slice(0, 5)) { // top 5
      const placeId = biz.place_id;

      // Step 2: Get business details (phone + website)
      const detailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website&key=${GOOGLE_API_KEY}`;

      const details = await fetch(detailsURL).then(r => r.json());
      const d = details.result || {};

      let email = "N/A";

      // Step 3: Try grabbing an email from website homepage
      if (d.website) {
        try {
          const siteHtml = await fetch(d.website).then(r => r.text());
          const match = siteHtml.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
          );
          if (match) email = match[0];
        } catch (err) {}
      }

      leads.push({
        name: d.name || "Unknown",
        address: d.formatted_address,
        phone: d.formatted_phone_number || "N/A",
        website: d.website || "N/A",
        email,
      });
    }

    return res.json({ leads });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error searching businesses" });
  }
}
