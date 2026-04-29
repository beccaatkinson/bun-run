export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set" });

  const { messages, startLocation, milesMin, milesMax } = req.body;

  async function callAnthropic(msgs) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 3500, messages: msgs }),
    });
    return r.json();
  }

  function parseRecs(data) {
    const text = data.content?.map(b => b.type === "text" ? b.text : "").join("") ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try { return JSON.parse(match[0]).recommendations; } catch { return null; }
  }

  async function geocode(location) {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
        { headers: { "User-Agent": "PastryPace/1.0" } }
      );
      const d = await r.json();
      if (d.length) return { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) };
    } catch {}
    return null;
  }

  async function getActualMiles(coords) {
    try {
      const coordStr = coords.map(c => `${c.lng},${c.lat}`).join(";");
      const r = await fetch(
        `https://router.project-osrm.org/route/v1/foot/${coordStr}?overview=false`,
        { headers: { "User-Agent": "PastryPace/1.0" } }
      );
      const d = await r.json();
      if (d.routes?.[0]?.distance) {
        return Math.round((d.routes[0].distance / 1609.34) * 10) / 10;
      }
    } catch {}
    return null;
  }

  async function validateRecs(recs, startCoords) {
    for (const rec of recs) {
      const wpCoords = (rec.waypoints ?? [])
        .filter(wp => wp.lat && wp.lng)
        .map(wp => ({ lat: wp.lat, lng: wp.lng }));
      const allCoords = [startCoords, ...wpCoords, { lat: rec.lat, lng: rec.lng }];
      if (allCoords.length >= 2) {
        rec.actualMiles = await getActualMiles(allCoords);
      }
    }
    return recs;
  }

  try {
    const startCoords = await geocode(startLocation);

    const data = await callAnthropic(messages);
    let recs = parseRecs(data);
    if (!recs) return res.status(500).json({ error: "Failed to parse recommendations" });

    if (startCoords) {
      recs = await validateRecs(recs, startCoords);

      const offRecs = recs.filter(r =>
        r.actualMiles != null &&
        (r.actualMiles < milesMin - 0.4 || r.actualMiles > milesMax + 0.4)
      );

      if (offRecs.length > 0) {
        const corrections = offRecs
          .map(r => `"${r.bakeryName}": route verified at ${r.actualMiles} miles, must be ${milesMin}–${milesMax} miles`)
          .join("; ");

        const retryMessages = [
          ...messages,
          { role: "assistant", content: data.content.map(b => b.type === "text" ? b.text : "").join("") },
          {
            role: "user",
            content: `Distance verification failed for: ${corrections}. Adjust only those bakeries — move them closer or farther and update waypoints so the actual walking distance is within ${milesMin}–${milesMax} miles. Keep the other recommendations unchanged. Return all 3 as valid JSON.`,
          },
        ];

        const retryData = await callAnthropic(retryMessages);
        const retryRecs = parseRecs(retryData);
        if (retryRecs) {
          recs = await validateRecs(retryRecs, startCoords);
        }
      }
    }

    res.json({ recommendations: recs });
  } catch (err) {
    res.status(502).json({ error: "Failed to generate recommendations" });
  }
}
