// Price fetching utilities for cross-chain swaps

export interface TokenPrice {
  symbol: string;
  price: number;
  chainId: number;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  fee: number;
  estimatedGas: string;
}

// Mock price data - in production, you would fetch from a real API like CoinGecko, 1inch, etc.
const MOCK_PRICES: Record<string, number> = {
  'tRBTC': 65000, // Rootstock native token
  'ETH': 3500,    // Ethereum
  'USDC': 1,      // USD Coin
  'USDT': 1,      // Tether
  'WBTC': 65000,  // Wrapped Bitcoin
};

export async function fetchTokenPrice(symbol: string, chainId: number): Promise<number> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // In production, you would make an actual API call here
  // Example: const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
  
  return MOCK_PRICES[symbol] || 1;
}

export async function getSwapQuote(
  fromToken: string,
  toToken: string,
  fromAmount: string,
  fromChainId: number,
  toChainId: number
): Promise<SwapQuote> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const fromPrice = await fetchTokenPrice(fromToken, fromChainId);
  const toPrice = await fetchTokenPrice(toToken, toChainId);
  
  const fromAmountNum = parseFloat(fromAmount);
  const rate = fromPrice / toPrice;
  const toAmount = (fromAmountNum * rate * 0.995).toFixed(6); // 0.5% fee
  
  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    rate: rate * 0.995,
    fee: 0.5,
    estimatedGas: "0.001", // Mock gas estimate
  };
}

export function getChainNativeToken(chainId: number): string {
  switch (chainId) {
    case 31: // Rootstock Testnet
      return 'tRBTC';
    case 11155111: // Sepolia
      return 'ETH';
    default:
      return 'ETH';
  }
}

export function getChainName(chainId: number): string {
  switch (chainId) {
    case 31:
      return 'Rootstock';
    case 11155111:
      return 'Sepolia';
    default:
      return 'Unknown';
  }
}
