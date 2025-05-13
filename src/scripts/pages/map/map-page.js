import StoryRepository from "../../data/story-repository"
import { MapInitiator } from "../../utils"
import { createLoadingTemplate, createErrorTemplate } from "../templates/template-creator"

class MapPage {
  constructor() {
    this._stories = []
  }

  async render(container) {
    this._container = container

    this._container.innerHTML = `
      <div class="map-page-container">
        <h1 class="page-title">Peta Cerita</h1>
        <p class="page-description">Lihat lokasi semua cerita yang dibagikan</p>
        
        <div id="mapContainer" class="map-container map-fullscreen"></div>
        
        <div id="loadingContainer" class="loading-container"></div>
        <div id="errorContainer" class="error-container"></div>
        
        <div class="story-count">
          <span id="storyCount">0</span> cerita ditemukan
        </div>
      </div>
    `

    this._mapContainer = this._container.querySelector("#mapContainer")
    this._loadingContainer = this._container.querySelector("#loadingContainer")
    this._errorContainer = this._container.querySelector("#errorContainer")
    this._storyCountElement = this._container.querySelector("#storyCount")

    this._renderLoading(true)
    await this._initMap()
    await this._fetchStories()
    this._renderLoading(false)
  }

  async _initMap() {
    try {
      await MapInitiator.init({
        mapElement: this._mapContainer,
      })
    } catch (error) {
      this._renderError("Gagal memuat peta: " + error.message)
    }
  }

  async _fetchStories() {
    try {
      // Get all stories with location
      const stories = await StoryRepository.getAllStories({
        page: 1,
        size: 50, // Get more stories for the map
        location: 1,
      })

      this._stories = stories.filter((story) => story.lat && story.lon)
      this._storyCountElement.textContent = this._stories.length

      // Create markers for all stories
      MapInitiator.createMarkers(this._stories)
    } catch (error) {
      this._renderError(error.message)
    }
  }

  _renderLoading(isLoading) {
    if (isLoading) {
      this._loadingContainer.innerHTML = createLoadingTemplate()
    } else {
      this._loadingContainer.innerHTML = ""
    }
  }

  _renderError(message) {
    this._errorContainer.innerHTML = createErrorTemplate(message)
  }
}

export default MapPage
