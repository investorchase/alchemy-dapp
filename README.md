# Alchemy DApp

A complete Next.js + WalletConnect + Alchemy app with:

- WalletConnect login
- ETH + token balances (via Alchemy)
- Send USDC (or any ERC20)
- NFT gallery (via Alchemy NFT API)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Edit `.env.local` and set:
   - `NEXT_PUBLIC_PROJECT_ID` (from https://cloud.walletconnect.com)
   - `ALCHEMY_API_KEY`
   - `ALCHEMY_CHAIN` (e.g. `base-sepolia`, `eth-sepolia`)
   - `NEXT_PUBLIC_USDC_ADDRESS` (correct for your chain)

3. Run:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Features

- Portfolio view (ETH, USDC, other tokens, NFT count)
- Send USDC form
- NFT gallery with images
