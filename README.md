# Pocket Protocol - Cross-Chain DeFi Platform

**A revolutionary cross-chain DeFi platform that enables seamless token swapping, bridging, and staking between Rootstock and Ethereum networks with real-time market data integration.**

## 📋 Project Description

Pocket Protocol is a comprehensive decentralized finance platform that bridges the gap between Rootstock and Ethereum ecosystems. We've integrated Rootstock's native tRBTC with Ethereum's wRBTC through an innovative cross-chain bridge system, enabling users to swap tokens, stake assets, and access real-time market data across both networks seamlessly.
<img width="1068" height="596" alt="image" src="https://github.com/user-attachments/assets/7687de42-f1c1-4f37-9b18-9c204f82746a" />

## 🔗 Rootstock Integration
<img width="1285" height="724" alt="image" src="https://github.com/user-attachments/assets/b5278b60-7468-4c55-b083-5719959dde93" />

**What we integrated Rootstock with and how:**

We integrated Rootstock Testnet with Ethereum Sepolia to create a unified cross-chain DeFi experience:

- **Cross-Chain Bridge**: Built a sophisticated bridge system that allows users to transfer tRBTC from Rootstock Testnet to wRBTC on Ethereum Sepolia with automatic token minting
- **Smart Contract Deployment**: Deployed contracts on both Rootstock Testnet and Ethereum Sepolia for seamless cross-chain operations
- **Relayer System**: Implemented an automated relayer that processes bridge transactions and mints equivalent tokens on the destination chain
- **Real-time Integration**: Connected Pyth Network price feeds to provide live market data for both networks
- **Wallet Integration**: Seamless wallet connection supporting both Rootstock and Ethereum networks

**Technical Implementation:**
- Rootstock Bridge Contract: `0x12FA616A8c8c5B892189743eCE97B97ca8360ac4`
- Ethereum Sepolia Bridge: `0xa870B2C67D6A957a40C528Eb96E8b7e51FbbD092`
- wRBTC Token: `0x25d6d8758FaB9Ae4310b2b826535486e85990788`

## 👥 Team Background

**Core Team:**
- **Lead Developer**: Full-stack developer with 5+ years experience in blockchain development, specializing in DeFi protocols and cross-chain solutions
- **Smart Contract Engineer**: Solidity expert with extensive experience in Rootstock and Ethereum development, previously worked on multiple DeFi protocols
- **Frontend Architect**: React/Next.js specialist with expertise in Web3 integration and user experience design
- **DevOps Engineer**: Blockchain infrastructure specialist with experience in deploying and maintaining cross-chain applications

**Collective Experience:**
- 15+ years combined blockchain development experience
- Previous work on major DeFi protocols and cross-chain bridges
- Deep understanding of Rootstock's unique features and Bitcoin security model
- Proven track record in building user-friendly DeFi applications

## 🧪 Testing Instructions

### Prerequisites
- MetaMask or compatible wallet
- Testnet tokens (tRBTC for Rootstock, ETH for Sepolia)
- Node.js 18+ installed

### Step-by-Step Testing Guide

1. **Clone and Setup**
   ```bash
   git clone https://github.com/your-username/pocket-protocol
   cd pocket-protocol
   npm install
   cp env.example .env.local
   ```

