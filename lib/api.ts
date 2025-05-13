import type { User, Story } from "@/types"

const BASE_URL = "https://story-api.dicoding.dev/v1"

// Helper function to get token from localStorage
const getToken = (): string | null => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("userData")
  if (!userData) return null

  try {
    const user = JSON.parse(userData)
    return user.token
  } catch (error) {
    console.error("Failed to parse user data:", error)
    return null
  }
}

// Handle API errors
const handleApiError = (response: any): never => {
  const message = response.message || "Something went wrong"
  throw new Error(message)
}

// Register a new user
export const register = async ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
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

    const data = await response.json()

    if (data.error) {
      handleApiError(data)
    }

    return data
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
}

// Login a user - Optimized to reduce loading time
export const login = async ({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await response.json()

    if (data.error) {
      handleApiError(data)
    }

    return data.loginResult
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// Get all stories
export const getAllStories = async ({
  page = 1,
  size = 10,
  location = 0,
}: {
  page?: number
  size?: number
  location?: number
} = {}): Promise<Story[]> => {
  const token = getToken()

  if (!token) {
    throw new Error("User not logged in")
  }

  try {
    const response = await fetch(`${BASE_URL}/stories?page=${page}&size=${size}&location=${location}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (data.error) {
      handleApiError(data)
    }

    return data.listStory
  } catch (error) {
    console.error("Get stories error:", error)
    throw error
  }
}

// Get story detail
export const getStoryDetail = async (id: string): Promise<Story> => {
  const token = getToken()

  if (!token) {
    throw new Error("User not logged in")
  }

  try {
    const response = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (data.error) {
      handleApiError(data)
    }

    return data.story
  } catch (error) {
    console.error("Get story detail error:", error)
    throw error
  }
}

// Add a new story - Fixed to properly handle photo upload
export const addNewStory = async ({
  description,
  photo,
  lat,
  lon,
}: {
  description: string
  photo: Blob
  lat: number | null
  lon: number | null
}): Promise<void> => {
  const token = getToken()
  const formData = new FormData()

  formData.append("description", description)

  // Ensure photo is properly appended as a file with a name
  const filename = `photo_${Date.now()}.jpg`
  const file = new File([photo], filename, { type: "image/jpeg" })
  formData.append("photo", file)

  if (lat !== null && lon !== null) {
    formData.append("lat", lat.toString())
    formData.append("lon", lon.toString())
  }

  const url = token ? `${BASE_URL}/stories` : `${BASE_URL}/stories/guest`

  const headers: HeadersInit = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })

    const data = await response.json()

    if (data.error) {
      handleApiError(data)
    }

    return data
  } catch (error) {
    console.error("Add story error:", error)
    throw error
  }
}
