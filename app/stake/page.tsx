import { Navbar } from "@/components/navbar";
import { BokehBackground } from "@/components/ui/bokeh-background";
import { StakeCard } from "@/components/stake-card";

export default function StakePage() {
  return (
    <main className="min-h-[100svh] relative">
      <Navbar />

      <BokehBackground />

      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:pt-28">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-pretty text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
            {"Stake RBTC,"}
            <br className="hidden sm:block" />
            {"Earn RIFF."}
          </h1>

          <div className="mt-8">
            <StakeCard />
          </div>

          <p className="mt-6 max-w-xl text-center text-muted-foreground">
            {"Stake your RBTC to earn RIFF rewards. Our relayer automatically mints equivalent Sepolia ETH for cross-chain liquidity."}
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="p-6 rounded-xl border border-white/10 bg-card/50 backdrop-blur">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold mb-2">Secure Staking</h3>
              <p className="text-sm text-muted-foreground">
                Your RBTC is locked in a secure smart contract with time-based rewards.
              </p>
            </div>
            
            <div className="p-6 rounded-xl border border-white/10 bg-card/50 backdrop-blur">
              <div className="text-2xl mb-2">🌉</div>
              <h3 className="font-semibold mb-2">Cross-Chain</h3>
              <p className="text-sm text-muted-foreground">
                Automatic ETH minting on Sepolia when you stake, powered by our relayer.
              </p>
            </div>
            
            <div className="p-6 rounded-xl border border-white/10 bg-card/50 backdrop-blur">
              <div className="text-2xl mb-2">🎁</div>
              <h3 className="font-semibold mb-2">RIFF Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Earn RIFF tokens as rewards for participating in the protocol.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
