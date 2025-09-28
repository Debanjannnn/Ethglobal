import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { 
  ROOT_STACK_POOL, 
  SEPOLIA_POOL, 
  ROOTSTACK_POOL_ABI, 
  SEPOLIA_POOL_ABI 
} from '@/lib/contracts';
import { getSwapQuote, SwapQuote } from '@/lib/priceApi';

export interface SwapParams {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  fromChainId: number;
  toChainId: number;
  recipient: string;
}

export function useCrossChainSwap() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const getQuote = useCallback(async (params: Omit<SwapParams, 'recipient'>) => {
    setIsLoadingQuote(true);
    try {
      const swapQuote = await getSwapQuote(
        params.fromToken,
        params.toToken,
        params.fromAmount,
        params.fromChainId,
        params.toChainId
      );
      setQuote(swapQuote);
      return swapQuote;
    } catch (err) {
      console.error('Failed to get quote:', err);
      throw err;
    } finally {
      setIsLoadingQuote(false);
    }
  }, []);

  const executeSwap = useCallback(async (params: SwapParams) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    const { fromChainId, toChainId, fromAmount, recipient } = params;
    
    try {
      // For Rootstack to Sepolia swap
      if (fromChainId === 31 && toChainId === 11155111) {
        // Step 1: Send tRBTC from user's wallet to relayer
        const txHash = await writeContract({
          address: ROOT_STACK_POOL as `0x${string}`,
          abi: ROOTSTACK_POOL_ABI,
          functionName: 'deposit',
          args: [BigInt(toChainId), recipient as `0x${string}`],
          value: parseEther(fromAmount),
        });

        console.log('Rootstock transaction submitted:', txHash);

        // Wait a bit for the transaction to be processed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Step 2: Call relayer API to send ETH to recipient
        const relayerResponse = await fetch('/api/relayer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient,
            amount: fromAmount,
            transferId: txHash, // Use transaction hash as transferId
            action: 'swap'
          }),
        });

        const relayerResult = await relayerResponse.json();
        
        if (!relayerResult.success) {
          throw new Error(`Relayer failed: ${relayerResult.error}`);
        }
        
        console.log('Relayer response:', relayerResult);
        return { 
          rootstackTx: txHash, 
          sepoliaTx: relayerResult.txHash || relayerResult.mintTxHash 
        };
      } else {
        throw new Error('Unsupported chain pair');
      }
    } catch (err) {
      console.error('Swap execution failed:', err);
      throw err;
    }
  }, [address, writeContract]);

  const releaseFunds = useCallback(async (
    transferId: string,
    recipient: string,
    amount: string,
    chainId: number
  ) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      if (chainId === 11155111) {
        // Call release function on Sepolia pool
        await writeContract({
          address: SEPOLIA_POOL as `0x${string}`,
          abi: SEPOLIA_POOL_ABI,
          functionName: 'release',
          args: [
            transferId as `0x${string}`,
            recipient as `0x${string}`,
            parseEther(amount)
          ],
        });
      } else {
        throw new Error('Unsupported chain for release');
      }
    } catch (err) {
      console.error('Release failed:', err);
      throw err;
    }
  }, [address, writeContract]);

  return {
    getQuote,
    executeSwap,
    releaseFunds,
    quote,
    isLoadingQuote,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
