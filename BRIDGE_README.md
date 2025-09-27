# tRBTC Bridge Implementation

This implementation provides a bridge for tRBTC (native) from Rootstock Testnet to wRBTC (wrapped) on Ethereum Sepolia, with automatic minting functionality.

## Features

- **Wallet Connection**: Uses wagmi for seamless wallet connection with MetaMask, WalletConnect, and injected wallets
- **Cross-Chain Bridge**: Bridge tRBTC from Rootstock Testnet to wRBTC on Sepolia
- **Automatic Minting**: When you bridge tRBTC, wRBTC tokens are automatically minted on Sepolia
- **Real-time Status**: Shows transaction hashes, estimated time, and bridge progress
- **Network Detection**: Automatically detects and validates the correct network

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `env.example` to `.env.local` and fill in the required values:
   ```bash
   cp env.example .env.local
   ```

   Required environment variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - `SEPOLIA_RPC_URL`: Sepolia RPC endpoint (default: https://1rpc.io/sepolia)
   - `RELAYER_PRIVATE_KEY`: Private key for the relayer that mints wRBTC tokens

3. **Run the Application**:
   ```bash
   npm run dev
   ```

## How It Works

### Bridge Flow (Rootstock → Sepolia)

1. **User Initiates Bridge**: User connects wallet and enters amount to bridge
2. **Bridge Transaction**: Calls `bridge()` function on Rootstock Bridge contract with native tRBTC
3. **Automatic Minting**: API endpoint automatically mints equivalent wRBTC tokens on Sepolia
4. **Confirmation**: User receives both bridge and mint transaction hashes

### Contract Addresses

- **Rootstock Bridge**: `0x12FA616A8c8c5B892189743eCE97B97ca8360ac4`
- **Sepolia Bridge**: `0xa870B2C67D6A957a40C528Eb96E8b7e51FbbD092`
- **wRBTC Token**: `0x25d6d8758FaB9Ae4310b2b826535486e85990788`

### Networks

- **Rootstock Testnet**: Chain ID 31
- **Sepolia**: Chain ID 11155111

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Switch Network**: Ensure you're on Rootstock Testnet for bridging
3. **Enter Amount**: Input the amount of tRBTC you want to bridge
4. **Bridge**: Click "Bridge" to initiate the transaction
5. **Wait for Confirmation**: The system will automatically mint wRBTC tokens on Sepolia

## API Endpoints

### POST /api/mint

Automatically mints wRBTC tokens on Sepolia after a successful bridge transaction.

**Request Body**:
```json
{
  "userAddress": "0x...",
  "amount": "1000000000000000000"
}
```

**Response**:
```json
{
  "success": true,
  "txHash": "0x...",
  "message": "Tokens minted successfully"
}
```

## Security Notes

- The relayer private key should be kept secure and not exposed in client-side code
- The minting API is server-side only for security
- All transactions are validated before processing

## Error Handling

The bridge includes comprehensive error handling for:
- Invalid amounts
- Insufficient balance
- Network errors
- Transaction failures
- API errors

## Transaction Links

- **Rootstock Explorer**: https://explorer.testnet.rsk.co
- **Sepolia Explorer**: https://sepolia.etherscan.io

## Development

The bridge is built with:
- **wagmi**: Wallet connection and blockchain interaction
- **viem**: Ethereum library for contract interactions
- **Next.js**: Full-stack React framework
- **TypeScript**: Type-safe development

## Testing

To test the bridge:
1. Get testnet tRBTC from Rootstock faucet
2. Connect wallet to Rootstock Testnet
3. Bridge a small amount to test the functionality
4. Check Sepolia for the minted wRBTC tokens
