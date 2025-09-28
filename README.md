# Pocket Protocol

A comprehensive decentralized finance platform built with Next.js that enables token swapping, cross-chain bridging, and real-time market data exploration. The platform supports multiple blockchain networks and provides seamless user experience for DeFi operations.

## Features

### Token Swapping
- Instant token exchanges with low fees
- Support for multiple token pairs
- Real-time price updates
- Secure wallet integration

### Cross-Chain Bridge
- Bridge tRBTC from Rootstock Testnet to wRBTC on Ethereum Sepolia
- Automatic token minting on destination chain
- Real-time transaction status tracking
- Network validation and error handling

### Market Explorer
- Live cryptocurrency price data from Pyth Network
- Real-time market statistics and volume data
- Searchable token database
- 24-hour price change tracking
- Auto-refreshing data every 30 seconds

### Wallet Integration
- Multi-wallet support (MetaMask, WalletConnect, injected wallets)
- Seamless network switching
- Transaction confirmation and status tracking

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Blockchain**: wagmi, viem, ethers.js
- **Wallet**: RainbowKit for wallet connection
- **Data**: Pyth Network for price feeds
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- MetaMask or compatible wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ethglobal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Configure the following variables in `.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
SEPOLIA_RPC_URL=https://1rpc.io/sepolia
RELAYER_PRIVATE_KEY=your_relayer_private_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ethglobal/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── coindc/        # CoinDCX price API
│   │   ├── mint/          # Token minting endpoint
│   │   ├── pyth/          # Pyth Network price feeds
│   │   └── relayer/       # Bridge relayer services
│   ├── bridge/            # Bridge page
│   ├── explore/           # Market explorer page
│   ├── swap/              # Token swap page
│   └── pool/              # Liquidity pool page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── bridge-card.tsx   # Bridge interface
│   ├── swap-card.tsx     # Swap interface
│   └── stake-card.tsx    # Staking interface
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── abiFiles/         # Smart contract ABIs
│   ├── addresses.ts      # Contract addresses
│   └── contracts.ts      # Contract configurations
└── public/               # Static assets
```

## API Endpoints

### Price Data
- `GET /api/pyth/tokens` - Fetch real-time token prices from Pyth Network
- `GET /api/coindc/tokens` - Alternative price data from CoinDCX

### Bridge Operations
- `POST /api/mint` - Mint wRBTC tokens on Sepolia after bridge
- `GET /api/relayer/status` - Check bridge transaction status

## Smart Contracts

### Rootstock Testnet
- **Bridge Contract**: `0x12FA616A8c8c5B892189743eCE97B97ca8360ac4`
- **Pool Contract**: `0x...` (Pool functionality)

### Ethereum Sepolia
- **Bridge Contract**: `0xa870B2C67D6A957a40C528Eb96E8b7e51FbbD092`
- **wRBTC Token**: `0x25d6d8758FaB9Ae4310b2b826535486e85990788`

## Supported Networks

- **Rootstock Testnet** (Chain ID: 31)
- **Ethereum Sepolia** (Chain ID: 11155111)

## Usage

### Token Swapping
1. Navigate to the swap page
2. Connect your wallet
3. Select tokens and enter amounts
4. Confirm the transaction

### Cross-Chain Bridge
1. Go to the bridge page
2. Ensure you're on Rootstock Testnet
3. Enter the amount of tRBTC to bridge
4. Confirm the bridge transaction
5. wRBTC will be automatically minted on Sepolia

### Market Explorer
1. Visit the explore page
2. Browse real-time token prices
3. Use the search function to find specific tokens
4. View detailed market statistics

## Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for consistent styling
- Component-based architecture

## Security Considerations

- All sensitive operations are server-side only
- Private keys are never exposed to client-side code
- Transaction validation before processing
- Comprehensive error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.