import { NextResponse } from "next/server";

interface ChartCacheData {
  prices: [number, number][];
}
const cache = new Map<string, { data: ChartCacheData; timestamp: number }>();
const CACHE_DURATION_MS = 30 * 1000; // 30 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId");
  const days = searchParams.get("days") || "7";
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

  if (!coinId) {
    return NextResponse.json({ error: "Missing coinId" }, { status: 400 });
  }

  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  const cacheKey = url;
  const now = Date.now();

  // Serve from cache if fresh
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_DURATION_MS) {
      console.log("✅ Chart data served from cache");
      return NextResponse.json(cached.data);
    }
  }

  try {
    const response = await fetch(url, {
      headers: { "x-cg-demo-api-key": apiKey || "" },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch chart data" }, { status: response.status });
    }

    const data = await response.json();

    // Cache data
    cache.set(cacheKey, { data, timestamp: now });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
