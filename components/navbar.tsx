"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function Navbar({ className }: { className?: string }) {
  return (
    <header className={cn("w-full sticky top-0 z-40", className)}>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block size-2 rounded-full"
            style={{ backgroundColor: "var(--color-brand)" }}
          />
          <span className="font-semibold tracking-tight">SwapX</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/explore" className="hover:text-foreground transition-colors">
            Explore
          </Link>
          <Link href="/pool" className="hover:text-foreground transition-colors">
            Pool
          </Link>
          <Link href="/swap" className="hover:text-foreground transition-colors">
            Swap
          </Link>
        </nav>

        <div className="ml-auto hidden md:flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Search tokens and pools"
              className="w-80 bg-secondary/60 border-secondary text-foreground"
            />
          </div>
          <Button className="font-medium bg-red-500 hover:bg-red-600 text-white">
            Connect
          </Button>
        </div>

        <div className="md:hidden ml-auto">
          <Button variant="outline" className="border-secondary bg-transparent">
            Menu
          </Button>
        </div>
      </div>
    </header>
  )
}
