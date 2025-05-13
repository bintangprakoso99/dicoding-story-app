const NotificationHelper = {
  async requestPermission() {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      if (result === "denied") {
        console.log("Notification permission denied")
        return false
      }

      if (result === "default") {
        console.log("User closed the permission prompt")
        return false
      }

      return true
    }
    return false
  },

  async sendNotification({ title, options }) {
    if (!this.requestPermission()) {
      console.log("User did not grant permission for notification")
      return
    }

    if (!("PushManager" in window)) {
      console.log("Push Notification not supported in the browser")
      return
    }

    const serviceWorkerRegistration = await navigator.serviceWorker.ready
    serviceWorkerRegistration.showNotification(title, options)
  },
}

export default NotificationHelper
