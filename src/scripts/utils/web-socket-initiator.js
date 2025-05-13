import NotificationHelper from "./notification-helper"

const WebSocketInitiator = {
  init(url) {
    const webSocket = new WebSocket(url)
    webSocket.onmessage = this._onMessageHandler
  },

  _onMessageHandler(message) {
    const story = JSON.parse(message.data)

    NotificationHelper.sendNotification({
      title: "Story berhasil dibuat",
      options: {
        body: `Anda telah membuat story baru dengan deskripsi: ${story.description}`,
        icon: "/images/logo.png",
      },
    })
  },
}

export default WebSocketInitiator
