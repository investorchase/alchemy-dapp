"use client";

export type Chain = "evm" | "solana" | "bitcoin";

export function ChainSelector({
  chain,
  setChain,
}: {
  chain: Chain;
  setChain: (c: Chain) => void;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ marginRight: 8 }}>Chain:</label>
      <select value={chain} onChange={(e) => setChain(e.target.value as Chain)}>
        <option value="evm">EVM (ETH/Base/etc)</option>
        <option value="solana">Solana</option>
        <option value="bitcoin">Bitcoin</option>
      </select>
    </div>
  );
}
