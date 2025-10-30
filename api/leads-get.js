import axios from "axios";

export default async function handler(req, res) {
  const { query, state } = req.query;

  if (!query || !state) {
    return res.status(400).json({ error: "Missing query or state" });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    const textQuery = `${query} business in ${state}`;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: textQuery,
          key: apiKey,
        },
      }
    );

    const results = response.data.results || [];

    const leads = results.map((biz) => ({
      business: biz.name,
      phone: "N/A", // Google Places phone requires separate request — optional later
      address: biz.formatted_address || "N/A",
      state: state,
      rating: biz.rating || "N/A",
      website: biz.website || "N/A",
    }));

    res.status(200).json(leads);
  } catch (e) {
    console.error("🔥 ERROR:", e.response?.data || e.message);
    res.status(500).json({ error: "Search failed" });
  }
}
