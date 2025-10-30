// /api/leads.js
export default async function handler(req, res) {
  const query = req.query.q || "business";
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing Google API key" });
  }

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + " business")}&location=40.7128,-74.0060&radius=50000&key=${apiKey}`;

  try {
    const googleRes = await fetch(url);
    const data = await googleRes.json();

    if (!data.results) {
      throw new Error(JSON.stringify(data));
    }

    const leads = data.results.slice(0, 10).map(place => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      reviews: place.user_ratings_total
    }));

    res.status(200).json({ leads });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Google API failed" });
  }
}
