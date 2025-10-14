"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { WalletButton } from "@/components/WalletButton"
import { NetworkIndicator } from "./NetworkIndicator"
import { ModeToggle } from "./ModeButton"

export function Header() {
  const { resolvedTheme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)

  // Detect screen size
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 640)
    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  // Dynamic logo
  const logoSrc = (() => {
    if (resolvedTheme === "dark") {
      return isMobile ? "/small-logo-w.png" : "/logo-white.svg"
    } else {
      return isMobile ? "/small-logo-b.png" : "/logo-black.svg"
    }
  })()

  return (
    <header className="w-full flex border-b bg-background sticky top-0 z-50">
      <div className="container flex items-center justify-between py-3">
        {/* Left side: Logo */}
        <div className="justify-start pl-4 lg:p-2 lg:pl-8 flex items-center">
          <Image
            src={logoSrc}
            alt="Railway Logo"
            width={isMobile ? 35 : 120}
            height={isMobile ? 35 : 40}
            priority
          />
        </div>

        {/* Right side: Controls */}
        <div className="justify-end gap-1 pr-3 flex items-center">
          <NetworkIndicator />
          <WalletButton />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

// <button
//   disabled
//   className="opacity-50 cursor-not-allowed text-sm border rounded px-3 py-1"
//   title="Coming soon: P2P on/off-ramp"
// >
//   On/Off Ramp (coming soon)
// </button>