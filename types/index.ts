export interface User {
  userId: string
  name: string
  token: string
}

export interface Story {
  id: string
  name: string
  description: string
  photoUrl: string
  createdAt: string
  lat?: number
  lon?: number
}
