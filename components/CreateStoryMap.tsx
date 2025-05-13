"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface CreateStoryMapProps {
  onLocationSelect: (lat: number, lon: number) => void
}

export default function CreateStoryMap({ onLocationSelect }: CreateStoryMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        userLocation || [-2.5489, 118.0149], // Default to Indonesia center if no user location
        userLocation ? 13 : 5,
      )

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      // Add layer control with multiple map styles
      const baseMaps = {
        OpenStreetMap: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
        Satellite: L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          },
        ),
        Terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        }),
      }

      L.control.layers(baseMaps).addTo(mapRef.current)
      baseMaps["OpenStreetMap"].addTo(mapRef.current)

      // Add click event to map
      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng

        // Remove existing marker
        if (markerRef.current) {
          mapRef.current?.removeLayer(markerRef.current)
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current!)
        markerRef.current.bindPopup(`Lokasi yang dipilih: ${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup()

        // Call callback
        onLocationSelect(lat, lng)
      })
    }

    // Update map view if user location changes
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 13)

      // Add marker for user location if it doesn't exist
      if (!markerRef.current) {
        markerRef.current = L.marker(userLocation).addTo(mapRef.current)
        markerRef.current.bindPopup("Lokasi Anda").openPopup()

        // Call callback with initial location
        onLocationSelect(userLocation[0], userLocation[1])
      }
    }

    // Cleanup on unmount
    return () => {
      // Don't destroy the map, just clean up markers
    }
  }, [userLocation, onLocationSelect])

  return <div ref={mapContainerRef} className="w-full h-full" />
}
