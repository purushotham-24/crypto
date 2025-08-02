"use client";
import CoinRow from "@/components/CoinRow";
import SearchInput from "@/components/SearchInput";
import { Star, StarOff } from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1"
        );
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        setError("Failed to fetch coin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const toggleCoin = (id: string) => {
    if (watchlist.includes(id)) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist(id);
    }
  };

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Top 50 Cryptocurrencies</h1>
      <div className="mb-4 text-center">
        <Link href="/watchlist" className="text-blue-600 underline">
          Watchlist Page
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name or symbol..."
        className="mb-4 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ✅ Added overflow-x for mobile scrolling */}
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
              <th className="p-2">Watchlist</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin, index) => (
              <tr key={coin.id} className="border-b hover:bg-gray-100">
                <td className="p-2">{index + 1}</td>
                <td className="p-2 flex items-center gap-2 whitespace-nowrap">
                  <img src={coin.image} alt={coin.name} width={20} height={20} />
                  <Link href={`/coin/${coin.id}`}>
                    <span className="hover:underline text-blue-600 cursor-pointer">
                      {coin.name}
                    </span>
                  </Link>{" "}
                  ({coin.symbol.toUpperCase()})
                </td>
                <td className="p-2">${coin.current_price.toLocaleString()}</td>
                <td
                  className={`p-2 ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td className="p-2">${coin.market_cap.toLocaleString()}</td>
                <td className="p-2">${coin.total_volume.toLocaleString()}</td>
                <td className="p-2">
                  <button onClick={() => toggleCoin(coin.id)}>
                    {watchlist.includes(coin.id) ? (
                      <Star className="text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="text-gray-400" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
