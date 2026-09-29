"use client";

import { useAccount, useBalance, useReadContract, useWriteContract } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { parseUnits } from "viem";
import { useEffect, useState } from "react";
import { erc20Abi } from "@/lib/erc20";

type TokenBalance = {
  contractAddress: string | null;
  tokenBalance: string;
  error?: string;
};

type NftItem = {
  contractAddress: string;
  tokenId: string;
  title: string;
  description: string | null;
  media: { gateway?: string }[];
  collection?: string;
};

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { open } = useWeb3Modal();

  const { data: ethBalance } = useBalance({ address });

  const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` | undefined;

  const { data: usdcBalance } = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address && !!usdcAddress },
  });

  const { writeContract, isPending: isSending } = useWriteContract();

  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);

  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [nftCount, setNftCount] = useState(0);
  const [loadingNfts, setLoadingNfts] = useState(false);

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!address) {
      setTokenBalances([]);
      setNfts([]);
      setNftCount(0);
      return;
    }

    let cancelledTokens = false;
    setLoadingTokens(true);
    fetch(`/api/balances?address=${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelledTokens) return;
        if (data.balances) {
          setTokenBalances(
            data.balances.filter((b: TokenBalance) => b.tokenBalance !== "0")
          );
        }
      })
      .finally(() => {
        if (!cancelledTokens) setLoadingTokens(false);
      });

    let cancelledNfts = false;
    setLoadingNfts(true);
    fetch(`/api/nfts?owner=${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelledNfts) return;
        setNftCount(data.totalCount || 0);
        setNfts(data.nfts || []);
      })
      .finally(() => {
        if (!cancelledNfts) setLoadingNfts(false);
      });

    return () => {
      cancelledTokens = true;
      cancelledNfts = true;
    };
  }, [address]);

  function handleSendUsdc(e: React.FormEvent) {
    e.preventDefault();
    if (!address || !usdcAddress) return;
    if (!toAddress || !amount) return;

    const decimals = 6; // USDC typical; adjust if your token differs
    const value = parseUnits(amount, decimals);

    writeContract({
      address: usdcAddress,
      abi: erc20Abi,
      functionName: "transfer",
      args: [toAddress as `0x${string}`, value],
    });
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Alchemy DApp</h1>

      {!isConnected ? (
        <button onClick={() => open()}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <p>Chain: {chain?.name}</p>

          <h2>Portfolio</h2>
          <p>
            ETH Balance:{" "}
            {ethBalance
              ? `${Number(ethBalance.value).toFixed(4)} ${ethBalance.symbol}`
              : "loading..."}
          </p>
          <p>
            USDC Balance:{" "}
            {usdcBalance !== undefined && usdcAddress
              ? `${Number(usdcBalance) / 10 ** 6}`
              : "loading..."}
          </p>
          <p>NFTs owned: {loadingNfts ? "loading..." : nftCount}</p>

          <h3>Token balances (via Alchemy)</h3>
          {loadingTokens ? (
            <p>Loading tokens...</p>
          ) : tokenBalances.length === 0 ? (
            <p>No non-zero token balances found.</p>
          ) : (
            <ul>
              {tokenBalances.map((t) => (
                <li key={t.contractAddress ?? "native"}>
                  {t.contractAddress ?? "Native"}: {t.tokenBalance}
                </li>
              ))}
            </ul>
          )}

          <h2>Send USDC</h2>
          <form onSubmit={handleSendUsdc} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              placeholder="Recipient address (0x...)"
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
            <button type="submit" disabled={!address || !usdcAddress || isSending}>
              {isSending ? "Sending..." : "Send USDC"}
            </button>
          </form>

          <h2>NFTs</h2>
          {loadingNfts ? (
            <p>Loading NFTs...</p>
          ) : nfts.length === 0 ? (
            <p>No NFTs found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 16,
              }}
            >
              {nfts.map((n) => (
                <div
                  key={`${n.contractAddress}-${n.tokenId}`}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 8,
                  }}
                >
                  {n.media?.[0]?.gateway && (
                    <img
                      src={n.media[0].gateway}
                      alt={n.title || "NFT"}
                      style={{ width: "100%", borderRadius: 6 }}
                    />
                  )}
                  <div style={{ marginTop: 6, fontSize: 12 }}>
                    <div>{n.title || `Token #${n.tokenId}`}</div>
                    <div style={{ color: "#666" }}>
                      {n.collection || n.contractAddress}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
