"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

interface MetricVisualizerProps {
  title: string;
  status: "Critical" | "Stable";
  dataPoints: number[];
}

export function MetricVisualizer({ title, status, dataPoints }: MetricVisualizerProps) {
  const isCritical = status === "Critical";
  
  // Transform data points into chart format
  const chartData = dataPoints.map((value, index) => ({
    time: `${index * 5}s`,
    value,
  }));

  const lastValue = dataPoints[dataPoints.length - 1] || 0;
  const firstValue = dataPoints[0] || 0;
  const trend = lastValue > firstValue ? "up" : "down";
  const percentChange = firstValue > 0 
    ? Math.abs(((lastValue - firstValue) / firstValue) * 100).toFixed(1)
    : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-6 glass border ${
        isCritical ? "border-red-500/50 glow-red" : "border-green-500/50 glow-green"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isCritical ? "bg-red-500/20" : "bg-green-500/20"
          }`}>
            <Activity className={`w-5 h-5 ${isCritical ? "text-red-400" : "text-green-400"}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-xs text-gray-400">Real-time monitoring</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          isCritical 
            ? "bg-red-500/20 text-red-400 border border-red-500/30" 
            : "bg-green-500/20 text-green-400 border border-green-500/30"
        }`}>
          {isCritical ? (
            <>
              <AlertCircle className="w-4 h-4" />
              Critical
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Stable
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${status}`} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isCritical ? "#ef4444" : "#22c55e"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isCritical ? "#ef4444" : "#22c55e"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 10 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 10 }}
              domain={[0, "dataMax + 20"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isCritical ? "#ef4444" : "#22c55e"}
              strokeWidth={2}
              fill={`url(#gradient-${status})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--card-bg)] rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Current</p>
          <p className={`text-xl font-bold ${isCritical ? "text-red-400" : "text-green-400"}`}>
            {lastValue}ms
          </p>
        </div>
        <div className="bg-[var(--card-bg)] rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Trend</p>
          <div className="flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className={`w-4 h-4 ${isCritical ? "text-red-400" : "text-amber-400"}`} />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-400" />
            )}
            <span className={`text-xl font-bold ${
              trend === "up" && isCritical ? "text-red-400" : "text-green-400"
            }`}>
              {percentChange}%
            </span>
          </div>
        </div>
        <div className="bg-[var(--card-bg)] rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              isCritical ? "bg-red-500 animate-pulse" : "bg-green-500"
            }`}></span>
            <span className="text-sm font-medium">{isCritical ? "Live" : "Recovered"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MetricVisualizer;
