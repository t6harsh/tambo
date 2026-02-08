"use client";

import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, Circle, Zap } from "lucide-react";

interface MetricVisualizerProps {
  title: string;
  status: "Critical" | "Stable";
  dataPoints?: number[]; // Made optional for safety
}

export function MetricVisualizer({ title, status, dataPoints = [] }: MetricVisualizerProps) {
  const safeDataPoints = Array.isArray(dataPoints) ? dataPoints : [];
  const isCritical = status === "Critical";
  
  // Create richer data points for better visuals
  const chartData = safeDataPoints.map((value, index) => ({
    time: index,
    value,
  }));

  const lastValue = safeDataPoints[safeDataPoints.length - 1] || 0;
  const firstValue = safeDataPoints[0] || 0;
  const trend = lastValue > firstValue ? "up" : "down";
  const percentChange = firstValue > 0 
    ? Math.abs(((lastValue - firstValue) / firstValue) * 100).toFixed(1)
    : "0";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="glass-card rounded-2xl p-6 overflow-hidden relative group"
    >
      {/* Background Glow */}
      <div 
        className={`absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000 ${
          isCritical 
            ? "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent" 
            : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"
        }`} 
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
            isCritical 
              ? "bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
              : "bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          }`}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">{title}</h3>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
              Live Feed
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className={`text-3xl font-bold tracking-tight ${
              isCritical ? "text-red-500" : "text-emerald-500"
            }`}>
              {lastValue}
            </span>
            <span className="text-sm text-zinc-500 font-medium">ms</span>
          </div>
          <div className="flex items-center justify-end gap-1 text-xs">
             {trend === "up" ? (
                <TrendingUp className={`w-3 h-3 ${isCritical ? "text-red-400" : "text-zinc-400"}`} />
              ) : (
                <TrendingDown className="w-3 h-3 text-emerald-400" />
              )}
             <span className={isCritical ? "text-red-400" : "text-zinc-400"}>{percentChange}%</span>
             <span className="text-zinc-600">vs last hour</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${status}`} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isCritical ? "#ef4444" : "#10b981"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isCritical ? "#ef4444" : "#10b981"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time"
              hide
            />
            <YAxis 
              hide
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            {/* Custom Grid */}
            <ReferenceLine y={50} stroke="#3f3f46" strokeDasharray="3 3" opacity={0.2} />
            <ReferenceLine y={100} stroke="#3f3f46" strokeDasharray="3 3" opacity={0.2} />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke={isCritical ? "#ef4444" : "#10b981"}
              strokeWidth={3}
              fill={`url(#gradient-${status})`}
              animationDuration={2000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer / Status Bar */}
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
        <div className="flex gap-2">
            {[1,2,3,4].map(i => (
                <div key={i} className={`h-1 w-8 rounded-full ${
                    i <= (isCritical ? 1 : 4) 
                    ? (isCritical ? "bg-red-500/50" : "bg-emerald-500/50") 
                    : "bg-zinc-800"
                }`} />
            ))}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border flex items-center gap-2 ${
          isCritical 
            ? "bg-red-500/10 text-red-500 border-red-500/20" 
            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        }`}>
          {isCritical ? <Zap className="w-3 h-3" /> : <Circle className="w-3 h-3 fill-current" />}
          {status}
        </div>
      </div>
    </motion.div>
  );
}

export default MetricVisualizer;
