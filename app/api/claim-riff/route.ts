import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { POCKET_PROTOCOL_SEPOLIA, POCKET_PROTOCOL_ABI } from "@/lib/contracts";

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL!;
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "c8316c9978a2218ed87caa2a5d4e984f14944fecc242ded779a6a5f337eefd2b";

if (!SEPOLIA_RPC_URL || !RELAYER_PRIVATE_KEY) {
  throw new Error("Missing .env configuration for relayer");
}

export async function POST(request: NextRequest) {
  try {
    const { userAddress, amount } = await request.json();

    if (!userAddress || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing userAddress or amount" },
        { status: 400 }
      );
    }

    // Create relayer account & wallet client
    const privateKey = RELAYER_PRIVATE_KEY.startsWith('0x') ? RELAYER_PRIVATE_KEY : `0x${RELAYER_PRIVATE_KEY}`;
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });

    // Create public client for waiting for receipt
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });

    // Call claimReward function on Pocket Protocol contract
    const txHash = await walletClient.writeContract({
      address: POCKET_PROTOCOL_SEPOLIA as `0x${string}`,
      abi: POCKET_PROTOCOL_ABI,
      functionName: 'claimReward',
      args: [userAddress as `0x${string}`, parseEther(amount.toString())],
    });

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    return NextResponse.json({
      success: true,
      txHash,
      receipt,
      message: `RIFF rewards claimed successfully for ${userAddress}`,
    });
  } catch (error) {
    console.error("Claim RIFF API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
