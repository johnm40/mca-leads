export default async function handler(req, res) {
  try {
    const q = req.query.q || "contractor";
    const key = process.env.GOOGLE_API_KEY;

    if (!key) {
      return res.status(500).json({ error: "Missing Google API key" });
    }

    // NYC default – can later let user select zip/state
    const location = "40.7128,-74.0060"; 
    const radius = "30000"; // 30km search radius

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      q + " business"
    )}&location=${location}&radius=${radius}&key=${key}`;

    const resp = await fetch(url);
    const data = await resp.json();

    if (!data.results) {
      return res.json([]);
    }

    // Return only useful business lead fields
    const leads = data.results.map((b) => ({
      name: b.name,
      address: b.formatted_address,
      location: b.geometry?.location,
      rating: b.rating,
      reviews: b.user_ratings_total,
      place_id: b.place_id
    }));

    res.status(200).json({ leads });
  } catch (err) {
    console.error(err);
    res.
