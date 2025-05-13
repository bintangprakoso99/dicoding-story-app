import UrlParser from "../routes/url-parser.js"
import routes from "../routes/routes.js"
import { ViewTransitionHelper } from "../utils/index.js"
import AuthRepository from "../data/auth-repository.js"

class App {
  constructor({ content }) {
    this._content = content
    this._initialAppShell()
  }

  _initialAppShell() {
    this._renderAppBar()
    this._renderSkipToContent()
  }

  _renderSkipToContent() {
    const skipLink = document.createElement("a")
    skipLink.setAttribute("href", "#mainContent")
    skipLink.setAttribute("class", "skip-link")
    skipLink.textContent = "Skip to content"

    document.body.insertAdjacentElement("afterbegin", skipLink)
  }

  _renderAppBar() {
    const appBar = document.querySelector("app-bar")
    if (appBar) {
      // Update auth state in app bar
      this._updateAuthState()
    }
  }

  _updateAuthState() {
    const appBar = document.querySelector("app-bar")
    if (appBar) {
      const isLoggedIn = AuthRepository.isLoggedIn()
      const userData = AuthRepository.getUserData()

      appBar.updateAuthState(isLoggedIn, userData)
    }
  }

  async renderPage() {
    try {
      const url = UrlParser.parseActiveUrlWithCombiner()
      const page = routes[url]

      if (!page) {
        throw new Error(`Route ${url} not found`)
      }

      // Check if the page requires authentication
      if (this._requiresAuth(url) && !AuthRepository.isLoggedIn()) {
        window.location.hash = "#/login"
        return
      }

      if (typeof ViewTransitionHelper?.transition === "function") {
        await ViewTransitionHelper.transition(() => {
          this._content.innerHTML = ""
          const pageInstance = new page()
          pageInstance.render(this._content)
        })
      } else {
        this._content.innerHTML = ""
        const pageInstance = new page()
        pageInstance.render(this._content)
      }

      // Update auth state after page render
      this._updateAuthState()

      // Scroll to top
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Error rendering page:", error)
      this._content.innerHTML = `<div class="error-container">
        <h2>Error</h2>
        <p>${error.message}</p>
        <a href="#/home">Back to Home</a>
      </div>`
    }
  }

  _requiresAuth(url) {
    const authRequiredRoutes = ["/add"]
    return authRequiredRoutes.includes(url)
  }
}

export default App
