import type { Metadata } from "next";
import { Web3ModalProvider } from "@/components/Web3ModalProvider";
import { SolanaProvider } from "@/components/SolanaProvider";
import { BitcoinProvider } from "@/components/BitcoinProvider";

export const metadata: Metadata = {
  title: "Multi-Chain DApp",
  description: "EVM + Solana + Bitcoin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3ModalProvider>
          <SolanaProvider>
            <BitcoinProvider>{children}</BitcoinProvider>
          </SolanaProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
