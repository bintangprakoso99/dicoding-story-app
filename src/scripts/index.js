import App from "./pages/app.js"
import "./utils/sw-register.js"

const app = new App({
  content: document.getElementById("mainContent"),
})

window.addEventListener("hashchange", () => {
  app.renderPage()
})

window.addEventListener("load", () => {
  app.renderPage()
})