2. **Configure Environment**
   ```bash
   # Add your WalletConnect Project ID to .env.local
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   SEPOLIA_RPC_URL=https://1rpc.io/sepolia
   RELAYER_PRIVATE_KEY=your_relayer_private_key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Test Cross-Chain Bridge**
   - Connect wallet to Rootstock Testnet
   - Navigate to Bridge page
   - Enter amount of tRBTC to bridge
   - Confirm transaction
   - Verify wRBTC appears on Sepolia

5. **Test Token Swapping**
   - Switch between Rootstock and Sepolia networks
   - Use Swap page to exchange tokens
   - Verify real-time price updates

6. **Test Staking Protocol**
   - Navigate to Stake page
   - Stake RBTC tokens
   - Claim RIFF rewards
   - Verify cross-chain ETH minting

7. **Test Market Explorer**
   - Visit Explore page
   - Verify real-time price data
   - Test search functionality

### Expected Results
- ✅ Successful bridge transactions on both networks
- ✅ Real-time price updates from Pyth Network
- ✅ Seamless wallet switching between networks
- ✅ Automatic token minting on destination chains
- ✅ Staking rewards and cross-chain ETH distribution

## 🎯 On-Chain Transactions

**Rootstock Testnet Transactions:**
- Bridge Contract Deployment: `0x12FA616A8c8c5B892189743eCE97B97ca8360ac4`
- Test Bridge Transaction: [View on Rootstock Explorer](https://explorer.testnet.rsk.co/tx/0x...)
- Staking Transaction: [View on Rootstock Explorer](https://explorer.testnet.rsk.co/tx/0x...)

**Ethereum Sepolia Transactions:**
- Bridge Contract Deployment: `0xa870B2C67D6A957a40C528Eb96E8b7e51FbbD092`
- wRBTC Minting Transaction: [View on Sepolia Etherscan](https://sepolia.etherscan.io/tx/0x...)
- Cross-Chain Transfer: [View on Sepolia Etherscan](https://sepolia.etherscan.io/tx/0x...)

## 💭 Building on Rootstock - Our Experience

**What we loved about Rootstock:**
- **Bitcoin Security**: The merge-mining with Bitcoin provides unparalleled security for our DeFi operations
- **EVM Compatibility**: Seamless integration with existing Ethereum tooling and libraries
- **Low Fees**: Significantly lower transaction costs compared to Ethereum mainnet
- **Fast Finality**: Quick transaction confirmation times for better user experience
- **Developer-Friendly**: Excellent documentation and supportive community

**Challenges we overcame:**
- **Cross-Chain Complexity**: Building reliable bridges between Rootstock and Ethereum required careful design
- **Token Standard Differences**: Adapting between tRBTC and wRBTC standards
- **Relayer Architecture**: Designing a secure and efficient relayer system for cross-chain operations

**Rootstock's Unique Value:**
- The Bitcoin-backed security model gives users confidence in our platform
- Lower fees make DeFi accessible to more users
- EVM compatibility allowed us to leverage existing DeFi infrastructure
- The growing ecosystem provides excellent opportunities for innovation

## 🎥 Demo & Presentation

**Video Demo**: [Watch our comprehensive demo](https://www.loom.com/share/f9b0534563244943971958410b4a998e?sid=efdf705b-78fb-488a-8611-4df8eae1a849)

**Key Features Showcased:**
- Cross-chain bridge functionality between Rootstock and Ethereum
- Real-time price feeds integration from Pyth Network
- Staking protocol with RIFF token rewards
- Seamless wallet switching between networks
- Mobile-responsive design and user experience
- Live transaction processing and confirmation

**Slide Deck**: [View our presentation](https://docs.google.com/presentation/d/your-slides)

## 🚀 Live Demo

**Testnet Deployment**: [https://pocket-protocol.vercel.app](https://pocket-protocol.vercel.app)

**Supported Networks:**
- Rootstock Testnet (Chain ID: 31)
- Ethereum Sepolia (Chain ID: 11155111)

## 📊 Technical Architecture

### Smart Contracts
- **Rootstock Bridge**: Handles tRBTC deposits and cross-chain transfers
- **Ethereum Bridge**: Manages wRBTC minting and withdrawals
- **Pocket Protocol**: Staking contract with RIFF token rewards
- **Relayer System**: Automated cross-chain transaction processing

### Frontend Stack
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling system
- **wagmi**: Ethereum library integration
- **RainbowKit**: Wallet connection management

### Data Sources
- **Pyth Network**: Real-time price feeds
- **CoinDCX API**: Alternative price data
- **Blockchain RPCs**: Direct network communication

## 🔒 Security Features

- **Server-side Relayer**: Private keys never exposed to client
- **Smart Contract Validation**: All transactions verified on-chain
- **Multi-signature Support**: Enterprise-grade security
- **Comprehensive Error Handling**: Graceful failure management

## 📈 Future Roadmap

- **Mainnet Deployment**: Launch on Rootstock and Ethereum mainnets
- **Additional Chains**: Support for more blockchain networks
- **Advanced Features**: Limit orders, DCA strategies, yield farming
- **Mobile App**: Native iOS and Android applications
- **Institutional Features**: Advanced trading tools and analytics

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) and submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: team@pocketprotocol.io
- **Twitter**: [@PocketProtocol](https://twitter.com/PocketProtocol)

---

**Built with ❤️ for the Rootstock and Ethereum communities**

*Pocket Protocol - Where every chain connects, every swap is instant, and every stake earns more.*
