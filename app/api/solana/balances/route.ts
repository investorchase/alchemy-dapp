import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { USDC_MINT } from "@/lib/solana/usdc";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }

  const rpcUrl =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    "https://solana-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY;

  const connection = new Connection(rpcUrl, "confirmed");

  try {
    const pubKey = new PublicKey(address);
    const solLamports = await connection.getBalance(pubKey);
    const sol = solLamports / 1e9;

    const tokenAccounts = await connection.getTokenAccountsByOwner(pubKey, {
      mint: new PublicKey(USDC_MINT),
    });

    let usdc = 0;
    for (const ta of tokenAccounts.value) {
      const info = await connection.getParsedAccountInfo(ta.pubkey);
      const parsed = info.value?.data as any;
      if (parsed?.parsed?.info?.tokenAmount?.uiAmount != null) {
        usdc += parsed.parsed.info.tokenAmount.uiAmount as number;
      }
    }

    return NextResponse.json({
      address,
      sol,
      usdc,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to fetch Solana balances" },
      { status: 500 }
    );
  }
}
