import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { AuthProvider } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dicoding Story",
  description: "Aplikasi berbagi cerita dan pengalaman bersama Dicoding",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" className="container mx-auto px-4 py-8 min-h-[calc(100vh-64px-64px)]">
            {children}
          </main>
          <footer className="bg-primary text-white py-4">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; {new Date().getFullYear()} Dicoding Story</p>
            </div>
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
