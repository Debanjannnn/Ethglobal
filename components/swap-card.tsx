"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ChevronDown, ArrowDown, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { useAccount, useChainId } from "wagmi"
import { useCrossChainSwap } from "@/hooks/useCrossChainSwap"
import { getChainNativeToken, getChainName } from "@/lib/priceApi"

export function SwapCard({ className }: { className?: string }) {
  const { address } = useAccount()
  const chainId = useChainId()
  const { getQuote, executeSwap, quote, isLoadingQuote, isPending, isConfirming, isSuccess, error } = useCrossChainSwap()
  
  const [sellToken, setSellToken] = useState("ETH")
  const [buyToken, setBuyToken] = useState<string | null>(null)
  const [sellAmount, setSellAmount] = useState("")
  const [buyAmount, setBuyAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [swapError, setSwapError] = useState<string | null>(null)
  const [swapResult, setSwapResult] = useState<{rootstackTx: string, sepoliaTx: string} | null>(null)

  // Update token options based on current chain
  useEffect(() => {
    const nativeToken = getChainNativeToken(chainId)
    if (chainId === 31) { // Rootstock
      setSellToken(nativeToken)
      setBuyToken("ETH") // Default to ETH for Sepolia
    } else if (chainId === 11155111) { // Sepolia
      setSellToken(nativeToken)
      setBuyToken("tRBTC") // Default to tRBTC for Rootstock
    }
  }, [chainId])

  // Fetch quote when amount or tokens change
  useEffect(() => {
    if (sellToken && buyToken && sellAmount && parseFloat(sellAmount) > 0) {
      const fromChainId = chainId
      const toChainId = chainId === 31 ? 11155111 : 31 // Opposite chain
      
      getQuote({
        fromToken: sellToken,
        toToken: buyToken,
        fromAmount: sellAmount,
        fromChainId,
        toChainId
      }).then((quote) => {
        setBuyAmount(quote.toAmount)
        setSwapError(null)
      }).catch((err) => {
        setSwapError(err.message)
        setBuyAmount("")
      })
    } else {
      setBuyAmount("")
      setSwapError(null)
    }
  }, [sellToken, buyToken, sellAmount, chainId, getQuote])

  const handleSwap = async () => {
    if (!address) {
      setSwapError("Please connect your wallet")
      return
    }

    if (sellToken && buyToken && sellAmount) {
      setIsLoading(true)
      setSwapError(null)
      setSwapResult(null)
      
      try {
        const fromChainId = chainId
        const toChainId = chainId === 31 ? 11155111 : 31
        
        const result = await executeSwap({
          fromToken: sellToken,
          toToken: buyToken,
          fromAmount: sellAmount,
          fromChainId,
          toChainId,
          recipient: address
        })
        
        if (result) {
          setSwapResult(result)
        }
      } catch (err: any) {
        setSwapError(err.message || "Swap failed")
      } finally {
        setIsLoading(false)
      }
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
          <div>
            <h2 className="text-xl font-semibold">Cross-Chain Swap</h2>
            <p className="text-sm text-muted-foreground">
              {getChainName(chainId)} → {getChainName(chainId === 31 ? 11155111 : 31)}
            </p>
          </div>
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
              <SelectItem value="tRBTC">tRBTC (Rootstock)</SelectItem>
              <SelectItem value="ETH">ETH (Sepolia)</SelectItem>
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
              <SelectItem value="tRBTC">tRBTC (Rootstock)</SelectItem>
              <SelectItem value="ETH">ETH (Sepolia)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sellAmount && buyToken && quote && (
          <div className="mt-4 p-3 rounded-lg bg-secondary/20 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span>1 {sellToken} = {quote.rate.toFixed(6)} {buyToken}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Fee</span>
              <span>{quote.fee}%</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Estimated Gas</span>
              <span>{quote.estimatedGas} ETH</span>
            </div>
          </div>
        )}

        {swapError && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
            {swapError}
          </div>
        )}

        {isSuccess && (
          <div className="mt-4 p-3 rounded-lg bg-green-500/20 text-green-400 text-sm">
            Swap completed successfully! Check your wallet for the transaction.
          </div>
        )}

        {swapResult && (
          <div className="mt-4 p-3 rounded-lg bg-blue-500/20 text-blue-400 text-sm">
            <div className="font-semibold mb-2">Cross-Chain Swap Complete!</div>
            <div className="space-y-1 text-xs">
              <div>Rootstack TX: <a href={`https://explorer.testnet.rsk.co/tx/${swapResult.rootstackTx}`} target="_blank" rel="noopener noreferrer" className="underline">{swapResult.rootstackTx.slice(0, 10)}...</a></div>
              <div>Sepolia TX: <a href={`https://sepolia.etherscan.io/tx/${swapResult.sepoliaTx}`} target="_blank" rel="noopener noreferrer" className="underline">{swapResult.sepoliaTx.slice(0, 10)}...</a></div>
            </div>
          </div>
        )}

        <Button
          onClick={handleSwap}
          disabled={!sellToken || !buyToken || !sellAmount || isLoading || isLoadingQuote || isPending || isConfirming || !address}
          className="mt-6 w-full h-12 text-lg font-medium bg-red-500 hover:bg-red-600 text-white rounded-4xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingQuote ? "Getting quote..." : 
           isPending ? "Confirming..." : 
           isConfirming ? "Processing..." : 
           isLoading ? "Calculating..." : 
           !address ? "Connect Wallet" : 
           "Cross-Chain Swap"}
        </Button>
      </div>
    </Card>
  )
}
