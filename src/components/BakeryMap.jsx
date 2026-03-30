import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix leaflet's default icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

const startIcon = L.divIcon({
  className: '',
  html: `<div class="map-pin map-pin--start">🏃</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

const bakeryIcon = L.divIcon({
  className: '',
  html: `<div class="map-pin map-pin--bakery">🥐</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const bakeryIconActive = L.divIcon({
  className: '',
  html: `<div class="map-pin map-pin--bakery map-pin--active">🥐</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

export default function BakeryMap({ startCoords, bakeries, selected, onSelectBakery, searchDistance }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const startMarkerRef = useRef(null)
  const circleRef = useRef(null)

  // Initialize map
  useEffect(() => {
    if (mapInstanceRef.current) return

    const map = L.map(mapRef.current, { zoomControl: true }).setView([39.5, -98.35], 4)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)
    mapInstanceRef.current = map
  }, [])

  // Update start marker and zoom
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !startCoords) return

    if (startMarkerRef.current) startMarkerRef.current.remove()
    if (circleRef.current) circleRef.current.remove()

    startMarkerRef.current = L.marker([startCoords.lat, startCoords.lng], { icon: startIcon })
      .addTo(map)
      .bindPopup('Start here')

    if (searchDistance) {
      circleRef.current = L.circle([startCoords.lat, startCoords.lng], {
        radius: searchDistance * 1609.34,
        color: '#e07b3c',
        fillColor: '#e07b3c',
        fillOpacity: 0.05,
        weight: 1.5,
        dashArray: '6 4',
      }).addTo(map)
    }

    map.setView([startCoords.lat, startCoords.lng], 13)
  }, [startCoords, searchDistance])

  // Update bakery markers
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Remove old markers
    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}

    bakeries.forEach(bakery => {
      const marker = L.marker([bakery.lat, bakery.lng], {
        icon: selected?.id === bakery.id ? bakeryIconActive : bakeryIcon,
      })
        .addTo(map)
        .bindPopup(`<strong>${bakery.name}</strong>${bakery.address ? `<br>${bakery.address}` : ''}<br>${bakery.distance} mi away`)

      marker.on('click', () => onSelectBakery(bakery))
      markersRef.current[bakery.id] = marker
    })
  }, [bakeries, selected])

  // Pan to selected
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selected) return
    map.panTo([selected.lat, selected.lng])
  }, [selected])

  return (
    <div className="map-wrapper">
      {!startCoords && (
        <div className="map-placeholder">
          <span>🥐</span>
          <p>Enter your starting address to find bakeries near your run</p>
        </div>
      )}
      <div ref={mapRef} className="leaflet-map" />
    </div>
  )
}
