import { NextResponse } from 'next/server';

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION_MS = 30 * 1000; // 30 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');
  const order = searchParams.get('order') || 'market_cap_desc';
  const per_page = searchParams.get('per_page') || '50';
  const page = searchParams.get('page') || '1';
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

  let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${order}&per_page=${per_page}&page=${page}`;
  if (ids) url += `&ids=${ids}`;

  const cacheKey = url;
  const now = Date.now();

  // ✅ Return cached data if still fresh
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_DURATION_MS) {
      console.log("✅ Returning from cache");
      return NextResponse.json(cached.data);
    }
  }

  try {
    const response = await fetch(url, {
      headers: { 'x-cg-demo-api-key': apiKey || '' }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from CoinGecko' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // ✅ Cache the fresh data
    cache.set(cacheKey, { data, timestamp: now });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
