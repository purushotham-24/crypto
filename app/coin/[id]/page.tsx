"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import CoinChart from "@/components/CoinChart";

export default function CoinDetailPage() {
  const { id } = useParams();
  interface CoinImage {
    large?: string;
  }
  interface CoinMarketData {
    current_price: { usd: number };
    market_cap: { usd: number };
    price_change_percentage_24h: number;
  }
  interface Coin {
    id: string;
    name: string;
    symbol: string;
    image?: CoinImage;
    market_data?: CoinMarketData;
  }
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoin = async () => {
      setLoading(true);
      setError("");

      if (!id || typeof id !== "string") {
        setError("Invalid coin ID.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/coins?ids=${id}`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const message =
            res.status === 429 || errorData?.error?.includes("rate limit")
              ? "Rate limit exceeded. Please wait a minute and try again."
              : errorData?.error || "Failed to fetch coin details.";
          setError(message);
          return;
        }

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          setError("Coin not found.");
          return;
        }

        setCoin(data[0]);
      } catch (err: any) {
        setError("Failed to load coin details.");
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !coin) return <p className="text-center text-red-500">{error || "Coin not found"}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        {coin.image && coin.image.large ? (
          <Image src={coin.image.large} alt={coin.name || "Coin"} width={50} height={50} />
        ) : (
          <div className="w-[50px] h-[50px] bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}
        <h1 className="text-3xl font-bold">
          {coin.name} ({coin.symbol?.toUpperCase()})
        </h1>
      </div>

      {coin.market_data ? (
        <>
          <p className="text-lg mb-2">
            Current Price: ${coin.market_data.current_price.usd.toLocaleString()}
          </p>
          <p className="mb-2">
            Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}
          </p>
          <p>
            24h Change:{" "}
            <span
              className={
                coin.market_data.price_change_percentage_24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {coin.market_data.price_change_percentage_24h.toFixed(2)}%
            </span>
          </p>
        </>
      ) : (
        <p className="text-center text-red-500">Market data</p>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Price Chart</h2>
        <CoinChart coinId={id as string} />
      </div>
    </div>
  );
}
