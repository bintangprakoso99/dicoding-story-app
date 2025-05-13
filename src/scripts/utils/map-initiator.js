import L from "leaflet"
import "leaflet/dist/leaflet.css"

const MapInitiator = {
  async init({ mapElement, locationCallback }) {
    this._map = L.map(mapElement).setView([-6.2088, 106.8456], 13)
    this._locationCallback = locationCallback

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map)

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

    L.control.layers(baseMaps).addTo(this._map)
    baseMaps["OpenStreetMap"].addTo(this._map)

    this._map.on("click", (e) => {
      const { lat, lng } = e.latlng
      if (this._locationCallback) {
        this._locationCallback(lat, lng)
      }

      // Clear existing markers and add a new one
      if (this._marker) {
        this._map.removeLayer(this._marker)
      }

      this._marker = L.marker([lat, lng]).addTo(this._map)
      this._marker.bindPopup(`Lokasi yang dipilih: ${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup()
    })

    try {
      await this._getUserLocation()
    } catch (error) {
      console.error("Error getting user location:", error)
    }
  },

  async _getUserLocation() {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            this._map.setView([latitude, longitude], 13)
            resolve({ latitude, longitude })
          },
          (error) => {
            reject(error)
          },
        )
      } else {
        reject(new Error("Geolocation not supported"))
      }
    })
  },

  createMarkers(stories) {
    if (this._markers) {
      this._markers.forEach((marker) => {
        this._map.removeLayer(marker)
      })
    }

    this._markers = []

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this._map)
        marker.bindPopup(`
          <div class="popup-content">
            <h3>${story.name}</h3>
            <img src="${story.photoUrl}" alt="${story.name}'s story" style="width: 100%; max-width: 200px;">
            <p>${story.description}</p>
            <p class="popup-date">Posted on: ${new Date(story.createdAt).toLocaleDateString()}</p>
          </div>
        `)
        this._markers.push(marker)
      }
    })

    // Fit map to markers if there are any
    if (this._markers.length > 0) {
      const group = L.featureGroup(this._markers)
      this._map.fitBounds(group.getBounds().pad(0.1))
    }
  },
}

export default MapInitiator
