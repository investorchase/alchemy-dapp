"use client";

import { useState } from "react";
import { ChainSelector, Chain } from "@/components/ChainSelector";
import { EvmDashboard } from "@/components/EvmDashboard";
import { SolanaDashboard } from "@/components/SolanaDashboard";
import { BitcoinDashboard } from "@/components/BitcoinDashboard";

export default function Home() {
  const [chain, setChain] = useState<Chain>("evm");

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Multi-Chain DApp</h1>
      <ChainSelector chain={chain} setChain={setChain} />

      {chain === "evm" && <EvmDashboard />}
      {chain === "solana" && <SolanaDashboard />}
      {chain === "bitcoin" && <BitcoinDashboard />}
    </main>
  );
}
