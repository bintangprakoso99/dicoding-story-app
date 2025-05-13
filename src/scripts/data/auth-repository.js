const AuthRepository = {
  saveUserData(userData) {
    localStorage.setItem("userData", JSON.stringify(userData))
  },

  getUserData() {
    const userData = localStorage.getItem("userData")
    return userData ? JSON.parse(userData) : null
  },

  removeUserData() {
    localStorage.removeItem("userData")
  },

  isLoggedIn() {
    return !!this.getUserData()
  },

  getToken() {
    const userData = this.getUserData()
    return userData ? userData.token : null
  },
}

export default AuthRepository
