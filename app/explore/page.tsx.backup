"use client"

import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useMemo, useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { BokehBackground } from "@/components/ui/bokeh-background"

type TokenRow = {
  rank: number
  market: string
  name: string
  symbol: string
  price: number
  change24h: number
  volume: number
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 1 ? 6 : 2,
  }).format(n)
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n)
}

export default function TokensTable() {
  const [data, setData] = useState<TokenRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Starting to fetch data...")
        setIsLoading(true)
        setError(null)
        
        const response = await fetch("/api/coindc/tokens", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        })
        
        console.log("Response status:", response.status)
        console.log("Response ok:", response.ok)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error("Response error:", errorText)
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
        }
        
        const result = await response.json()
        console.log("Fetched data:", result)
        setData(result)
        setError(null)
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    
    // Set up interval for refreshing data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter(
      (r) =>
        r.name.toLowerCase().includes(q) || r.symbol.toLowerCase().includes(q) || r.market.toLowerCase().includes(q),
    )
  }, [data, query])

  if (error) {
    return (
      <main className="min-h-[100svh] relative">
        <Navbar />
        <BokehBackground />
        <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:pt-28">
          <div className="text-center">
            <div className="text-sm text-destructive mb-4">Failed to load data. Please try again.</div>
            <div className="text-xs text-muted-foreground mb-4">Error: {error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-[100svh] relative">
      <Navbar />
      <BokehBackground />

      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:pt-28">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-medium text-pretty">Tokens</h2>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tokens and markets"
              className="max-w-xs"
            />
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead className="hidden md:table-cell">Symbol</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                        <span>Loading tokens...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center">
                      No results found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => {
                    const isUp = r.change24h >= 0
                    return (
                      <TableRow key={r.market}>
                        <TableCell className="text-muted-foreground">{r.rank}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {/* Token logo not available from API; showing symbol circle */}
                            <div
                              aria-hidden
                              className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px]"
                              title={r.symbol}
                            >
                              {r.symbol.slice(0, 3)}
                            </div>
                            <div className="flex flex-col">
                              <span>{r.name}</span>
                              <span className="text-xs text-muted-foreground">{r.market}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{r.symbol}</TableCell>
                        <TableCell className="text-right">{formatCurrency(r.price)}</TableCell>
                        <TableCell className={cn("text-right", isUp ? "text-emerald-500" : "text-red-500")}>
                          {isUp ? "▲" : "▼"} {Math.abs(r.change24h).toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">{formatNumber(r.volume)}</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground">
            Data from CoinDCX public API. Prices quoted in USDT markets. Refreshes every 30s.
          </p>
        </div>
      </section>
    </main>
  )
}
