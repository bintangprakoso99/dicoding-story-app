const CameraInitiator = {
  async init({ video, canvas }) {
    this._video = video
    this._canvas = canvas

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      })

      this._video.srcObject = stream
      return true
    } catch (error) {
      console.error("Camera error:", error)
      return false
    }
  },

  async takePhoto() {
    const imageCapture = new ImageCapture(this._video.srcObject.getVideoTracks()[0])
    const photo = await imageCapture.takePhoto()
    return photo
  },

  async takePhotoAsBlob() {
    const context = this._canvas.getContext("2d")
    const { videoWidth, videoHeight } = this._video

    this._canvas.width = videoWidth
    this._canvas.height = videoHeight

    context.drawImage(this._video, 0, 0, videoWidth, videoHeight)

    return new Promise((resolve) => {
      this._canvas.toBlob((blob) => {
        resolve(blob)
      })
    })
  },

  stopStream() {
    if (this._video && this._video.srcObject) {
      this._video.srcObject.getTracks().forEach((track) => {
        track.stop()
      })
      this._video.srcObject = null
    }
  },
}

export default CameraInitiator
