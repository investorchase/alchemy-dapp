"use client";

import { useBitcoin } from "@/components/BitcoinProvider";
import { useEffect, useState } from "react";

export function BitcoinDashboard() {
  const { connected, address, connect, disconnect } = useBitcoin();

  const [btc, setBtc] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!address) {
      setBtc(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/bitcoin/balance?address=${encodeURIComponent(address)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setBtc(data.btc ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  async function handleSendBtc(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    if (!toAddress || !amount) return;

    setSending(true);
    try {
      // TODO: integrate real Bitcoin send logic via wallet connector
      alert("Bitcoin send is scaffolded – wire real BTC transfer logic here.");
    } finally {
      setSending(false);
    }
  }

  if (!connected) {
    return (
      <div>
        <p>Connect a Bitcoin wallet to view your portfolio.</p>
        <button onClick={connect}>Connect Bitcoin Wallet</button>
      </div>
    );
  }

  return (
    <div>
      <p>Connected: {address}</p>

      <h2>Portfolio (Bitcoin)</h2>
      <p>BTC Balance: {loading ? "loading..." : btc != null ? `${btc.toFixed(6)} BTC` : "n/a"}</p>

      <h2>Send BTC</h2>
      <form onSubmit={handleSendBtc} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          placeholder="Recipient BTC address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          style={{ minWidth: 220, padding: 6 }}
        />
        <input
          placeholder="Amount (BTC)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: 120, padding: 6 }}
        />
        <button type="submit" disabled={!address || sending}>
          {sending ? "Sending..." : "Send BTC"}
        </button>
      </form>

      <button onClick={disconnect} style={{ marginTop: 16 }}>Disconnect</button>
    </div>
  );
}
