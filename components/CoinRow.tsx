"use client";

import { Star, StarOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useWatchlist } from "@/context/WatchlistContext";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface CoinRowProps {
  coin: Coin;
  index: number;
}

export default function CoinRow({ coin, index }: CoinRowProps) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const toggleCoin = (id: string) => {
    watchlist.includes(id) ? removeFromWatchlist(id) : addToWatchlist(id);
  };

  return (
    <tr className="border-b hover:bg-gray-100">
      <td className="p-2">{index + 1}</td>
      <td className="p-2 flex items-center gap-2">
        <Image src={coin.image} alt={coin.name} width={20} height={20} />
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
          coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
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
  );
}
