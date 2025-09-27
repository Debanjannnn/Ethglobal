"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ChevronDown, ArrowDown, RefreshCw, Zap, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useBridge } from "@/hooks/useBridge"
import { useAccount, useConnect, useDisconnect } from "wagmi"

export function BridgeCard({ className }: { className?: string }) {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  
  const {
    isLoading,
    isConfirmed,
    txHash,
    mintTxHash,
    error,
    isOnRootstock,
    isOnSepolia,
    availableBalance,
    tokenSymbol,
    networkName,
    targetNetwork,
    bridgeFromRootstock,
    bridgeFromSepolia,
  } = useBridge()

  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")

  const handleBridge = async () => {
    if (!fromAmount || !address) return

    if (isOnRootstock) {
      await bridgeFromRootstock(fromAmount)
    } else if (isOnSepolia) {
      await bridgeFromSepolia(fromAmount)
    }
  }

  const handleMaxAmount = () => {
    setFromAmount(parseFloat(availableBalance).toFixed(6))
  }

  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] })
    }
  }

  if (!isConnected) {
    return (
      <Card
        className={cn(
          "w-full max-w-lg rounded-2xl border border-white/10 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40",
          className,
        )}
      >
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to bridge tRBTC between Rootstock and Sepolia
          </p>
          <Button onClick={handleConnect} className="w-full">
            Connect Wallet
          </Button>
        </div>
      </Card>
    )
  }

  if (!isOnRootstock && !isOnSepolia) {
    return (
      <Card
        className={cn(
          "w-full max-w-lg rounded-2xl border border-white/10 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40",
          className,
        )}
      >
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Wrong Network</h2>
          <p className="text-muted-foreground mb-6">
            Please switch to Rootstock Testnet or Sepolia to use the bridge
          </p>
          <Button onClick={() => disconnect()} variant="outline">
            Disconnect
          </Button>
        </div>
      </Card>
    )
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
          <h2 className="text-xl font-semibold">Bridge {tokenSymbol}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {networkName} → {targetNetwork}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnect()}
              className="p-2 hover:bg-secondary/20"
            >
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Available Balance:</span>
            <span className="font-medium">
              {parseFloat(availableBalance).toFixed(6)} {tokenSymbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Network:</span>
            <span className="font-medium">{networkName}</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-3">Amount to Bridge</div>
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-secondary/10 px-4 py-4">
          <Input
            type="number"
            placeholder="0.0"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            step="0.000001"
            min="0"
            max={availableBalance}
            className="bg-transparent border-0 text-4xl leading-none p-0 focus-visible:ring-0"
          />
          <div className="flex flex-col gap-2">
            <div className="w-[120px] px-3 py-2 bg-secondary/30 border border-secondary rounded-lg text-sm">
              {tokenSymbol}
            </div>
            <Button
              onClick={handleMaxAmount}
              className="w-[120px] text-xs bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              MAX
            </Button>
          </div>
        </div>

        <div className="flex justify-center my-3">
          <div className="rounded-full border border-white/10 bg-background/60 p-2">
            <ArrowDown className="size-6" />
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-3">You will receive</div>
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-secondary/10 px-4 py-4">
          <div className="text-4xl leading-none font-medium">
            {fromAmount ? (parseFloat(fromAmount) * 0.998).toFixed(6) : "0.0"}
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-[120px] px-3 py-2 bg-secondary/30 border border-secondary rounded-lg text-sm">
              {isOnRootstock ? "wRBTC" : "tRBTC"}
            </div>
            <div className="w-[120px] px-3 py-2 bg-secondary/30 border border-secondary rounded-lg text-sm">
              {targetNetwork}
            </div>
          </div>
        </div>

        {fromAmount && (
          <div className="mt-4 p-3 rounded-lg bg-secondary/20 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bridge Fee</span>
              <span>0.2%</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Estimated Time</span>
              <span>{isOnRootstock ? "2-5 minutes" : "Not Available"}</span>
            </div>
          </div>
        )}

        {isOnSepolia && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
            <p className="text-blue-800">
              <strong>Note:</strong> Bridge from Sepolia to Rootstock requires relayer processing.
              Currently, only Rootstock → Sepolia bridging is available.
            </p>
          </div>
        )}

        {isOnRootstock && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm">
            <p className="text-green-800">
              <strong>✨ Automatic Minting:</strong> When you bridge tRBTC, wRBTC tokens will be automatically
              minted on Sepolia for the same address within a few seconds.
            </p>
          </div>
        )}

        <Button
          onClick={handleBridge}
          disabled={!fromAmount || isLoading || parseFloat(fromAmount) <= 0 || parseFloat(fromAmount) > parseFloat(availableBalance) || isOnSepolia}
          className="mt-6 w-full h-12 text-lg font-medium bg-red-500 hover:bg-red-600 text-white rounded-4xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Zap className="size-4 animate-pulse" />
              Bridging...
            </div>
          ) : isOnRootstock ? (
            `Bridge ${fromAmount || '0'} ${tokenSymbol} to ${targetNetwork}`
          ) : (
            'Bridge Not Available (Relayer Only)'
          )}
        </Button>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm">
            <p className="text-red-800">
              <strong>Error:</strong> {error.message}
            </p>
          </div>
        )}

        {isConfirmed && mintTxHash && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm">
            <p className="text-green-800">
              <strong>✅ Bridge Successful!</strong> wRBTC tokens have been automatically minted.
            </p>
            <div className="mt-2">
              <a
                href={`https://sepolia.etherscan.io/tx/${mintTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 text-xs underline flex items-center gap-1"
              >
                View Mint Transaction <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        )}

        {txHash && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
            <p className="text-blue-800">
              <strong>Bridge Transaction Hash:</strong>
            </p>
            <code className="break-all text-xs">{txHash}</code>
            <div className="mt-2">
              <a
                href={`https://explorer.testnet.rsk.co/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs underline flex items-center gap-1"
              >
                View Bridge Transaction <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

