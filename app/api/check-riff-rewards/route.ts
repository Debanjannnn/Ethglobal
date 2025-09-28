import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { POCKET_PROTOCOL_SEPOLIA, POCKET_PROTOCOL_ABI } from "@/lib/contracts";

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL!;

if (!SEPOLIA_RPC_URL) {
  throw new Error("Missing SEPOLIA_RPC_URL configuration");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { success: false, error: "Missing userAddress parameter" },
        { status: 400 }
      );
    }

    // Create public client
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });

    // Get user info from Pocket Protocol contract
    const userInfo = await publicClient.readContract({
      address: POCKET_PROTOCOL_SEPOLIA as `0x${string}`,
      abi: POCKET_PROTOCOL_ABI,
      functionName: 'userInfo',
      args: [userAddress as `0x${string}`],
    });

    // Get pool info
    const feeBps = await publicClient.readContract({
      address: POCKET_PROTOCOL_SEPOLIA as `0x${string}`,
      abi: POCKET_PROTOCOL_ABI,
      functionName: 'feeBps',
    });

    const emergencyPenalty = await publicClient.readContract({
      address: POCKET_PROTOCOL_SEPOLIA as `0x${string}`,
      abi: POCKET_PROTOCOL_ABI,
      functionName: 'EMERGENCY_PENALTY',
    });

    const relayer = await publicClient.readContract({
      address: POCKET_PROTOCOL_SEPOLIA as `0x${string}`,
      abi: POCKET_PROTOCOL_ABI,
      functionName: 'relayer',
    });

    const riffToken = await publicClient.readContract({
      address: POCKET_PROTOCOL_SEPOLIA as `0x${string}`,
      abi: POCKET_PROTOCOL_ABI,
      functionName: 'riffToken',
    });

    // Format the response
    const response = {
      success: true,
      userInfo: {
        amount: userInfo[0].toString(),
        lastRewardAt: userInfo[1].toString(),
        lockUntil: userInfo[2].toString(),
      },
      poolInfo: {
        feeBps: feeBps.toString(),
        emergencyPenalty: emergencyPenalty.toString(),
        relayer: relayer as string,
        riffToken: riffToken as string,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Check RIFF rewards API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
