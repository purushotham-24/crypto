import "./globals.css";
import { Inter } from "next/font/google";
import { WatchlistProvider } from "@/context/WatchlistContext"; // ✅ context
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Crypto Coins",
  description: "Track top cryptocurrencies",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WatchlistProvider>{children}</WatchlistProvider>
      </body>
    </html>
  );
}
