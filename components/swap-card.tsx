"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ChevronDown, ArrowDown, RefreshCw } from "lucide-react"
import { useState } from "react"

export function SwapCard({ className }: { className?: string }) {
  const [sellToken, setSellToken] = useState("ETH")
  const [buyToken, setBuyToken] = useState<string | null>(null)
  const [sellAmount, setSellAmount] = useState("")
  const [buyAmount, setBuyAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSwap = () => {
    if (sellToken && buyToken && sellAmount) {
      setIsLoading(true)
      // Simulate swap calculation
      setTimeout(() => {
        setBuyAmount((parseFloat(sellAmount) * 0.95).toFixed(6))
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleReverse = () => {
    const tempToken = sellToken
    const tempAmount = sellAmount
    setSellToken(buyToken || "")
    setBuyToken(tempToken)
    setSellAmount(buyAmount)
    setBuyAmount(tempAmount)
  }

  return (
    <Card
      className={cn(
        "w-full max-w-lg rounded-2xl border border-white/10 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40",
        className,
      )}
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Swap</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReverse}
            className="p-2 hover:bg-secondary/20"
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mb-3">You pay</div>
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-secondary/10 px-4 py-4">
          <Input
            type="number"
            placeholder="0"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            className="bg-transparent border-0 text-4xl leading-none p-0 focus-visible:ring-0"
          />
          <Select value={sellToken} onValueChange={setSellToken}>
            <SelectTrigger className="w-[140px] justify-between bg-secondary/30 border-secondary rounded-lg">
              <SelectValue placeholder="Token" />
              <ChevronDown className="size-4 opacity-70" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="WBTC">WBTC</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center my-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReverse}
            className="rounded-full border border-white/10 bg-background/60 p-2 hover:bg-background/80"
          >
            <ArrowDown className="size-6" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mb-3">You receive</div>
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-secondary/10 px-4 py-4">
          <Input
            type="number"
            placeholder="0"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
            className="bg-transparent border-0 text-4xl leading-none p-0 focus-visible:ring-0"
          />
          <Select value={buyToken ?? ""} onValueChange={setBuyToken}>
            <SelectTrigger className="w-[180px] justify-between bg-secondary/30 border-secondary rounded-lg">
              <SelectValue placeholder="Select token" />
              <ChevronDown className="size-4 opacity-70" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="WBTC">WBTC</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sellAmount && buyToken && (
          <div className="mt-4 p-3 rounded-lg bg-secondary/20 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span>1 {sellToken} = 0.95 {buyToken}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Fee</span>
              <span>0.05%</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleSwap}
          disabled={!sellToken || !buyToken || !sellAmount || isLoading}
          className="mt-6 w-full h-12 text-lg font-medium bg-red-500 hover:bg-red-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Calculating..." : "Swap"}
        </Button>
      </div>
    </Card>
  )
}
