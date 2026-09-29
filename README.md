# Multi-Chain DApp (EVM + Solana + Bitcoin scaffolding)

A Next.js app with:

- **EVM**: ETH + USDC balances, send USDC, NFT gallery (via Alchemy)
- **Solana**: SOL + USDC(SPL) balances, send USDC (scaffolded)
- **Bitcoin**: BTC balance (scaffolded), send BTC (scaffolded)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Edit `.env.local`:
   ```env
   # WalletConnect
   NEXT_PUBLIC_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID
   NEXT_PUBLIC_APP_NAME="Multi-Chain DApp"
   NEXT_PUBLIC_APP_URL="https://localhost:3000"

   # Alchemy EVM
   ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
   ALCHEMY_CHAIN=base-mainnet
   NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

   # Alchemy Solana
   NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

   # Alchemy Bitcoin
   ALCHEMY_BITCOIN_RPC_URL=https://bitcoin-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
   ```

3. Run:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Next steps

- Wire real Solana USDC transfer in `SolanaDashboard.tsx`.
- Integrate a real Bitcoin wallet connector in `BitcoinProvider.tsx` and implement send in `BitcoinDashboard.tsx`.
