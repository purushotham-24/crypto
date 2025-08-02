"use client";

import { useEffect, useState } from "react";
import { useWatchlist } from "@/context/WatchlistContext";
import Link from "next/link";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
};

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWatchlistCoins = async () => {
      if (watchlist.length === 0) {
        setCoins([]);
        setLoading(false);
        return;
      }

      try {
        const ids = watchlist.join(",");
        const res = await fetch(`/api/coins?ids=${ids}`);
        if (res.status === 429) {
          setError("Rate limit exceeded. Please wait a minute and try again.");
          setCoins([]);
          return;
        }

        const data = await res.json();
        if (data?.error?.includes("rate limit")) {
          setError("Rate limit exceeded. Please wait a minute and try again.");
          setCoins([]);
        } else {
          setCoins(data);
        }
      } catch {
        setError("Failed to fetch watchlist coin data.");
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistCoins();
  }, [watchlist]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">My Watchlist</h1>
      <div className="mb-4 text-center">
        <Link href="/" className="text-blue-600 underline">Back to Markets</Link>
      </div>

      {Array.isArray(coins) && coins.length === 0 ? (
        <p className="text-center mt-10">No coins in your watchlist.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm border">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">#</th>
                <th className="p-2">Coin</th>
                <th className="p-2">Price</th>
                <th className="p-2">24h CH%</th>
                <th className="p-2">Market Cap</th>
                <th className="p-2">Volume</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <tr key={coin.id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 flex items-center gap-2">
                    {coin.image ? (
                      <img src={coin.image} alt={coin.name} width={20} height={20} />
                    ) : (
                      <div className="w-[20px] h-[20px] bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                    <Link href={`/coin/${coin.id}`}>
                      <span className="hover:underline text-blue-600 cursor-pointer">
                        {coin.name || "Unknown"}
                      </span>
                    </Link>{" "}
                    ({coin.symbol?.toUpperCase() || ""})
                  </td>
                  <td className="p-2">${coin.current_price?.toLocaleString?.() ?? "-"}</td>
                  <td
                    className={`p-2 ${
                      coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h != null
                      ? coin.price_change_percentage_24h.toFixed(2)
                      : "-"}%
                  </td>
                  <td className="p-2">${coin.market_cap?.toLocaleString?.() ?? "-"}</td>
                  <td className="p-2">${coin.total_volume?.toLocaleString?.() ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
