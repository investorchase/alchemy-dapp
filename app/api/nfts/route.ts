import { NextRequest, NextResponse } from "next/server";
import { Alchemy, Network } from "alchemy-sdk";

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY!,
  // network: Network.BASE_SEPOLIA,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");

  if (!owner) {
    return NextResponse.json({ error: "owner required" }, { status: 400 });
  }

  try {
    const result = await alchemy.nft.getNftsForOwner(owner, {
      pageSize: 20,
    });

    return NextResponse.json({
      owner,
      totalCount: result.totalCount,
      nfts: result.ownedNfts.map((n) => ({
        contractAddress: n.contract.address,
        tokenId: n.tokenId,
        title: n.title,
        description: n.description,
        media: n.media,
        collection: n.contract?.name,
      })),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to fetch NFTs" },
      { status: 500 }
    );
  }
}
