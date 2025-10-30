import axios from "axios";

export default async function handler(req, res) {
  const { query, state } = req.query;

  if (!query || !state) {
    return res.status(400).json({ error: "Missing query or state" });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchQuery = `${query} business in ${state}`;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: { query: searchQuery, key: apiKey },
      }
    );

    const leads = response.data.results.map(biz => ({
      business: biz.name,
      phone: "N/A",
      address: biz.formatted_address || "N/A",
      state,
      rating: biz.rating || "N/A",
      website: biz.website || "N/A",
    }));

    res.status(200).json(leads);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Google API request failed" });
  }
}
