"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/map", label: "Peta" },
    { href: "/about", label: "Tentang" },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <img src="/logo.png" alt="Dicoding Story Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl">Dicoding Story</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-primary-foreground text-primary"
                    : "text-white hover:bg-primary-foreground/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/stories/create"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/stories/create")
                      ? "bg-primary-foreground text-primary"
                      : "text-white hover:bg-primary-foreground/10"
                  }`}
                >
                  Tambah Cerita
                </Link>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout ({user.name})
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-primary-foreground/10">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary">Register</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-white hover:bg-primary-foreground/10"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-primary border-t border-primary-foreground/10 px-4 py-2">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(link.href)
                      ? "bg-primary-foreground text-primary"
                      : "text-white hover:bg-primary-foreground/10"
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <Link
                    href="/stories/create"
                    className={`block px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/stories/create")
                        ? "bg-primary-foreground text-primary"
                        : "text-white hover:bg-primary-foreground/10"
                    }`}
                    onClick={closeMenu}
                  >
                    Tambah Cerita
                  </Link>
                </li>
                <li className="pt-2 border-t border-primary-foreground/10 mt-2">
                  <Button variant="secondary" onClick={handleLogout} className="w-full">
                    Logout ({user.name})
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li className="pt-2 border-t border-primary-foreground/10 mt-2">
                  <Link href="/login" onClick={closeMenu} className="block">
                    <Button
                      variant="ghost"
                      className="w-full text-white hover:text-white hover:bg-primary-foreground/10"
                    >
                      Login
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/register" onClick={closeMenu} className="block">
                    <Button variant="secondary" className="w-full">
                      Register
                    </Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
