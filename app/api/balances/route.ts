import { NextRequest, NextResponse } from "next/server";
import { Alchemy, Network } from "alchemy-sdk";

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY!,
  // network: Network.BASE_SEPOLIA,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }

  try {
    const balances = await alchemy.core.getTokenBalances(address);
    return NextResponse.json({ address, balances });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to fetch balances" },
      { status: 500 }
    );
  }
}
