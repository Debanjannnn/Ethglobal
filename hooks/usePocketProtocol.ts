import { useState, useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { POCKET_PROTOCOL_ABI, POCKET_PROTOCOL_SEPOLIA, POCKET_PROTOCOL_ROOTSTOCK } from '@/lib/contracts';

export interface UserStakeInfo {
  amount: string;
  lastRewardAt: string;
  lockUntil: string;
}

export interface PoolInfo {
  feeBps: string;
  emergencyPenalty: string;
  relayer: string;
  riffToken: string;
}

export function usePocketProtocol() {
  const { address, chainId } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });


  // Get contract address based on current chain
  const contractAddress = chainId === 11155111 ? POCKET_PROTOCOL_SEPOLIA : POCKET_PROTOCOL_ROOTSTOCK;

  // Read user info
  const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: POCKET_PROTOCOL_ABI,
    functionName: 'userInfo',
    args: address ? [address] : undefined,
  });

  // Read pool info
  const { data: feeBps } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: POCKET_PROTOCOL_ABI,
    functionName: 'feeBps',
  });

  const { data: emergencyPenalty } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: POCKET_PROTOCOL_ABI,
    functionName: 'EMERGENCY_PENALTY',
  });

  const { data: relayer } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: POCKET_PROTOCOL_ABI,
    functionName: 'relayer',
  });

  const { data: riffToken } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: POCKET_PROTOCOL_ABI,
    functionName: 'riffToken',
  });

  // Stake function - deposit RBTC for RIFF rewards
  const stake = useCallback(async (amount: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      // First, call the deposit function on the Pocket Protocol contract
      const txHash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: POCKET_PROTOCOL_ABI,
        functionName: 'deposit',
        args: [BigInt(11155111)], // Sepolia chain ID for cross-chain transfer
        value: parseEther(amount),
      });

      // Wait for the transaction to be confirmed
      // Note: In a real implementation, you'd want to listen for the CrossChainTransfer event
      // and extract the transferId from the event logs
      
      // For now, we'll generate a transferId based on the transaction hash
      const transferId = txHash; // In production, extract from event logs
      
      // Call the relayer API to process the stake and mint Sepolia ETH
      const relayerResponse = await fetch('/api/relayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: address,
          amount: amount,
          transferId: transferId,
          action: 'stake'
        }),
      });

      const relayerResult = await relayerResponse.json();
      
      if (!relayerResult.success) {
        throw new Error(`Relayer failed: ${relayerResult.error}`);
      }

      console.log('Stake processed successfully:', relayerResult);
      return txHash;
    } catch (err) {
      console.error('Stake failed:', err);
      throw err;
    }
  }, [address, writeContract, contractAddress]);

  // Withdraw function
  const withdraw = useCallback(async (amount: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: POCKET_PROTOCOL_ABI,
        functionName: 'withdraw',
        args: [parseEther(amount)],
      });
    } catch (err) {
      console.error('Withdraw failed:', err);
      throw err;
    }
  }, [address, writeContract, contractAddress]);

  // Claim rewards function - uses API to call contract via relayer
  const claimRewards = useCallback(async () => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      // Call the claim-riff API which uses the relayer to claim rewards
      const response = await fetch('/api/claim-riff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          amount: "0" // Amount will be calculated by contract
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`Claim rewards failed: ${result.error}`);
      }

      console.log('Rewards claimed successfully:', result);
      return result.txHash;
    } catch (err) {
      console.error('Claim rewards failed:', err);
      throw err;
    }
  }, [address]);


  // Emergency withdraw function
  const emergencyWithdraw = useCallback(async () => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: POCKET_PROTOCOL_ABI,
        functionName: 'emergencyWithdraw',
        args: [],
      });
    } catch (err) {
      console.error('Emergency withdraw failed:', err);
      throw err;
    }
  }, [address, writeContract, contractAddress]);

  // Refetch data when transaction is successful
  useEffect(() => {
    if (isSuccess) {
      refetchUserInfo();
    }
  }, [isSuccess, refetchUserInfo]);

  // Format user info
  const formattedUserInfo: UserStakeInfo | null = userInfo ? {
    amount: formatEther((userInfo as any)[0]),
    lastRewardAt: (userInfo as any)[1].toString(),
    lockUntil: (userInfo as any)[2].toString(),
  } : null;

  // Format pool info
  const poolInfo: PoolInfo | null = {
    feeBps: feeBps ? feeBps.toString() : '0',
    emergencyPenalty: emergencyPenalty ? emergencyPenalty.toString() : '0',
    relayer: (relayer as string) || '',
    riffToken: (riffToken as string) || '',
  };

  return {
    // Contract info
    contractAddress,
    chainId,
    
    // User data
    userInfo: formattedUserInfo,
    
    // Pool data
    poolInfo,
    
    // Actions
    stake,
    withdraw,
    claimRewards,
    emergencyWithdraw,
    
    // Transaction state
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    
    // Utils
    refetchUserInfo,
  };
}
