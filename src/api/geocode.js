export async function geocodeAddress(address) {
  const encoded = encodeURIComponent(address)
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`

  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'PastryPace/1.0' },
  })
  const data = await res.json()

  if (!data.length) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}
