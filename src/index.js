import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import fetch from "node-fetch";

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const metaplex = new Metaplex(connection);

export async function onRequest(context) {
  const { request } = context;

  const url = new URL(request.url);
  const wallet = url.searchParams.get("wallet");
  if (!wallet) {
    return new Response(JSON.stringify({ error: "Missing wallet query" }), { status: 400 });
  }

  try {
    const nftData = await fetch(`https://api.helius.xyz/v0/accounts/${wallet}/nfts?api-key=${process.env.HELIUS_API_KEY}`)
      .then(res => res.json());

    const verified = nftData.some(nft => nft.updateAuthority === "4A644enxADhwaMGsXL4zngnfT2kXRQMjubtQFFrGQb7T");

    return new Response(JSON.stringify({ verified, nfts: nftData }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
