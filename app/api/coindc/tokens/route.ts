import { NextResponse } from "next/server"

type MarketDetail = {
  coindcx_name: string
  base_currency_short_name: string
  target_currency_short_name: string
  target_currency_name: string
  status: string
}

type Ticker = {
  market: string
  last_price: string
  change_24_hour?: string
  volume?: string
}

export const revalidate = 0

// Fallback data in case external APIs fail
const fallbackData = [
  { rank: 1, market: "ETHUSDT", name: "Ethereum", symbol: "ETH", price: 4014.35, change24h: 1.79, volume: 1036474781.63 },
  { rank: 2, market: "BTCUSDT", name: "Bitcoin", symbol: "BTC", price: 109546.1, change24h: 0.03, volume: 379717009.45 },
  { rank: 3, market: "XRPUSDT", name: "Ripple", symbol: "XRP", price: 2.787, change24h: 0.91, volume: 83638018.94 },
  { rank: 4, market: "SOLUSDT", name: "Solana", symbol: "SOL", price: 201.95, change24h: 2.88, volume: 71310081.94 },
  { rank: 5, market: "ADAUSDT", name: "Cardano", symbol: "ADA", price: 0.7894, change24h: 1.85, volume: 22635139.44 },
  { rank: 6, market: "AVAXUSDT", name: "Avalanche", symbol: "AVAX", price: 28.751, change24h: 2.74, volume: 21408937.68 },
  { rank: 7, market: "LINKUSDT", name: "Chainlink", symbol: "LINK", price: 20.9725, change24h: 2.71, volume: 14133502.06 },
  { rank: 8, market: "DOTUSDT", name: "Polkadot", symbol: "DOT", price: 3.8894, change24h: 1.3, volume: 4274417.44 },
  { rank: 9, market: "UNIUSDT", name: "Uniswap", symbol: "UNI", price: 7.5449, change24h: 0.61, volume: 5392046.09 },
  { rank: 10, market: "LTCUSDT", name: "Litecoin", symbol: "LTC", price: 103.69, change24h: 0.24, volume: 6953234.59 }
]

export async function GET() {
  try {
    console.log("API: Starting to fetch CoinDCX data...")
    
    // Try to fetch from external APIs with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      const [mdRes, tkRes] = await Promise.all([
        fetch("https://api.coindcx.com/exchange/v1/markets_details", {
          cache: "no-store",
          signal: controller.signal,
        }),
        fetch("https://api.coindcx.com/exchange/ticker", {
          cache: "no-store",
          signal: controller.signal,
        }),
      ])

      clearTimeout(timeoutId)

      console.log("API: Market details response status:", mdRes.status)
      console.log("API: Ticker response status:", tkRes.status)

      if (!mdRes.ok || !tkRes.ok) {
        console.error("API: One or both requests failed, using fallback data")
        return NextResponse.json(fallbackData, { status: 200 })
      }

      const markets: MarketDetail[] = await mdRes.json()
      const tickers: Ticker[] = await tkRes.json()

      console.log("API: Fetched markets:", markets.length)
      console.log("API: Fetched tickers:", tickers.length)

      const tickerMap = new Map<string, Ticker>()
      for (const t of tickers) tickerMap.set(t.market, t)

      // Filter to active, USDT quote markets (common) and with ticker data
      const rows = markets
        .filter((m) => m.status === "active" && m.base_currency_short_name === "USDT" && tickerMap.has(m.coindcx_name))
        .map((m) => {
          const t = tickerMap.get(m.coindcx_name)!
          const price = Number(t.last_price ?? 0)
          const change24h = Number(t.change_24_hour ?? 0)
          const volume = Number(t.volume ?? 0)
          return {
            market: m.coindcx_name,
            name: m.target_currency_name,
            symbol: m.target_currency_short_name,
            price,
            change24h,
            volume,
          }
        })
        .filter((r) => Number.isFinite(r.price))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 50)

      // Rank them
      const ranked = rows.map((r, i) => ({ rank: i + 1, ...r }))

      console.log("API: Returning", ranked.length, "tokens from external API")
      return NextResponse.json(ranked, { status: 200 })
      
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("API: External API fetch failed, using fallback data:", fetchError)
      return NextResponse.json(fallbackData, { status: 200 })
    }
    
  } catch (err) {
    console.error("API: Unexpected error, using fallback data:", err)
    return NextResponse.json(fallbackData, { status: 200 })
  }
}
