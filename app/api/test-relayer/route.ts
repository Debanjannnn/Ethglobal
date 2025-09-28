import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia";
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "c8316c9978a2218ed87caa2a5d4e984f14944fecc242ded779a6a5f337eefd2b";

export async function POST(request: NextRequest) {
  try {
    const { recipient, amount } = await request.json();

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

    // Check relayer balance
    const balance = await publicClient.getBalance({ address: account.address });
    
    if (balance < parseEther(amount.toString())) {
      return NextResponse.json({
        success: false,
        error: `Insufficient relayer balance. Required: ${amount} ETH, Available: ${(Number(balance) / 1e18).toFixed(4)} ETH`,
        relayerAddress: account.address,
        balance: (Number(balance) / 1e18).toFixed(4),
      });
    }

    // Send ETH to recipient
    const txHash = await walletClient.sendTransaction({
      to: recipient as `0x${string}`,
      value: parseEther(amount.toString()),
    });

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });

    return NextResponse.json({
      success: true,
      txHash,
      receipt,
      relayerAddress: account.address,
      message: `Test ETH sent successfully to ${recipient}`,
    });
  } catch (error) {
    console.error("Test relayer API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

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
      balance: (Number(balance) / 1e18).toFixed(4),
      balanceWei: balance.toString(),
      chain: sepolia.name,
      chainId: sepolia.id,
      status: parseFloat((Number(balance) / 1e18).toFixed(4)) > 0.01 ? 'ready' : 'low_balance',
    });
  } catch (error) {
    console.error("Test relayer status error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
