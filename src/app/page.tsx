"use client";

import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { Send, Zap, AlertTriangle, Shield, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isPending) return;
    await submit();
  };

  const setQuickInput = (text: string) => {
    setValue(text);
  };

  const messages = thread?.messages || [];

  return (
    <main className="h-screen flex bg-[var(--background)]">
      {/* Left Panel - Chat */}
      <div className="w-[400px] min-w-[350px] border-r border-[var(--border-color)] flex flex-col glass">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--accent-cyan)]">SRE-0</h1>
            <p className="text-xs text-gray-400">Generative Ops Interface</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse"></span>
            <span className="text-xs text-gray-400">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-4 border border-[var(--border-color)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-[var(--accent-cyan)]" />
                <span className="text-sm font-semibold text-[var(--accent-cyan)]">System Ready</span>
              </div>
              <p className="text-sm text-gray-300">
                Describe what&apos;s happening in production and I&apos;ll render the right tools for you.
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-xs text-gray-500">Try saying:</p>
                <div className="flex flex-wrap gap-2">
                  {["Production seems slow", "Check payment service logs", "Show system metrics"].map((example) => (
                    <button
                      key={example}
                      onClick={() => setQuickInput(example)}
                      className="text-xs px-2 py-1 rounded bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-cyan)] transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Thread Messages */}
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                      : "glass border border-[var(--border-color)]"
                  }`}
                >
                  {/* Render message content */}
                  {Array.isArray(message.content) ? (
                    message.content.map((part, i) =>
                      part.type === "text" ? (
                        <p key={i} className="text-sm">{part.text}</p>
                      ) : null
                    )
                  ) : (
                    <p className="text-sm">{String(message.content)}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-[var(--accent-cyan)]"
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
              <span className="text-sm">Analyzing...</span>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border-color)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Describe the incident..."
              className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending || !value.trim()}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Header */}
        <div className="h-14 border-b border-[var(--border-color)] flex items-center justify-between px-6 glass">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[var(--accent-cyan)]" />
            <span className="font-semibold">Operations Canvas</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--accent-yellow)]" />
              Incident Mode
            </span>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center mb-6">
                  <Zap className="w-12 h-12 text-[var(--accent-cyan)] opacity-50" />
                </div>
                <h2 className="text-xl font-semibold text-gray-300 mb-2">Ready for Action</h2>
                <p className="text-sm text-gray-500 max-w-md">
                  Your operational tools will appear here as you describe incidents. 
                  The interface adapts to your needs in real-time.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid gap-4"
              >
                {/* Rendered components from Tambo */}
                {messages.map((message, index) => (
                  <div key={message.id || index}>
                    {message.renderedComponent && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {message.renderedComponent}
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
