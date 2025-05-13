class AppBar extends HTMLElement {
  constructor() {
    super()
    this._isLoggedIn = false
    this._userData = null
  }

  connectedCallback() {
    this.render()
  }

  updateAuthState(isLoggedIn, userData) {
    this._isLoggedIn = isLoggedIn
    this._userData = userData
    this.render()
  }

  render() {
    this.innerHTML = `
      <header class="app-bar">
        <div class="app-bar-brand">
          <a href="#/home" class="app-bar-brand-link">
            <img src="/images/logo.png" alt="Dicoding Story Logo" class="app-bar-logo">
            <h1 class="app-bar-title">Dicoding Story</h1>
          </a>
        </div>
        
        <button id="hamburgerButton" class="hamburger" aria-label="Toggle navigation menu">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        
        <nav id="navigationDrawer" class="navigation">
          <ul class="nav-list">
            <li class="nav-item"><a href="#/home" class="nav-link">Home</a></li>
            <li class="nav-item"><a href="#/map" class="nav-link">Map</a></li>
            <li class="nav-item"><a href="#/about" class="nav-link">About</a></li>
            ${
              this._isLoggedIn
                ? `
              <li class="nav-item"><a href="#/add" class="nav-link">Add Story</a></li>
              <li class="nav-item">
                <button id="logoutButton" class="nav-link logout-button">Logout (${this._userData.name})</button>
              </li>
            `
                : `
              <li class="nav-item"><a href="#/login" class="nav-link">Login</a></li>
              <li class="nav-item"><a href="#/register" class="nav-link">Register</a></li>
            `
            }
          </ul>
        </nav>
      </header>
    `

    this._initAppBar()
  }

  _initAppBar() {
    const hamburgerButton = this.querySelector("#hamburgerButton")
    const navigationDrawer = this.querySelector("#navigationDrawer")
    const logoutButton = this.querySelector("#logoutButton")

    hamburgerButton.addEventListener("click", (event) => {
      navigationDrawer.classList.toggle("open")
      event.stopPropagation()
    })

    document.addEventListener("click", (event) => {
      if (!navigationDrawer.contains(event.target) && !hamburgerButton.contains(event.target)) {
        navigationDrawer.classList.remove("open")
      }
    })

    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        // Clear user data from local storage
        localStorage.removeItem("userData")

        // Redirect to home page
        window.location.hash = "#/home"

        // Reload the page to update auth state
        window.location.reload()
      })
    }
  }
}

customElements.define("app-bar", AppBar)
