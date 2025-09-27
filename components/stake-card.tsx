"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ChevronDown, Lock, TrendingUp } from "lucide-react"
import { useState } from "react"

export function StakeCard({ className }: { className?: string }) {
  const [stakeToken, setStakeToken] = useState("ETH")
  const [stakeAmount, setStakeAmount] = useState("")
  const [stakeDuration, setStakeDuration] = useState<string | null>(null)

  return (
    <Card
      className={cn(
        "w-full max-w-md rounded-xl border border-white/10 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40",
        className,
      )}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="size-5 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Stake Tokens</div>
        </div>

        <div className="text-sm text-muted-foreground mb-2">Amount to Stake</div>
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-secondary/10 px-3 py-3">
          <Input
            type="number"
            placeholder="0"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="bg-transparent border-0 text-3xl leading-none p-0 focus-visible:ring-0"
          />
          <Select value={stakeToken} onValueChange={setStakeToken}>
            <SelectTrigger className="w-[120px] justify-between bg-secondary/30 border-secondary">
              <SelectValue placeholder="Token" />
              <ChevronDown className="size-4 opacity-70" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="WBTC">WBTC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground mb-2 mt-4">Stake Duration</div>
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-secondary/10 px-3 py-3">
          <Select value={stakeDuration ?? ""} onValueChange={setStakeDuration}>
            <SelectTrigger className="w-full justify-between bg-secondary/30 border-secondary">
              <SelectValue placeholder="Select duration" />
              <ChevronDown className="size-4 opacity-70" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 days (5% APY)</SelectItem>
              <SelectItem value="90">90 days (8% APY)</SelectItem>
              <SelectItem value="180">180 days (12% APY)</SelectItem>
              <SelectItem value="365">365 days (18% APY)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {stakeAmount && stakeDuration && (
          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 text-sm text-green-400">
              <TrendingUp className="size-4" />
              <span>Estimated Rewards: {((parseFloat(stakeAmount) * parseFloat(stakeDuration) * 0.18) / 365).toFixed(4)} {stakeToken}</span>
            </div>
          </div>
        )}

        <Button
          className="mt-4 w-full h-11 text-base font-medium"
          style={{ backgroundColor: "var(--color-cta)", color: "var(--color-primary-foreground)" }}
          disabled={!stakeAmount || !stakeDuration}
        >
          Stake Tokens
        </Button>
      </div>
    </Card>
  )
}
