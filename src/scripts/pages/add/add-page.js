import StoryRepository from "../../data/story-repository"
import { CameraInitiator, MapInitiator, NotificationHelper, ViewTransitionHelper } from "../../utils"
import { createLoadingTemplate, createErrorTemplate } from "../templates/template-creator"

class AddPage {
  constructor() {
    this._latitude = null
    this._longitude = null
    this._photoBlob = null
  }

  async render(container) {
    this._container = container

    this._container.innerHTML = `
      <div class="add-story-container">
        <h1 class="page-title">Bagikan Cerita Baru</h1>
        
        <form id="addStoryForm" class="add-story-form">
          <div class="form-group">
            <label for="description" class="form-label">Cerita Anda</label>
            <textarea id="description" name="description" class="form-input" required></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Foto</label>
            <div class="camera-container">
              <video id="cameraPreview" class="camera-preview" autoplay></video>
              <canvas id="photoCanvas" class="photo-canvas" style="display: none;"></canvas>
              <div class="camera-controls">
                <button type="button" id="captureButton" class="button camera-button" aria-label="Ambil foto">
                  <span class="camera-icon">📷</span> Ambil Foto
                </button>
                <button type="button" id="retakeButton" class="button camera-button" style="display: none;" aria-label="Ambil ulang foto">
                  <span class="camera-icon">🔄</span> Ambil Ulang
                </button>
              </div>
              <div id="photoPreviewContainer" class="photo-preview-container" style="display: none;">
                <img id="photoPreview" class="photo-preview" alt="Preview foto yang diambil">
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Lokasi</label>
            <p class="form-help-text">Klik pada peta untuk menentukan lokasi</p>
            <div id="mapContainer" class="map-container"></div>
            <div id="locationInfo" class="location-info">
              <p>Lokasi belum dipilih</p>
            </div>
          </div>
          
          <div id="loadingContainer" class="loading-container"></div>
          <div id="errorContainer" class="error-container"></div>
          
          <div class="form-actions">
            <button type="submit" id="submitButton" class="button submit-button" disabled>Bagikan Cerita</button>
            <a href="#/home" id="cancelButton" class="button cancel-button">Batal</a>
          </div>
        </form>
      </div>
    `

    this._form = this._container.querySelector("#addStoryForm")
    this._cameraPreview = this._container.querySelector("#cameraPreview")
    this._photoCanvas = this._container.querySelector("#photoCanvas")
    this._captureButton = this._container.querySelector("#captureButton")
    this._retakeButton = this._container.querySelector("#retakeButton")
    this._photoPreview = this._container.querySelector("#photoPreview")
    this._photoPreviewContainer = this._container.querySelector("#photoPreviewContainer")
    this._mapContainer = this._container.querySelector("#mapContainer")
    this._locationInfo = this._container.querySelector("#locationInfo")
    this._loadingContainer = this._container.querySelector("#loadingContainer")
    this._errorContainer = this._container.querySelector("#errorContainer")
    this._submitButton = this._container.querySelector("#submitButton")

    await this._initCamera()
    await this._initMap()
    this._initFormSubmission()
  }

  async _initCamera() {
    try {
      const cameraInitiated = await CameraInitiator.init({
        video: this._cameraPreview,
        canvas: this._photoCanvas,
      })

      if (!cameraInitiated) {
        throw new Error("Tidak dapat mengakses kamera")
      }

      this._captureButton.addEventListener("click", async () => {
        try {
          this._photoBlob = await CameraInitiator.takePhotoAsBlob()

          const photoUrl = URL.createObjectURL(this._photoBlob)
          this._photoPreview.src = photoUrl

          this._cameraPreview.style.display = "none"
          this._captureButton.style.display = "none"
          this._photoPreviewContainer.style.display = "block"
          this._retakeButton.style.display = "inline-block"

          this._updateSubmitButtonState()
        } catch (error) {
          this._renderError("Gagal mengambil foto: " + error.message)
        }
      })

      this._retakeButton.addEventListener("click", () => {
        this._photoBlob = null
        this._photoPreview.src = ""

        this._cameraPreview.style.display = "block"
        this._captureButton.style.display = "inline-block"
        this._photoPreviewContainer.style.display = "none"
        this._retakeButton.style.display = "none"

        this._updateSubmitButtonState()
      })
    } catch (error) {
      this._renderError("Gagal mengakses kamera: " + error.message)
    }
  }

  async _initMap() {
    try {
      await MapInitiator.init({
        mapElement: this._mapContainer,
        locationCallback: (lat, lng) => {
          this._latitude = lat
          this._longitude = lng

          this._locationInfo.innerHTML = `
            <p>Lokasi dipilih: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
          `

          this._updateSubmitButtonState()
        },
      })
    } catch (error) {
      this._renderError("Gagal memuat peta: " + error.message)
    }
  }

  _initFormSubmission() {
    this._form.addEventListener("submit", async (event) => {
      event.preventDefault()

      if (!this._photoBlob) {
        this._renderError("Silakan ambil foto terlebih dahulu")
        return
      }

      const description = this._form.querySelector("#description").value

      this._renderLoading(true)
      this._errorContainer.innerHTML = ""

      try {
        const response = await StoryRepository.addNewStory({
          description,
          photo: this._photoBlob,
          lat: this._latitude,
          lon: this._longitude,
        })

        this._renderLoading(false)

        // Show notification
        NotificationHelper.sendNotification({
          title: "Story berhasil dibuat",
          options: {
            body: `Anda telah membuat story baru dengan deskripsi: ${description}`,
            icon: "/images/logo.png",
          },
        })

        // Redirect to home page
        ViewTransitionHelper.transition(() => {
          window.location.hash = "#/home"
        })
      } catch (error) {
        this._renderLoading(false)
        this._renderError(error.message)
      }
    })
  }

  _updateSubmitButtonState() {
    const description = this._form.querySelector("#description").value
    const hasPhoto = !!this._photoBlob

    this._submitButton.disabled = !description || !hasPhoto
  }

  _renderLoading(isLoading) {
    if (isLoading) {
      this._loadingContainer.innerHTML = createLoadingTemplate()
      this._submitButton.disabled = true
    } else {
      this._loadingContainer.innerHTML = ""
      this._updateSubmitButtonState()
    }
  }

  _renderError(message) {
    this._errorContainer.innerHTML = createErrorTemplate(message)
  }
}

export default AddPage
