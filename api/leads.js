import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { keyword, state, minRev, maxRev, filedAfter, sortOrder } = req.query;
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  try {
    // Google Search for US only
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${keyword}+business+in+${state}+USA&type=company&key=${GOOGLE_API_KEY}`;
    let googleRes = await fetch(url);
    let places = await googleRes.json();

    if (!places.results) return res.json([]);

    // process results
    let results = [];

    for (let p of places.results.slice(0, 8)) {
      // phone + website lookup
      let detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=name,formatted_address,formatted_phone_number,website&key=${GOOGLE_API_KEY}`;
      let detRes = await fetch(detailsUrl);
      let det = await detRes.json();

      let name = det.result?.name;
      let address = det.result?.formatted_address;
      let phone = det.result?.formatted_phone_number || "N/A";
      let website = det.result?.website || "";
      let email = "";

      // extract email from website if exists
      if (website) {
        try {
          let siteRes = await fetch(website, { timeout: 5000 });
          let text = await siteRes.text();
          let emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (emailMatch) email = emailMatch[0];
        } catch {}
      }

      // get owner + filing date
      let owner = "N/A", filedDate = "N/A";
      try {
        let ocRes = await fetch(`https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(name)}&order=score`);
        let oc = await ocRes.json();
        if (oc?.results?.companies?.length) {
          owner = oc.results.companies[0].company?.officers?.[0]?.name || "N/A";
          filedDate = oc.results.companies[0].company?.incorporation_date || "N/A";
        }
      } catch {}

      // revenue estimate
      let revenue = await estimateRevenue(keyword, website);

      // filing filter
      if (filedDate && filedAfter && filedDate < filedAfter) continue;

      // revenue range filter
      if (revenue < minRev || revenue > maxRev) continue;

      results.push({
        name,
        address,
        phone,
        website,
        email,
        owner,
        filedDate,
        revenue
      });
    }

    // sort
    results.sort((a, b) => sortOrder === "asc" ? a.revenue - b.revenue : b.revenue - a.revenue);

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.json([]);
  }
}

// ★ Hybrid Revenue Estimator
async function estimateRevenue(keyword, website) {
  const industryRanges = {
    contractor: [500000, 5000000],
    dentist: [300000, 2000000],
    restaurant: [250000, 3000000],
    trucking: [300000, 7000000],
    salon: [100000, 800000],
    retail: [200000, 2000000],
    auto: [300000, 4000000],
    doctor: [400000, 5000000],
    lawyer: [350000, 3000000]
  };

  let range = industryRanges[keyword?.toLowerCase()] || [200000, 3000000];
  let revenue = avg(range);

  // website scanning boost
  if (website) {
    try {
      const res = await fetch(website, { timeout: 5000 });
      const text = await res.text();

      if (/employees|team|staff|careers/i.test(text)) revenue *= 1.5;
      if (/franchise|locations/i.test(text)) revenue *= 2;
      if (/award|top|certified/i.test(text)) revenue *= 1.3;
    } catch {}
  }

  return Math.round(revenue);
}

function avg([min, max]) { return (min + max) / 2; }
