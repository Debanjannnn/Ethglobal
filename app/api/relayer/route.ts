import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL!;
const RELAYER_PRIVATE_KEY = "c8316c9978a2218ed87caa2a5d4e984f14944fecc242ded779a6a5f337eefd2b";

if (!SEPOLIA_RPC_URL || !RELAYER_PRIVATE_KEY) {
  throw new Error("Missing .env configuration for relayer");
}

export async function POST(request: NextRequest) {
  try {
    const { recipient, amount } = await request.json();

    if (!recipient || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing recipient or amount" },
        { status: 400 }
      );
    }

    // create relayer account & wallet client
    const privateKey = RELAYER_PRIVATE_KEY.startsWith('0x') ? RELAYER_PRIVATE_KEY : `0x${RELAYER_PRIVATE_KEY}`;
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });

    // create public client for waiting for receipt
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });

    // send ETH directly to recipient
    const txHash = await walletClient.sendTransaction({
      to: recipient as `0x${string}`,
      value: parseEther(amount.toString()),
    });

    // wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    return NextResponse.json({
      success: true,
      txHash,
      receipt,
      message: `ETH released successfully to ${recipient}`,
    });
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
