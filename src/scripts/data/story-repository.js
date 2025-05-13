import API from "./api"
import AuthRepository from "./auth-repository"

const StoryRepository = {
  async getAllStories({ page = 1, size = 10, location = 1 } = {}) {
    const token = AuthRepository.getToken()

    if (!token) {
      throw new Error("User not logged in")
    }

    const response = await API.getAllStories({ token, page, size, location })

    if (response.error) {
      throw new Error(response.message)
    }

    return response.listStory
  },

  async getStoryDetail(id) {
    const token = AuthRepository.getToken()

    if (!token) {
      throw new Error("User not logged in")
    }

    const response = await API.getStoryDetail({ token, id })

    if (response.error) {
      throw new Error(response.message)
    }

    return response.story
  },

  async addNewStory({ description, photo, lat, lon }) {
    const token = AuthRepository.getToken()

    if (!token) {
      // If not logged in, try to add as guest
      const response = await API.addNewStoryAsGuest({
        description,
        photo,
        lat,
        lon,
      })

      if (response.error) {
        throw new Error(response.message)
      }

      return response
    }

    const response = await API.addNewStory({
      token,
      description,
      photo,
      lat,
      lon,
    })

    if (response.error) {
      throw new Error(response.message)
    }

    return response
  },
}

export default StoryRepository
