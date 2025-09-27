"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ChevronDown, ArrowDown, RefreshCw, Zap } from "lucide-react"
import { useState } from "react"

export function BridgeCard({ className }: { className?: string }) {
  const [fromChain, setFromChain] = useState("Ethereum")
  const [toChain, setToChain] = useState<string | null>(null)
  const [token, setToken] = useState("ETH")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleBridge = () => {
    if (fromChain && toChain && fromAmount && token) {
      setIsLoading(true)
      // Simulate bridge calculation
      setTimeout(() => {
        setToAmount((parseFloat(fromAmount) * 0.998).toFixed(6))
        setIsLoading(false)
      }, 1500)
    }
  }

  const handleReverse = () => {
    const tempChain = fromChain
    setFromChain(toChain || "")
    setToChain(tempChain)
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
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
          <h2 className="text-xl font-semibold">Bridge</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReverse}
            className="p-2 hover:bg-secondary/20"
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mb-3">From</div>
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-secondary/10 px-4 py-4">
          <Input
            type="number"
            placeholder="0"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="bg-transparent border-0 text-4xl leading-none p-0 focus-visible:ring-0"
          />
          <div className="flex flex-col gap-2">
            <Select value={token} onValueChange={setToken}>
              <SelectTrigger className="w-[120px] justify-between bg-secondary/30 border-secondary rounded-lg">
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
            <Select value={fromChain} onValueChange={setFromChain}>
              <SelectTrigger className="w-[120px] justify-between bg-secondary/30 border-secondary rounded-lg">
                <SelectValue placeholder="Chain" />
                <ChevronDown className="size-4 opacity-70" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Polygon">Polygon</SelectItem>
                <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                <SelectItem value="Optimism">Optimism</SelectItem>
                <SelectItem value="Base">Base</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

        <div className="text-sm text-muted-foreground mb-3">To</div>
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-secondary/10 px-4 py-4">
          <Input
            type="number"
            placeholder="0"
            value={toAmount}
            onChange={(e) => setToAmount(e.target.value)}
            className="bg-transparent border-0 text-4xl leading-none p-0 focus-visible:ring-0"
          />
          <div className="flex flex-col gap-2">
            <div className="w-[120px] px-3 py-2 bg-secondary/30 border border-secondary rounded-lg text-sm">
              {token}
            </div>
            <Select value={toChain ?? ""} onValueChange={setToChain}>
              <SelectTrigger className="w-[120px] justify-between bg-secondary/30 border-secondary rounded-lg">
                <SelectValue placeholder="Select chain" />
                <ChevronDown className="size-4 opacity-70" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Polygon">Polygon</SelectItem>
                <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                <SelectItem value="Optimism">Optimism</SelectItem>
                <SelectItem value="Base">Base</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {fromAmount && toChain && (
          <div className="mt-4 p-3 rounded-lg bg-secondary/20 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bridge Fee</span>
              <span>0.2%</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Estimated Time</span>
              <span>2-5 minutes</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleBridge}
          disabled={!fromChain || !toChain || !fromAmount || isLoading}
          className="mt-6 w-full h-12 text-lg font-medium bg-red-500 hover:bg-red-600 text-white rounded-4xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Zap className="size-4 animate-pulse" />
              Bridging...
            </div>
          ) : (
            "Bridge"
          )}
        </Button>
      </div>
    </Card>
  )
}
