"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Copy, Check, ChevronRight } from "lucide-react";

interface LogStreamProps {
  serviceName: string;
  logLines?: string[]; // Made optional for safety
  highlightError: boolean;
}

type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG";

function parseLogLevel(line: string): LogLevel {
  if (line.includes("ERROR") || line.includes("error") || line.includes("failed") || line.includes("exception")) return "ERROR";
  if (line.includes("WARN") || line.includes("warning")) return "WARN";
  if (line.includes("DEBUG")) return "DEBUG";
  return "INFO";
}

export function LogStream({ serviceName, logLines = [], highlightError }: LogStreamProps) {
  const safeLogLines = useMemo(() => Array.isArray(logLines) ? logLines : [], [logLines]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (highlightError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [safeLogLines, highlightError]);

  const handleCopy = () => {
    navigator.clipboard.writeText(safeLogLines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-[#0d0d0d]"
    >
      {/* Mac-style Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] shadow-sm" />
          </div>
          <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-black/20 border border-white/5 text-[10px] font-mono text-zinc-400">
            <Terminal className="w-3 h-3" />
            <span>{serviceName}.log</span>
          </div>
        </div>
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-white/10 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Editor Content */}
      <div 
        ref={scrollRef}
        className="h-[350px] overflow-y-auto p-4 font-mono text-[13px] leading-6 bg-[#09090b] scrollbar-hide"
      >
        <div className="space-y-0.5">
          {safeLogLines.length === 0 ? (
             <p className="text-zinc-600 italic">No logs available.</p>
          ) : (
            safeLogLines.map((line, index) => {
              const level = parseLogLevel(line);
              const isError = level === "ERROR";
              const isWarn = level === "WARN";

              return (
                <motion.div
                  key={index}
                  ref={isError && highlightError ? errorRef : null}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`group flex items-start -mx-4 px-4 py-0.5 hover:bg-white/5 transition-colors ${
                    isError ? "bg-red-500/5" : ""
                  }`}
                >
                  {/* Line Number */}
                  <span className="text-zinc-700 w-8 text-right select-none pr-3 text-[11px] pt-0.5 opacity-50 font-medium">
                    {index + 1}
                  </span>

                  {/* Content */}
                  <div className="flex-1 flex gap-3 break-all">
                    <span className={`shrink-0 font-bold text-[10px] px-1.5 rounded h-5 flex items-center mt-0.5 ${
                      isError ? "bg-red-500/20 text-red-400" :
                      isWarn ? "bg-amber-500/20 text-amber-400" :
                      level === "DEBUG" ? "bg-purple-500/20 text-purple-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {level}
                    </span>
                    <span className={`font-medium ${
                      isError ? "text-red-300" :
                      isWarn ? "text-amber-200" :
                      "text-zinc-400 group-hover:text-zinc-300"
                    }`}>
                      {line.replace(/\[.*?\]/, "").trim()} 
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
          
          {/* Animated cursor at the end */}
          <div className="flex items-center gap-2 pl-8 pt-2">
            <ChevronRight className="w-3 h-3 text-blue-500" />
            <span className="w-2 h-4 bg-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default LogStream;
