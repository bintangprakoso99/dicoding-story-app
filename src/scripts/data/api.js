import CONFIG from "../config"

const API = {
  async register({ name, email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    return response.json()
  },

  async login({ email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    return response.json()
  },

  async getAllStories({ token, page = 1, size = 10, location = 1 }) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories?page=${page}&size=${size}&location=${location}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.json()
  },

  async getStoryDetail({ token, id }) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.json()
  },

  async addNewStory({ token, description, photo, lat, lon }) {
    const formData = new FormData()
    formData.append("description", description)
    formData.append("photo", photo)

    if (lat !== null && lon !== null) {
      formData.append("lat", lat)
      formData.append("lon", lon)
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    return response.json()
  },

  async addNewStoryAsGuest({ description, photo, lat, lon }) {
    const formData = new FormData()
    formData.append("description", description)
    formData.append("photo", photo)

    if (lat !== null && lon !== null) {
      formData.append("lat", lat)
      formData.append("lon", lon)
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories/guest`, {
      method: "POST",
      body: formData,
    })

    return response.json()
  },
}

export default API
