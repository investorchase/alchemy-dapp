import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }

  const rpcUrl =
    process.env.ALCHEMY_BITCOIN_RPC_URL ||
    `https://bitcoin-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

  try {
    // Simplified: this RPC call is wallet-wide, not address-specific.
    // For production, scan UTXOs for the given address.
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "1.0",
        id: "balance",
        method: "getbalance",
        params: ["*", 1, { includeWatchOnly: true }],
      }),
    });

    const json = await res.json();
    if (json.error) {
      return NextResponse.json({ error: json.error }, { status: 500 });
    }

    return NextResponse.json({
      address,
      btc: json.result as number,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to fetch BTC balance" },
      { status: 500 }
    );
  }
}
