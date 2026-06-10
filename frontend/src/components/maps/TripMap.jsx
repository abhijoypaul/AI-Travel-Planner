import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve(window.google.maps)
    const existing = document.getElementById('google-maps-script')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps))
      return
    }
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google.maps)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const TYPE_COLORS = {
  attraction: '#2563eb',
  restaurant: '#f59e0b',
  hotel: '#8b5cf6',
  other: '#64748b',
}

export function TripMap({ trip, selectedLocation, onLocationSelect, className = '' }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const infoWindowRef = useRef(null)
  const polylineRef = useRef(null)
  const [mapError, setMapError] = useState(false)
  const [loading, setLoading] = useState(true)

  const getAllLocations = useCallback(() => {
    const locations = []
    for (const day of trip?.itinerary || []) {
      for (const loc of [...(day.attractions || []), ...(day.restaurants || []), ...(day.hotels || [])]) {
        if (loc.lat && loc.lng) {
          locations.push({ ...loc, dayNumber: day.day })
        }
      }
    }
    for (const loc of [
      ...(trip?.recommendedAttractions || []),
      ...(trip?.recommendedRestaurants || []),
      ...(trip?.recommendedHotels || []),
    ]) {
      if (loc.lat && loc.lng && !locations.some((l) => l.name === loc.name)) {
        locations.push(loc)
      }
    }
    return locations
  }, [trip])

  // Build the map once when trip changes
  useEffect(() => {
    window.gm_authFailure = () => {
      setMapError(true)
      setLoading(false)
    }

    if (!MAPS_KEY) {
      setMapError(true)
      setLoading(false)
      return
    }

    let cancelled = false

    const initMap = async () => {
      try {
        const maps = await loadGoogleMaps()
        if (cancelled || !mapRef.current) return

        const center = trip?.coordinates || { lat: 48.8566, lng: 2.3522 }
        const locations = getAllLocations()

        mapInstance.current = new maps.Map(mapRef.current, {
          center: { lat: center.lat, lng: center.lng },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          styles: [
            { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          ],
        })

        // Shared InfoWindow
        infoWindowRef.current = new maps.InfoWindow()

        markersRef.current.forEach((m) => m.setMap(null))
        markersRef.current = []

        const bounds = new maps.LatLngBounds()
        bounds.extend({ lat: center.lat, lng: center.lng })

        locations.forEach((loc, index) => {
          const position = { lat: loc.lat, lng: loc.lng }
          bounds.extend(position)
          const color = TYPE_COLORS[loc.type] || TYPE_COLORS.attraction

          const marker = new maps.Marker({
            position,
            map: mapInstance.current,
            title: loc.name,
            label: { text: String(index + 1), color: 'white', fontSize: '11px', fontWeight: 'bold' },
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: 14,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            },
            animation: maps.Animation.DROP,
          })

          // Store location data on marker for later use
          marker._locData = loc
          marker._defaultColor = color

          marker.addListener('click', () => {
            openInfoWindow(maps, marker, loc)
            onLocationSelect?.(loc)
          })

          markersRef.current.push(marker)
        })

        if (locations.length > 0) {
          mapInstance.current.fitBounds(bounds, { padding: 50 })
        }

        if (trip?.routePolyline && maps.geometry?.encoding) {
          if (polylineRef.current) polylineRef.current.setMap(null)
          const path = maps.geometry.encoding.decodePath(trip.routePolyline)
          polylineRef.current = new maps.Polyline({
            path,
            geodesic: true,
            strokeColor: '#4f46e5',
            strokeOpacity: 0.9,
            strokeWeight: 4,
            map: mapInstance.current,
          })
        }

        setLoading(false)
      } catch {
        setMapError(true)
        setLoading(false)
      }
    }

    initMap()
    return () => { cancelled = true }
  }, [trip])

  const openInfoWindow = (maps, marker, loc) => {
    const content = `
      <div style="padding:10px;max-width:220px;font-family:system-ui,sans-serif">
        <strong style="font-size:14px">${loc.name}</strong>
        ${loc.address ? `<p style="font-size:12px;color:#64748b;margin:4px 0 0">${loc.address}</p>` : ''}
        ${loc.rating ? `<p style="font-size:12px;margin:4px 0 0">⭐ ${loc.rating}</p>` : ''}
        ${loc.estimatedCost ? `<p style="font-size:12px;color:#059669;margin:4px 0 0">~$${loc.estimatedCost}</p>` : ''}
        ${loc.type ? `<span style="display:inline-block;margin-top:6px;padding:2px 8px;border-radius:9999px;font-size:11px;background:${TYPE_COLORS[loc.type] || '#64748b'}22;color:${TYPE_COLORS[loc.type] || '#64748b'};font-weight:600;text-transform:capitalize">${loc.type}</span>` : ''}
      </div>`
    infoWindowRef.current.setContent(content)
    infoWindowRef.current.open(mapInstance.current, marker)
  }

  // React to selectedLocation changes from outside (e.g. clicking in the itinerary)
  useEffect(() => {
    if (!selectedLocation?.lat || !mapInstance.current || !window.google) return

    const maps = window.google.maps

    // Reset all markers to default style
    markersRef.current.forEach((m) => {
      m.setIcon({
        path: maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: m._defaultColor,
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      })
      m.setZIndex(1)
    })

    // Find and highlight the matching marker
    const match = markersRef.current.find(
      (m) => m._locData?.name === selectedLocation.name
    )

    if (match) {
      // Enlarge the selected marker
      match.setIcon({
        path: maps.SymbolPath.CIRCLE,
        scale: 20,
        fillColor: match._defaultColor,
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 3,
      })
      match.setZIndex(999)
      match.setAnimation(maps.Animation.BOUNCE)
      setTimeout(() => match.setAnimation(null), 700)

      openInfoWindow(maps, match, match._locData)
    }

    mapInstance.current.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng })
    mapInstance.current.setZoom(16)
  }, [selectedLocation])

  // Fallback when no API key or map error
  if (mapError || !MAPS_KEY) {
    const locations = getAllLocations()
    const errorMessage = !MAPS_KEY 
      ? "Add VITE_GOOGLE_MAPS_API_KEY to enable interactive maps"
      : "Google Maps authentication failed. Please verify that your billing account is active, all required APIs (Maps JS, Places, Directions, Geocoding) are enabled, and there are no restrictive credentials constraints in the Google Cloud Console.";

    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 ${className}`}
        style={{ minHeight: 400 }}
      >
        <MapPin className="h-12 w-12 text-slate-400 mb-3" />
        <p className="font-medium text-slate-300">Map Preview</p>
        <p className="text-sm text-red-400 mt-1 px-6 text-center leading-relaxed">
          {errorMessage}
        </p>
        <div className="mt-4 grid gap-2 w-full max-w-sm px-4">
          {locations.slice(0, 5).map((loc, i) => (
            <button
              key={i}
              onClick={() => onLocationSelect?.(loc)}
              className={`flex items-center gap-2 rounded-lg p-3 text-left text-sm shadow-sm transition-all ${
                selectedLocation?.name === loc.name
                  ? 'scale-[1.02] border border-cyan-500/40 bg-cyan-500/20 text-cyan-100 shadow-[0_0_15px_rgb(34_211_238/0.2)]'
                  : 'border border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold`}
                style={{ background: TYPE_COLORS[loc.type] || TYPE_COLORS.attraction }}
              >
                {i + 1}
              </span>
              <span className="font-medium truncate">{loc.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      )}
      <div ref={mapRef} className="w-full" style={{ minHeight: 400 }} />
    </div>
  )
}
