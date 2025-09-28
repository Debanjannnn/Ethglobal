import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, createPublicClient, http, parseEther, keccak256, encodePacked } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { POCKET_PROTOCOL_SEPOLIA, POCKET_PROTOCOL_ABI, SEPOLIA_POOL, SEPOLIA_POOL_ABI } from "@/lib/contracts";

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL!;
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "c8316c9978a2218ed87caa2a5d4e984f14944fecc242ded779a6a5f337eefd2b";

if (!SEPOLIA_RPC_URL || !RELAYER_PRIVATE_KEY) {
  throw new Error("Missing .env configuration for relayer");
}

export async function POST(request: NextRequest) {
  try {
    const { recipient, amount, transferId, action } = await request.json();

    if (!recipient || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing recipient or amount" },
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

    let txHash: string;
    let receipt: any;

    if (action === 'stake' && transferId) {
      // Handle staking: Release ETH from pool and mint equivalent Sepolia ETH
      console.log(`Processing stake: ${amount} ETH for ${recipient}, transferId: ${transferId}`);
      
      // First, release ETH from the Sepolia pool
      txHash = await walletClient.writeContract({
        address: SEPOLIA_POOL as `0x${string}`,
        abi: SEPOLIA_POOL_ABI,
        functionName: 'release',
        args: [
          transferId as `0x${string}`,
          recipient as `0x${string}`,
          parseEther(amount.toString())
        ],
      });

      receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });
      
      console.log(`ETH released from pool: ${txHash}`);

      // Send additional Sepolia ETH to the recipient (simulating minting)
      const mintTxHash = await walletClient.sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount.toString()),
      });

      const mintReceipt = await publicClient.waitForTransactionReceipt({ hash: mintTxHash as `0x${string}` });
      
      console.log(`Sepolia ETH minted: ${mintTxHash}`);

      return NextResponse.json({
        success: true,
        txHash,
        mintTxHash,
        receipt,
        mintReceipt,
        message: `Stake processed: ${amount} ETH released and minted for ${recipient}`,
      });
    } else if (action === 'swap' && transferId) {
      // Handle swap: Send ETH directly to recipient (simulating cross-chain minting)
      console.log(`Processing swap: ${amount} ETH for ${recipient}, transferId: ${transferId}`);
      
      // Send Sepolia ETH to the recipient (simulating minting from Rootstock)
      txHash = await walletClient.sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount.toString()),
      });

      receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });
      
      console.log(`Sepolia ETH minted for swap: ${txHash}`);

      return NextResponse.json({
        success: true,
        txHash,
        receipt,
        message: `Swap processed: ${amount} ETH minted for ${recipient}`,
      });
    } else {
      // Default behavior: send ETH directly to recipient
      txHash = await walletClient.sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount.toString()),
      });

      receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });

      return NextResponse.json({
        success: true,
        txHash,
        receipt,
        message: `ETH released successfully to ${recipient}`,
      });
    }
  } catch (error) {
    console.error("Relayer API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for relayer status
export async function GET() {
  try {
    const privateKey = RELAYER_PRIVATE_KEY.startsWith('0x') ? RELAYER_PRIVATE_KEY : `0x${RELAYER_PRIVATE_KEY}`;
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });

    const balance = await publicClient.getBalance({ address: account.address });

    return NextResponse.json({
      success: true,
      relayerAddress: account.address,
      balance: parseFloat(balance.toString()) / 1e18,
      chain: sepolia.name,
    });
  } catch (error) {
    console.error("Relayer status error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
