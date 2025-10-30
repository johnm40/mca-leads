export default async function handler(req, res) {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const { term } = req.query;

  if (!GOOGLE_API_KEY) {
    console.error("Missing GOOGLE_API_KEY");
    return res.status(500).json({ error: "Server missing API key" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      term
    )}&key=${GOOGLE_API_KEY}`;

    console.log("Fetching:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (data.error_message) {
      console.error("Google Error:", data.error_message);
      return res.status(400).json({ error: data.error_message });
    }

    const leads = data.results.map(b => ({
      name: b.name,
      address: b.formatted_address ?? "",
      business_status: b.business_status ?? "UNKNOWN",
      url: `https://www.google.com/maps/place/?q=place_id:${b.place_id}`
    }));

    res.status(200).json({ leads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
