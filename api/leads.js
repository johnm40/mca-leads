export default async function handler(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing GOOGLE_API_KEY");
      return res.status(500).json({ error: "Server API key missing" });
    }

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query + " business"
    )}&type=business&radius=50000&key=${apiKey}`;

    console.log("🔎 Fetching:", url);

    const response = await fetch(url);
    const data = await response.json();

    console.log("📡 Google Response:", data);

    if (data.status !== "OK" && data.results?.length === 0) {
      return res.status(200).json({ leads: [], error: data.status });
    }

    const leads = data.results.map((place) => ({
      name: place.name || "Unknown",
      address: place.formatted_address || "N/A",
      rating: place.rating || "N/A",
      type: place.types?.[0] || "business"
    }));

    res.status(200).json({ leads });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: "Server error fetching leads" });
  }
}
