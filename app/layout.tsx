import type { Metadata } from "next";
import { Web3ModalProvider } from "@/components/Web3ModalProvider";

export const metadata: Metadata = {
  title: "Alchemy DApp",
  description: "Next.js + WalletConnect + Alchemy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}
