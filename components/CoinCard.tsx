import { useWatchlist } from "@/context/WatchlistContext";

const CoinCard = ({ coin }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const isInWatchlist = watchlist.includes(coin.id);

  return (
    <div className="coin-card">
      <h2>{coin.name}</h2>
      {/* Add/Remove Button */}
      <button onClick={() => {
        isInWatchlist ? removeFromWatchlist(coin.id) : addToWatchlist(coin.id);
      }}>
        {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      </button>
    </div>
  );
};
