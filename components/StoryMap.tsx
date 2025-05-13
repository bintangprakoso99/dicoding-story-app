"use client"

import { useEffect, useRef } from "react"
import type { Story } from "@/types"
import { formatDate } from "@/lib/utils"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface StoryMapProps {
  stories: Story[]
  center?: [number, number]
  zoom?: number
}

export default function StoryMap({ stories, center, zoom = 5 }: StoryMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        center || [-2.5489, 118.0149], // Default to Indonesia center if no center provided
        zoom,
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
    }

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer)
      }
    })

    // Add markers for stories
    const markers: L.Marker[] = []
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(mapRef.current!)
        marker.bindPopup(`
          <div class="popup-content">
            <h3 class="font-semibold">${story.name}</h3>
            <img src="${story.photoUrl}" alt="${story.name}'s story" style="width: 100%; max-width: 200px; margin: 8px 0;">
            <p>${story.description}</p>
            <p class="text-xs text-gray-500 mt-2">Posted on: ${formatDate(story.createdAt)}</p>
            <a href="/stories/${story.id}" class="text-blue-500 hover:underline text-sm">Lihat detail</a>
          </div>
        `)
        markers.push(marker)
      }
    })

    // Fit map to markers if there are any
    if (markers.length > 0) {
      const group = L.featureGroup(markers)
      mapRef.current.fitBounds(group.getBounds().pad(0.1))
    }

    // Cleanup on unmount
    return () => {
      // Don't destroy the map, just clean up markers
    }
  }, [stories, center, zoom])

  return <div ref={mapContainerRef} className="w-full h-full" />
}
