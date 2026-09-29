"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

export function SolanaDashboard() {
  const { connected, publicKey } = useWallet();

  const [sol, setSol] = useState<number | null>(null);
  const [usdc, setUsdc] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setSol(null);
      setUsdc(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/solana/balances?address=${publicKey.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setSol(data.sol ?? null);
        setUsdc(data.usdc ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  async function handleSendUsdc(e: React.FormEvent) {
    e.preventDefault();
    if (!publicKey) return;
    if (!toAddress || !amount) return;

    setSending(true);
    try {
      // TODO: implement real SPL transfer here using @solana/web3.js
      alert("Solana USDC send is scaffolded – wire real transfer logic here.");
    } finally {
      setSending(false);
    }
  }

  if (!connected) {
    return (
      <div>
        <p>Connect a Solana wallet to view your portfolio.</p>
        <WalletMultiButton />
      </div>
    );
  }

  return (
    <div>
      <p>Connected: {publicKey?.toString()}</p>

      <h2>Portfolio (Solana)</h2>
      <p>SOL Balance: {loading ? "loading..." : sol != null ? `${sol.toFixed(4)} SOL` : "n/a"}</p>
      <p>
        USDC Balance: {loading ? "loading..." : usdc != null ? `${usdc.toFixed(2)} USDC` : "n/a"}
      </p>

      <h2>Send USDC (Solana)</h2>
      <form onSubmit={handleSendUsdc} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          placeholder="Recipient Solana address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          style={{ minWidth: 220, padding: 6 }}
        />
        <input
          placeholder="Amount (USDC)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: 120, padding: 6 }}
        />
        <button type="submit" disabled={!publicKey || sending}>
          {sending ? "Sending..." : "Send USDC"}
        </button>
      </form>
    </div>
  );
}
