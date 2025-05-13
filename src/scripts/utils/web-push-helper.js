import CONFIG from "../config"

const WebPushHelper = {
  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js")
        return registration
      } catch (error) {
        console.error("Service worker registration failed:", error)
        return null
      }
    }
    return null
  },

  async requestNotificationPermission() {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === "granted"
  },

  async subscribePushNotification(token) {
    try {
      const registration = await this.registerServiceWorker()
      if (!registration) return null

      const subscribed = await registration.pushManager.getSubscription()
      if (subscribed) return subscribed

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this._urlBase64ToUint8Array(CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY),
      })

      await this._sendSubscriptionToServer(subscription, token)
      return subscription
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      return null
    }
  },

  async unsubscribePushNotification(token) {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await this._sendUnsubscriptionToServer(subscription, token)
        await subscription.unsubscribe()
        return true
      }

      return false
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
      return false
    }
  },

  async _sendSubscriptionToServer(subscription, token) {
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("p256dh")))),
          auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("auth")))),
        },
      }),
    })

    return response.json()
  },

  async _sendUnsubscriptionToServer(subscription, token) {
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    })

    return response.json()
  },

  _urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  },
}

export default WebPushHelper
