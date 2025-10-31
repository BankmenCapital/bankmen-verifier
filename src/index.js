import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

const BANKMEN_COLLECTION = "GPtMdqNwNFnZGojyxEseXviJUZiqHyHDzWySjSHFup7J"; // your collection key

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://bankmencapital.com",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);
    const walletParam = url.searchParams.get("wallet");

    // Validate wallet param
    if (!walletParam) {
      return new Response(JSON.stringify({ success: false, error: "No wallet provided" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://bankmencapital.com",
        },
      });
    }

    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com");
      const metaplex = new Metaplex(connection);

      const ownerPublicKey = new PublicKey(walletParam);

      // Get all NFTs for wallet
      const nfts = await metaplex.nfts().findAllByOwner({ owner: ownerPublicKey });

      // Check if any NFT belongs to the Bankmen collection
      const ownsBankmen = nfts.some(
        (nft) => nft.collection?.key === BANKMEN_COLLECTION
      );

      return new Response(JSON.stringify({ success: true, ownsBankmen }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://bankmencapital.com",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://bankmencapital.com",
        },
      });
    }
  },
};


