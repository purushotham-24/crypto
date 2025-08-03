"use client";

import { useWatchlist } from "@/context/WatchlistContext";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
};

interface CoinCardProps {
  coin: Coin;
}

export default function CoinCard({ coin }: CoinCardProps) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const isInWatchlist = watchlist.includes(coin.id);

  return (
    <div className="coin-card border p-4 rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">{coin.name} ({coin.symbol.toUpperCase()})</h2>
      <p className="mb-2">Current Price: ${coin.current_price.toLocaleString()}</p>
      <button
        onClick={() =>
          isInWatchlist
            ? removeFromWatchlist(coin.id)
            : addToWatchlist(coin.id)
        }
        className={`px-3 py-1 rounded ${
          isInWatchlist ? "bg-red-500" : "bg-blue-500"
        } text-white`}
      >
        {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      </button>
    </div>
  );
}
