import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import fetch from "node-fetch";

const HELIUS_API_KEY = Deno.env.get("HELIUS_API_KEY");

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const wallet = url.searchParams.get("wallet");

      if (!wallet) {
        return new Response(JSON.stringify({ error: "Missing wallet parameter" }), {
          headers: { "Content-Type": "application/json" },
          status: 400
        });
      }

      // Connect to Solana
      const connection = new Connection(clusterApiUrl("mainnet-beta"));
      const metaplex = new Metaplex(connection);

      // Helius NFT API request
      const heliusResponse = await fetch(`https://api.helius.xyz/v0/addresses/${wallet}/nfts?api-key=${HELIUS_API_KEY}`);
      if (!heliusResponse.ok) {
        throw new Error("Failed to fetch NFT data from Helius");
      }
      const nfts = await heliusResponse.json();

      // Example: Filter only verified NFTs (custom logic can be changed)
      const verifiedNFTs = nfts.filter(nft => nft.onChainVerified === true);

      return new Response(JSON.stringify({ verifiedNFTs }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500
      });
    }
  }
};
