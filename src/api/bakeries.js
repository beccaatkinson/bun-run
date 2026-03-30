// Distance in miles → meters
function milesToMeters(miles) {
  return miles * 1609.34
}

export async function searchBakeries({ lat, lng }, distanceMiles) {
  const radiusMeters = milesToMeters(distanceMiles)

  const query = `
    [out:json][timeout:25];
    (
      node["shop"="bakery"](around:${radiusMeters},${lat},${lng});
      node["amenity"="cafe"]["cuisine"="cake"](around:${radiusMeters},${lat},${lng});
      node["amenity"="cafe"]["name"~"bakery|boulangerie|patisserie|pastry",i](around:${radiusMeters},${lat},${lng});
    );
    out body;
  `

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  })
  const data = await res.json()

  return data.elements
    .filter(el => el.lat && el.lon)
    .map(el => ({
      id: el.id,
      name: el.tags?.name || 'Unnamed Bakery',
      lat: el.lat,
      lng: el.lon,
      address: formatAddress(el.tags),
      website: el.tags?.website || el.tags?.['contact:website'] || null,
      phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
      hours: el.tags?.opening_hours || null,
      distance: haversineDistance({ lat, lng }, { lat: el.lat, lng: el.lon }),
    }))
    .sort((a, b) => a.distance - b.distance)
}

function formatAddress(tags = {}) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:city'],
    tags['addr:state'],
  ].filter(Boolean)
  return parts.length ? parts.join(' ') : null
}

// Returns distance in miles
function haversineDistance(a, b) {
  const R = 3958.8 // Earth radius in miles
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const c =
    2 *
    Math.asin(
      Math.sqrt(
        sinDLat * sinDLat +
          Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng
      )
    )
  return Math.round(c * 10) / 10
}

function toRad(deg) {
  return (deg * Math.PI) / 180
}
