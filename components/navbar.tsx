"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { WalletConnect } from "@/components/wallet-connect"

export function Navbar({ className }: { className?: string }) {
  return (
    <header className={cn("w-full sticky top-0 z-40 bg-black", className)}>
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block size-2 rounded-full"
            style={{ backgroundColor: "var(--color-brand)" }}
          />
          <img src="/logo.png" alt="logo" className="w-10 h-10" />
          <span className="text-muted-foreground tracking-tight text-lg">SwapX</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-base text-muted-foreground">
          <Link href="/explore" className="hover:text-foreground transition-colors">
            Explore
          </Link>
          <Link href="/pool" className="hover:text-foreground transition-colors">
            Pool
          </Link>
          <Link href="/swap" className="hover:text-foreground transition-colors">
            Swap
          </Link>
          <Link href="/bridge" className="hover:text-foreground transition-colors">
            Bridge
          </Link>
        </nav>

        <div className="ml-auto hidden md:flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Search tokens and pools"
              className="w-80 bg-secondary/60 border-secondary text-foreground rounded-4xl text-base"
            />
          </div>
          <WalletConnect />
        </div>

        <div className="md:hidden ml-auto">
          <Button variant="outline" size="sm" className="border-secondary bg-transparent rounded-4xl text-base h-8 px-4">
            Menu
          </Button>
        </div>
      </div>
    </header>
  )
}
