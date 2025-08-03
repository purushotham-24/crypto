// components/CoinChart.tsx
"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type Props = {
  coinId: string;
}

export interface ChartPrice {
  time: string;
  value: number;
}

export interface ChartData {
  prices: [number, number][];
}

const ranges: { [key: string]: string } = {
  "24h": "1",
  "7d": "7",
  "30d": "30",
  "90d": "90",
};

export default function CoinChart({ coinId }: Props) {
  const [range, setRange] = useState<"24h" | "7d" | "30d" | "90d">("7d");
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/coin_chart?coinId=${coinId}&days=${ranges[range]}`);
        if (res.status === 429) {
          setError("Rate limit exceeded. Please wait a minute and try again.");
          setChartData(null);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          let errorMsg = "Failed to fetch chart data.";
          try {
            const errorData = await res.json();
            if (errorData && errorData.error && errorData.error.includes("rate limit")) {
              errorMsg = "Rate limit exceeded. Please wait a minute and try again.";
            } else if (errorData && errorData.error) {
              errorMsg = errorData.error;
            }
          } catch {}
          setError(errorMsg);
          setChartData(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!data || !data.prices) {
          setError("No chart data available.");
          setChartData(null);
          setLoading(false);
          return;
        }
        const prices: ChartPrice[] = data.prices.map((item: [number, number]) => ({
          time: new Date(item[0]).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          value: item[1],
        }));
        setChartData({
          labels: prices.map((p) => p.time),
          datasets: [
            {
              label: "Price (USD)",
              data: prices.map((p) => p.value),
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              fill: true,
            },
          ],
        });
      } catch (err) {
        setError("Failed to fetch chart data.");
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [coinId, range]);

  return (
    <div className="mt-6">
      <div className="flex gap-2 mb-4">
        {Object.keys(ranges).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r as any)}
            className={`px-3 py-1 rounded border ${
              range === r ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading chart...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : chartData ? (
        <Line data={chartData} />
      ) : (
        <p>No chart data available.</p>
      )}
    </div>
  );
}
