"use client"

import { useEffect, useRef } from "react"

export default function AppBarReact() {
  const appBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Import the app-bar custom element
    import("../src/scripts/components/app-bar.js")

    // Initialize app-bar if needed
    const appBar = appBarRef.current?.querySelector("app-bar")
    if (appBar) {
      // You can initialize app-bar here if needed
      // For example, update auth state
      const isLoggedIn = localStorage.getItem("userData") !== null
      const userData = isLoggedIn ? JSON.parse(localStorage.getItem("userData") || "{}") : null

      if (typeof (appBar as any).updateAuthState === "function") {
        ;(appBar as any).updateAuthState(isLoggedIn, userData)
      }
    }
  }, [])

  return (
    <div ref={appBarRef}>
      <app-bar></app-bar>
    </div>
  )
}
