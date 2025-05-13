import API from "../../data/api"
import { ViewTransitionHelper } from "../../utils"
import { createLoadingTemplate, createErrorTemplate } from "../templates/template-creator"

class RegisterPage {
  constructor() {
    this._isLoading = false
  }

  render(container) {
    this._container = container

    this._container.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <h1 class="auth-title">Daftar</h1>
          
          <form id="registerForm" class="auth-form">
            <div class="form-group">
              <label for="name" class="form-label">Nama</label>
              <input type="text" id="name" name="name" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" name="email" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" name="password" class="form-input" minlength="8" required>
              <p class="form-help-text">Password minimal 8 karakter</p>
            </div>
            
            <div id="loadingContainer" class="loading-container"></div>
            <div id="errorContainer" class="error-container"></div>
            
            <div class="form-actions">
              <button type="submit" id="registerButton" class="button submit-button">Daftar</button>
            </div>
          </form>
          
          <div class="auth-footer">
            <p>Sudah punya akun? <a href="#/login" id="loginLink">Login</a></p>
          </div>
        </div>
      </div>
    `

    this._form = this._container.querySelector("#registerForm")
    this._loadingContainer = this._container.querySelector("#loadingContainer")
    this._errorContainer = this._container.querySelector("#errorContainer")
    this._loginLink = this._container.querySelector("#loginLink")

    this._initFormSubmission()
    this._initButtons()
  }

  _initFormSubmission() {
    this._form.addEventListener("submit", async (event) => {
      event.preventDefault()

      if (this._isLoading) return

      const name = this._form.querySelector("#name").value
      const email = this._form.querySelector("#email").value
      const password = this._form.querySelector("#password").value

      this._renderLoading(true)
      this._errorContainer.innerHTML = ""

      try {
        const response = await API.register({ name, email, password })

        if (response.error) {
          throw new Error(response.message)
        }

        // Show success message and redirect to login
        this._renderLoading(false)
        this._renderSuccess("Pendaftaran berhasil! Silakan login.")

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          ViewTransitionHelper.transition(() => {
            window.location.hash = "#/login"
          })
        }, 2000)
      } catch (error) {
        this._renderLoading(false)
        this._renderError(error.message)
      }
    })
  }

  _initButtons() {
    this._loginLink.addEventListener("click", (event) => {
      event.preventDefault()

      ViewTransitionHelper.fadeTransition(this._loginLink, () => {
        window.location.hash = "#/login"
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

  _renderSuccess(message) {
    this._errorContainer.innerHTML = `
      <div class="success-message">
        <p>${message}</p>
      </div>
    `
  }
}

export default RegisterPage
