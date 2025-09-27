import { NextResponse } from 'next/server';
import { createWalletClient, http, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Relayer configuration
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia";
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "c8316c9978a2218ed87caa2a5d4e984f14944fecc242ded779a6a5f337eefd2b";

export async function GET() {
  try {
    const account = privateKeyToAccount(RELAYER_PRIVATE_KEY as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });

    const balance = await walletClient.getBalance({ address: account.address });
    
    return NextResponse.json({
      success: true,
      relayerAddress: account.address,
      balance: formatEther(balance),
      balanceWei: balance.toString(),
      chain: sepolia.name,
      chainId: sepolia.id,
      status: parseFloat(formatEther(balance)) > 0.01 ? 'ready' : 'low_balance',
    });
  } catch (error) {
    console.error("Relayer status error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
