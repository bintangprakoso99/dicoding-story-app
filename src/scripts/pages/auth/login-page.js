import API from "../../data/api"
import AuthRepository from "../../data/auth-repository"
import { ViewTransitionHelper, WebPushHelper } from "../../utils"
import { createLoadingTemplate, createErrorTemplate } from "../templates/template-creator"

class LoginPage {
  constructor() {
    this._isLoading = false
  }

  render(container) {
    this._container = container

    this._container.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <h1 class="auth-title">Login</h1>
          
          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" name="email" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" name="password" class="form-input" required>
            </div>
            
            <div id="loadingContainer" class="loading-container"></div>
            <div id="errorContainer" class="error-container"></div>
            
            <div class="form-actions">
              <button type="submit" id="loginButton" class="button submit-button">Login</button>
            </div>
          </form>
          
          <div class="auth-footer">
            <p>Belum punya akun? <a href="#/register" id="registerLink">Daftar</a></p>
            <p>atau</p>
            <button id="guestButton" class="button guest-button">Lanjutkan sebagai Tamu</button>
          </div>
        </div>
      </div>
    `

    this._form = this._container.querySelector("#loginForm")
    this._loadingContainer = this._container.querySelector("#loadingContainer")
    this._errorContainer = this._container.querySelector("#errorContainer")
    this._registerLink = this._container.querySelector("#registerLink")
    this._guestButton = this._container.querySelector("#guestButton")

    this._initFormSubmission()
    this._initButtons()
  }

  _initFormSubmission() {
    this._form.addEventListener("submit", async (event) => {
      event.preventDefault()

      if (this._isLoading) return

      const email = this._form.querySelector("#email").value
      const password = this._form.querySelector("#password").value

      this._renderLoading(true)
      this._errorContainer.innerHTML = ""

      try {
        const response = await API.login({ email, password })

        if (response.error) {
          throw new Error(response.message)
        }

        // Save user data to local storage
        AuthRepository.saveUserData(response.loginResult)

        // Subscribe to push notifications
        await WebPushHelper.subscribePushNotification(response.loginResult.token)

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

  _initButtons() {
    this._registerLink.addEventListener("click", (event) => {
      event.preventDefault()

      ViewTransitionHelper.fadeTransition(this._registerLink, () => {
        window.location.hash = "#/register"
      })
    })

    this._guestButton.addEventListener("click", () => {
      ViewTransitionHelper.fadeTransition(this._guestButton, () => {
        window.location.hash = "#/home"
      })
    })
  }

  _renderLoading(isLoading) {
    this._isLoading = isLoading

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

export default LoginPage
