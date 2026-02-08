"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, AlertTriangle, Info, Bug } from "lucide-react";

interface LogStreamProps {
  serviceName: string;
  logLines: string[];
  highlightError: boolean;
}

type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG";

function parseLogLevel(line: string): LogLevel {
  if (line.includes("ERROR") || line.includes("error") || line.includes("failed") || line.includes("exception")) {
    return "ERROR";
  }
  if (line.includes("WARN") || line.includes("warning")) {
    return "WARN";
  }
  if (line.includes("DEBUG")) {
    return "DEBUG";
  }
  return "INFO";
}

function getLogIcon(level: LogLevel) {
  switch (level) {
    case "ERROR":
      return <AlertTriangle className="w-3 h-3 text-red-400" />;
    case "WARN":
      return <AlertTriangle className="w-3 h-3 text-amber-400" />;
    case "DEBUG":
      return <Bug className="w-3 h-3 text-purple-400" />;
    default:
      return <Info className="w-3 h-3 text-blue-400" />;
  }
}

function getLogColor(level: LogLevel): string {
  switch (level) {
    case "ERROR":
      return "text-red-400 bg-red-500/10 border-l-2 border-red-500";
    case "WARN":
      return "text-amber-400 bg-amber-500/10 border-l-2 border-amber-500";
    case "DEBUG":
      return "text-purple-400";
    default:
      return "text-gray-300";
  }
}

export function LogStream({ serviceName, logLines, highlightError }: LogStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logLines, highlightError]);

  const errorCount = logLines.filter(line => parseLogLevel(line) === "ERROR").length;
  const warnCount = logLines.filter(line => parseLogLevel(line) === "WARN").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden glass border border-[var(--border-color)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--card-bg)] border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">{serviceName}</h3>
            <p className="text-xs text-gray-400">Log Stream</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {errorCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
              <AlertTriangle className="w-3 h-3" />
              {errorCount} errors
            </span>
          )}
          {warnCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs">
              {warnCount} warnings
            </span>
          )}
          <span className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live
          </span>
        </div>
      </div>

      {/* Log Content */}
      <div 
        ref={scrollRef}
        className="h-64 overflow-y-auto bg-[#0d0d12] font-mono text-sm"
      >
        {logLines.map((line, index) => {
          const level = parseLogLevel(line);
          const isError = level === "ERROR";
          
          return (
            <motion.div
              key={index}
              ref={isError && highlightError ? errorRef : null}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`flex items-start gap-2 px-4 py-1.5 hover:bg-white/5 ${getLogColor(level)}`}
            >
              <span className="text-gray-600 select-none w-8 text-right shrink-0">
                {(index + 1).toString().padStart(3, "0")}
              </span>
              <span className="shrink-0 mt-0.5">{getLogIcon(level)}</span>
              <span className="break-all">{line}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-[var(--card-bg)] border-t border-[var(--border-color)] flex items-center justify-between text-xs text-gray-400">
        <span>{logLines.length} lines</span>
        <span>Auto-scroll: {highlightError ? "Jump to errors" : "Latest"}</span>
      </div>
    </motion.div>
  );
}

export default LogStream;
