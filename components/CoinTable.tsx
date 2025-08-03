"use client";
import React from "react";
import CoinRow from "./CoinRow"; // or wherever it's located
import { Coin } from "@/types"; // if you have a shared type

interface CoinTableProps {
  coins: Coin[];
}

export default function CoinTable({ coins }: CoinTableProps) {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th>#</th>
          <th>Coin</th>
          <th>Price</th>
          <th>24h %</th>
          <th>Market Cap</th>
          <th>Volume</th>
          <th>Watchlist</th>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin, index) => (
          <CoinRow key={coin.id} coin={coin} index={index} />
        ))}
      </tbody>
    </table>
  );
}
