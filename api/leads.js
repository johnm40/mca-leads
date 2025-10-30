import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const q = req.query.q || "business";
    const key = process.env.GOOGLE_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q + " small business")}&key=${key}`;

    const places = await (await fetch(url)).json();

    const leads = [];

    for (const p of places.results) {
      const detailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=name,formatted_address,formatted_phone_number,website&key=${key}`;
      const det = await (await fetch(detailsURL)).json();

      leads.push({
        name: det.result?.name,
        address: det.result?.formatted_address,
        phone: det.result?.formatted_phone_number || null,
        email: det.result?.website ? `info@${new URL(det.result.website).hostname}` : null
      });
    }

    res.json({ leads });

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
