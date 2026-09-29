import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage, http } from "wagmi";
import { mainnet, base, baseSepolia, sepolia } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
if (!projectId) throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");

const metadata = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Alchemy DApp",
  description: "Next.js + WalletConnect + Alchemy",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/17774266"],
};

const alchemyRpcUrl = `https://${process.env.ALCHEMY_CHAIN || "base-sepolia"}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

const chains = [mainnet, base, baseSepolia, sepolia] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(alchemyRpcUrl),
    [base.id]: http(alchemyRpcUrl),
    [baseSepolia.id]: http(alchemyRpcUrl),
    [sepolia.id]: http(alchemyRpcUrl),
  },
});

export { projectId, metadata };
