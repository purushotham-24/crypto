const BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchCoins = async () => {
  const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd`);
  if (!response.ok) throw new Error("Failed to fetch coins");
  return response.json();
};

export const fetchCoinChart = async (id: string) => {
  const response = await fetch(`${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=7`);
  if (!response.ok) throw new Error("Failed to fetch chart data");
  return response.json();
};
