"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useAccount } from "wagmi"
import { usePocketProtocol } from "@/hooks/usePocketProtocol"
import { getChainName } from "@/lib/priceApi"

export function StakeCard({ className }: { className?: string }) {
  const { address } = useAccount();
  const {
    contractAddress,
    chainId,
    userInfo,
    poolInfo,
    stake,
    withdraw,
    claimRewards,
    emergencyWithdraw,
    isPending,
    isConfirming,
    isSuccess,
    error,
  } = usePocketProtocol();

  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    try {
      await stake(stakeAmount);
      setStakeAmount("");
    } catch (err) {
      console.error("Stake failed:", err);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    try {
      await withdraw(withdrawAmount);
      setWithdrawAmount("");
    } catch (err) {
      console.error("Withdraw failed:", err);
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimRewards();
    } catch (err) {
      console.error("Claim rewards failed:", err);
    }
  };

  const handleEmergencyWithdraw = async () => {
    try {
      await emergencyWithdraw();
    } catch (err) {
      console.error("Emergency withdraw failed:", err);
    }
  };

  const isLocked = userInfo && parseInt(userInfo.lockUntil) > Date.now() / 1000;
  const canWithdraw = userInfo && parseFloat(userInfo.amount) > 0 && !isLocked;

  return (
    <Card
      className={cn(
        "w-full max-w-lg rounded-2xl border border-white/10 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40",
        className,
      )}
    >
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Pocket Protocol Staking</h2>
          <p className="text-sm text-muted-foreground">
            Stake RBTC • Earn RIFF rewards • Cross-chain ETH minting
          </p>
        </div>

        {/* Pool Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-secondary/20">
          <div>
            <div className="text-sm text-muted-foreground">Fee</div>
            <div className="font-semibold">{poolInfo?.feeBps || '0'} bps</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Emergency Penalty</div>
            <div className="font-semibold">{poolInfo?.emergencyPenalty || '0'}%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">RIFF Token</div>
            <div className="font-semibold text-xs">{poolInfo?.riffToken?.slice(0, 8)}...</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Relayer</div>
            <div className="font-semibold text-xs">{poolInfo?.relayer?.slice(0, 8)}...</div>
          </div>
        </div>

        {/* User Stats */}
        {userInfo && parseFloat(userInfo.amount) > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-blue-500/20">
            <div className="text-sm text-blue-400 mb-2">Your Stake</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Staked RBTC</div>
                <div className="font-semibold">{parseFloat(userInfo.amount).toFixed(4)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Reward</div>
                <div className="font-semibold text-green-400">
                  {new Date(parseInt(userInfo.lastRewardAt) * 1000).toLocaleDateString()}
                </div>
              </div>
            </div>
            {isLocked && (
              <div className="mt-2 text-sm text-orange-400">
                🔒 Locked until {new Date(parseInt(userInfo.lockUntil) * 1000).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        {/* Stake Section */}
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-3">Stake RBTC</div>
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-secondary/10 px-4 py-4">
            <Input
              type="number"
              placeholder="0"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="bg-transparent border-0 text-lg leading-none p-0 focus-visible:ring-0"
            />
            <div className="text-sm text-muted-foreground">RBTC</div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Deposit RBTC to earn RIFF rewards. Relayer will mint equivalent Sepolia ETH.
          </div>
          <Button
            onClick={handleStake}
            disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isPending || isConfirming}
            className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {isPending ? "Confirming..." : isConfirming ? "Processing..." : "Stake"}
          </Button>
        </div>

        {/* Withdraw Section */}
        {canWithdraw && (
          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-3">Withdraw</div>
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-secondary/10 px-4 py-4">
              <Input
                type="number"
                placeholder="0"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="bg-transparent border-0 text-lg leading-none p-0 focus-visible:ring-0"
              />
              <div className="text-sm text-muted-foreground">
                {chainId === 31 ? 'tRBTC' : 'ETH'}
              </div>
            </div>
            <Button
              onClick={handleWithdraw}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || isPending || isConfirming}
              className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isPending ? "Confirming..." : isConfirming ? "Processing..." : "Withdraw"}
            </Button>
          </div>
        )}

        {/* Claim Rewards */}
        {userInfo && parseFloat(userInfo.amount) > 0 && (
          <div className="mb-6">
            <Button
              onClick={handleClaimRewards}
              disabled={isPending || isConfirming}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isPending ? "Confirming..." : isConfirming ? "Processing..." : "Claim RIFF Rewards"}
            </Button>
          </div>
        )}

        {/* Emergency Withdraw */}
        {isLocked && parseFloat(userInfo?.amount || '0') > 0 && (
          <div className="mb-6">
            <Button
              onClick={handleEmergencyWithdraw}
              disabled={isPending || isConfirming}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              {isPending ? "Confirming..." : isConfirming ? "Processing..." : "Emergency Withdraw (Penalty)"}
            </Button>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
            {error.message}
          </div>
        )}

        {isSuccess && (
          <div className="mt-4 p-3 rounded-lg bg-green-500/20 text-green-400 text-sm">
            Transaction completed successfully!
          </div>
        )}
      </div>
    </Card>
  )
}