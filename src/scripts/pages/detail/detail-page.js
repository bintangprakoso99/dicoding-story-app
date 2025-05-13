import UrlParser from "../../routes/url-parser"
import StoryRepository from "../../data/story-repository"
import { MapInitiator, ViewTransitionHelper } from "../../utils"
import { createStoryDetailTemplate, createLoadingTemplate, createErrorTemplate } from "../templates/template-creator"

class DetailPage {
  constructor() {
    this._story = null
  }

  async render(container) {
    this._container = container

    this._container.innerHTML = `
      <div class="detail-container">
        <div id="loadingContainer" class="loading-container"></div>
        <div id="storyDetail" class="story-detail"></div>
        <div id="errorContainer" class="error-container"></div>
        <div id="mapContainer" class="map-container"></div>
        
        <div class="back-button-container">
          <button id="backButton" class="back-button" aria-label="Kembali ke halaman utama">
            <span class="back-icon">←</span> Kembali
          </button>
        </div>
      </div>
    `

    this._storyDetailContainer = this._container.querySelector("#storyDetail")
    this._loadingContainer = this._container.querySelector("#loadingContainer")
    this._errorContainer = this._container.querySelector("#errorContainer")
    this._mapContainer = this._container.querySelector("#mapContainer")

    this._renderLoading(true)
    await this._fetchStoryDetail()
    this._renderLoading(false)

    this._initButtons()
  }

  async _fetchStoryDetail() {
    try {
      const url = UrlParser.parseActiveUrlWithoutCombiner()
      const id = url.id

      this._story = await StoryRepository.getStoryDetail(id)
      this._renderStoryDetail()

      if (this._story.lat && this._story.lon) {
        this._initMap()
      } else {
        this._mapContainer.style.display = "none"
      }
    } catch (error) {
      this._renderError(error.message)
    }
  }

  _renderStoryDetail() {
    this._storyDetailContainer.innerHTML = createStoryDetailTemplate(this._story)
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

  async _initMap() {
    this._mapContainer.style.display = "block"

    await MapInitiator.init({
      mapElement: this._mapContainer,
    })

    MapInitiator.createMarkers([this._story])
  }

  _initButtons() {
    const backButton = this._container.querySelector("#backButton")
    backButton.addEventListener("click", () => {
      ViewTransitionHelper.fadeTransition(backButton, () => {
        window.history.back()
      })
    })
  }
}

export default DetailPage
