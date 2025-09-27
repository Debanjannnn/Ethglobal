"use client";

import { useState } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  WRBTC_SEPOLIA_ADDRESS,
  ROOTSTOCK_BRIDGE_ADDRESS,
  WRBTC_ABI,
  ROOTSTOCK_BRIDGE_ABI,
} from "@/lib/contracts";
import { rootstockTestnet, sepolia } from "@/lib/config";

export function useBridge() {
  const { address, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [mintTxHash, setMintTxHash] = useState<string | null>(null);

  const { data: nativeBalance } = useBalance({
    address,
  });

  const { data: wRBTCBalance } = useReadContract({
    address: WRBTC_SEPOLIA_ADDRESS,
    abi: WRBTC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: sepolia.id,
  });

  const { writeContract, data: hash, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const isOnRootstock = chainId === rootstockTestnet.id;
  const isOnSepolia = chainId === sepolia.id;

  const bridgeFromRootstock = async (amount: string) => {
    if (!amount || !address) return;

    setIsLoading(true);
    setTxHash(null);
    setMintTxHash(null);

    try {
      // First, call the bridge function on Rootstock
      writeContract({
        address: ROOTSTOCK_BRIDGE_ADDRESS,
        abi: ROOTSTOCK_BRIDGE_ABI,
        functionName: "bridge",
        args: [],
        chainId: rootstockTestnet.id,
        value: parseEther(amount), // Send native RBTC as msg.value
      });

      // Wait a moment for the transaction to be mined
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Then immediately mint tokens on Sepolia via API
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: address,
          amount: parseEther(amount).toString(),
        }),
      });

      const mintResult = await response.json();

      if (mintResult.success) {
        console.log("Tokens minted successfully:", mintResult.txHash);
        setMintTxHash(mintResult.txHash);
      } else {
        console.error("Failed to mint tokens:", mintResult.error);
      }
    } catch (err) {
      console.error("Bridge transaction failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const bridgeFromSepolia = async (amount: string) => {
    if (!amount || !address) return;

    // Note: Sepolia Bridge doesn't have a user-facing bridge function
    // Only the relayer can mint tokens after seeing a bridge event from Rootstock
    // This is just a placeholder - in reality, users can't bridge from Sepolia to Rootstock
    // through this contract directly

    alert(
      "Bridge from Sepolia to Rootstock is not available through this interface. Only the relayer can process cross-chain transactions."
    );
  };

  const getAvailableBalance = () => {
    if (isOnRootstock) {
      return nativeBalance ? formatEther(nativeBalance.value) : "0";
    } else if (isOnSepolia) {
      return wRBTCBalance ? formatEther(wRBTCBalance) : "0";
    }
    return "0";
  };

  const getTokenSymbol = () => {
    if (isOnRootstock) return "tRBTC";
    if (isOnSepolia) return "wRBTC";
    return "";
  };

  const getNetworkName = () => {
    if (isOnRootstock) return "Rootstock Testnet";
    if (isOnSepolia) return "Sepolia";
    return "Unknown";
  };

  const getTargetNetwork = () => {
    if (isOnRootstock) return "Sepolia";
    if (isOnSepolia) return "Rootstock";
    return "";
  };

  return {
    address,
    chainId,
    isLoading: isLoading || isConfirming,
    isConfirmed,
    txHash: hash,
    mintTxHash,
    error,
    isOnRootstock,
    isOnSepolia,
    availableBalance: getAvailableBalance(),
    tokenSymbol: getTokenSymbol(),
    networkName: getNetworkName(),
    targetNetwork: getTargetNetwork(),
    bridgeFromRootstock,
    bridgeFromSepolia,
  };
}
