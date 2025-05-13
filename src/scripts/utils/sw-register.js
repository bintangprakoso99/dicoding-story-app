const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service worker registered successfully")
      return registration
    } catch (error) {
      console.error("Service worker registration failed:", error)
      return null
    }
  }
  return null
}

registerServiceWorker()
