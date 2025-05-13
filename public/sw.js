const CACHE_NAME = "dicoding-story-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/images/logo.png",
  "/scripts/index.js",
  "/scripts/components/app-bar.js",
  "/styles/styles.css",
]

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME
          })
          .map((cacheName) => {
            return caches.delete(cacheName)
          }),
      )
    }),
  )
})

// Fetch Event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }

      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          // Don't cache API requests
          if (!event.request.url.includes("/v1/")) {
            cache.put(event.request, responseToCache)
          }
        })

        return response
      })
    }),
  )
})

// Push Event
self.addEventListener("push", (event) => {
  let notificationData = {}

  try {
    notificationData = event.data.json()
  } catch (e) {
    notificationData = {
      title: "Notification",
      options: {
        body: event.data.text(),
      },
    }
  }

  const title = notificationData.title || "Dicoding Story"
  const options = notificationData.options || {}

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification Click Event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(clients.openWindow("/"))
})
