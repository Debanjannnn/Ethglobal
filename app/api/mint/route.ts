import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http, parseEther } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { WRBTC_SEPOLIA_ADDRESS } from '@/lib/addresses';
import WRBTC_ABI from '@/lib/abiFiles/WRBTC.json';

// Minting configuration
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia";
const RELAYER_PRIVATE_KEY = process.env.RBTC_TO_ETH_RELAYER_PRIVATE_KEY|| "c8316c9978a2218ed87caa2a5d4e984f14944fecc242ded779a6a5f337eefd2b";

export async function POST(request: NextRequest) {
  try {
    const { userAddress, amount } = await request.json();

    if (!userAddress || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing userAddress or amount" },
        { status: 400 }
      );
    }

    // Create wallet client for Sepolia
    const account = privateKeyToAccount(RELAYER_PRIVATE_KEY as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });

    // Create contract instance
    const contract = {
      address: WRBTC_SEPOLIA_ADDRESS as `0x${string}`,
      abi: WRBTC_ABI,
    };

    // Mint tokens
    const hash = await walletClient.writeContract({
      ...contract,
      functionName: 'mint',
      args: [userAddress as `0x${string}`, BigInt(amount)],
    });

    // Wait for transaction confirmation
    await walletClient.waitForTransactionReceipt({ hash });

    return NextResponse.json({
      success: true,
      txHash: hash,
      message: "Tokens minted successfully",
    });
  } catch (error) {
    console.error("Mint API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
