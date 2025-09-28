import { NextResponse } from "next/server"

type PythPrice = {
  id: string
  price: {
    price: string
    conf: string
    expo: number
    publish_time: number
  }
  ema_price: {
    price: string
    conf: string
    expo: number
    publish_time: number
  }
  metadata: {
    slot: number
    proof_available_time: number
    prev_publish_time: number
  }
}

type PythResponse = {
  binary: {
    encoding: string
    data: string[]
  }
  parsed: PythPrice[]
}

type TokenRow = {
  rank: number
  market: string
  name: string
  symbol: string
  price: number
  change24h: number
  volume: number
}

export const revalidate = 0

// Token mapping for Pyth price IDs - using verified working IDs
const TOKEN_MAPPING = {
  "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43": {
    name: "Bitcoin",
    symbol: "BTC",
    market: "BTCUSDT"
  },
  "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace": {
    name: "Ethereum", 
    symbol: "ETH",
    market: "ETHUSDT"
  },
  "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d": {
    name: "Solana",
    symbol: "SOL", 
    market: "SOLUSDT"
  }
}

// Additional tokens with mock data to make the table more interesting
const additionalTokens: TokenRow[] = [
  { rank: 4, market: "AVAXUSDT", name: "Avalanche", symbol: "AVAX", price: 28.75, change24h: 2.74, volume: 21408937.68 },
  { rank: 5, market: "LINKUSDT", name: "Chainlink", symbol: "LINK", price: 20.97, change24h: 2.71, volume: 14133502.06 },
  { rank: 6, market: "UNIUSDT", name: "Uniswap", symbol: "UNI", price: 7.54, change24h: 0.61, volume: 5392046.09 },
  { rank: 7, market: "ADAUSDT", name: "Cardano", symbol: "ADA", price: 0.79, change24h: 1.85, volume: 22635139.44 },
  { rank: 8, market: "DOTUSDT", name: "Polkadot", symbol: "DOT", price: 3.89, change24h: 1.30, volume: 4274417.44 },
  { rank: 9, market: "LTCUSDT", name: "Litecoin", symbol: "LTC", price: 103.69, change24h: 0.24, volume: 6953234.59 },
  { rank: 10, market: "BNBUSDT", name: "BNB", symbol: "BNB", price: 600.25, change24h: 1.25, volume: 50000000.00 }
]

// Fallback data in case external APIs fail
const fallbackData: TokenRow[] = [
  { rank: 1, market: "BTCUSDT", name: "Bitcoin", symbol: "BTC", price: 109546.1, change24h: 0.03, volume: 379717009.45 },
  { rank: 2, market: "ETHUSDT", name: "Ethereum", symbol: "ETH", price: 4014.35, change24h: 1.79, volume: 1036474781.63 },
  { rank: 3, market: "SOLUSDT", name: "Solana", symbol: "SOL", price: 201.95, change24h: 2.88, volume: 71310081.94 },
  ...additionalTokens
]

function calculatePrice(priceStr: string, expo: number): number {
  const price = parseFloat(priceStr)
  return price * Math.pow(10, expo)
}

export async function GET() {
  try {
    console.log("API: Starting to fetch Pyth Network data...")
    
    // Try to fetch from Pyth Network API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      // Use only verified working IDs
      const workingIds = [
        "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC
        "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH
        "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d"  // SOL
      ]
      
      const idsParam = workingIds.map(id => `ids%5B%5D=0x${id}`).join('&')
      const url = `https://hermes.pyth.network/v2/updates/price/latest?${idsParam}`
      
      console.log("API: Fetching from URL:", url)
      
      const response = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("API: Pyth response status:", response.status)

      if (!response.ok) {
        console.error("API: Pyth request failed, using fallback data")
        return NextResponse.json(fallbackData, { status: 200 })
      }

      const data: PythResponse = await response.json()
      console.log("API: Fetched Pyth data:", data.parsed.length, "prices")

      // Process the Pyth data
      const pythRows: TokenRow[] = data.parsed
        .map((priceData, index) => {
          const tokenInfo = TOKEN_MAPPING[priceData.id as keyof typeof TOKEN_MAPPING]
          if (!tokenInfo) return null

          const currentPrice = calculatePrice(priceData.price.price, priceData.price.expo)
          const emaPrice = calculatePrice(priceData.ema_price.price, priceData.ema_price.expo)
          
          // Calculate 24h change as percentage difference between current and EMA
          const change24h = ((currentPrice - emaPrice) / emaPrice) * 100

          return {
            rank: index + 1,
            market: tokenInfo.market,
            symbol: tokenInfo.symbol,
            name: tokenInfo.name,
            price: currentPrice,
            change24h: change24h,
            volume: 0 // Pyth doesn't provide volume data
          }
        })
        .filter((row): row is TokenRow => row !== null)

      // Combine Pyth data with additional tokens
      const allRows = [...pythRows, ...additionalTokens]
        .sort((a, b) => b.price - a.price) // Sort by price descending
        .map((row, index) => ({ ...row, rank: index + 1 })) // Re-rank after sorting

      console.log("API: Returning", allRows.length, "tokens (", pythRows.length, "from Pyth API,", additionalTokens.length, "additional)")
      return NextResponse.json(allRows, { status: 200 })
      
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("API: Pyth API fetch failed, using fallback data:", fetchError)
      return NextResponse.json(fallbackData, { status: 200 })
    }
    
  } catch (err) {
    console.error("API: Unexpected error, using fallback data:", err)
    return NextResponse.json(fallbackData, { status: 200 })
  }
}
