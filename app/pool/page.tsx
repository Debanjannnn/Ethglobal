import { Navbar } from "@/components/navbar";
import { BokehBackground } from "@/components/ui/bokeh-background";
import { StakeCard } from "@/components/stake-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users } from "lucide-react";

const pools = [
  {
    id: 1,
    name: "ETH/USDC Pool",
    tokens: ["ETH", "USDC"],
    tvl: "2.4M",
    apy: "12.5%",
    volume24h: "156K",
    fees: "0.3%"
  },
  {
    id: 2,
    name: "WBTC/ETH Pool",
    tokens: ["WBTC", "ETH"],
    tvl: "1.8M",
    apy: "15.2%",
    volume24h: "89K",
    fees: "0.3%"
  },
  {
    id: 3,
    name: "USDC/USDT Pool",
    tokens: ["USDC", "USDT"],
    tvl: "3.2M",
    apy: "8.7%",
    volume24h: "234K",
    fees: "0.05%"
  },
  {
    id: 4,
    name: "ETH/DAI Pool",
    tokens: ["ETH", "DAI"],
    tvl: "1.1M",
    apy: "18.3%",
    volume24h: "67K",
    fees: "0.3%"
  }
];

export default function PoolPage() {
  return (
    <main className="min-h-[100svh] relative">
      <Navbar />
      <BokehBackground />

      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:pt-28">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-pretty text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
            {"Liquidity Pools"}
          </h1>
          <p className="mt-6 max-w-xl text-center text-muted-foreground">
            {"Provide liquidity to earn fees and rewards from trading activity."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pools List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Available Pools</h2>
            {pools.map((pool) => (
              <Card
                key={pool.id}
                className="p-6 border border-white/10 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40 hover:bg-card/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {pool.tokens.map((token) => (
                        <div
                          key={token}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-semibold text-white border-2 border-background"
                        >
                          {token}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-semibold">{pool.name}</h3>
                      <p className="text-sm text-muted-foreground">Pool #{pool.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">{pool.apy}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">APY</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-2xl font-semibold">${pool.tvl}</p>
                    <p className="text-xs text-muted-foreground">TVL</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold">${pool.volume24h}</p>
                    <p className="text-xs text-muted-foreground">24h Volume</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold">{pool.fees}</p>
                    <p className="text-xs text-muted-foreground">Fees</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" style={{ backgroundColor: "var(--color-brand)", color: "oklch(0.985 0 0)" }}>
                    Add Liquidity
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Stake Component */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Stake Tokens</h2>
            <StakeCard />
            
            <Card className="p-6 border border-white/10 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Staking Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Staked</span>
                  <span className="font-semibold">$12.4M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Stakers</span>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. APY</span>
                  <span className="font-semibold text-green-400">14.2%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
