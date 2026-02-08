"use client";

import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { Send, Zap, Activity, Grid3X3, Command, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  const messages = (thread?.messages || []).filter(m => m.role !== "system");

  return (
    <main className="h-screen flex bg-zinc-950 text-zinc-100 overflow-hidden font-sans bg-mesh selection:bg-blue-500/30">
      {/* Sidebar - Chat Interface */}
      <div className="w-[420px] min-w-[380px] flex flex-col glass-panel relative z-20 shadow-2xl">
        {/* Header */}
        <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide">SRE-0</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Ops Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
            <span className="text-xs text-zinc-500 font-medium">Connected</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {/* Empty State */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center mb-6">
                <Command className="w-8 h-8 text-zinc-600" />
              </div>
              <h2 className="text-lg font-medium text-white mb-2">Initialize Operations</h2>
              <p className="text-sm text-zinc-500 max-w-[260px] mx-auto leading-relaxed">
                Describe the incident or query. SRE-0 constructs the interface you need in real-time.
              </p>
              
              <div className="mt-8 grid gap-2">
                {[
                  { label: "Production latency spike", desc: "Visualize metrics" },
                  { label: "Payment service errors", desc: "Analyze logs" },
                  { label: "Restart failing nodes", desc: "Execute actions" }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setQuickInput(item.label)}
                    className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left"
                  >
                    <div>
                      <p className="text-xs font-medium text-zinc-200">{item.label}</p>
                      <p className="text-[10px] text-zinc-500">{item.desc}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat History */}
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`group flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-zinc-100 text-zinc-900 font-medium"
                      : "bg-white/5 text-zinc-300 border border-white/5"
                  }`}
                >
                  {Array.isArray(message.content) ? (
                    message.content.map((part, i) =>
                      part.type === "text" ? (
                        <div key={i} className="prose prose-invert prose-sm max-w-none">
                           <ReactMarkdown 
                             remarkPlugins={[remarkGfm]}
                             components={{
                               p: ({children}) => <p className="mb-0 last:mb-0 leading-relaxed">{children}</p>,
                               strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                               code: ({children}) => <code className="bg-black/30 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                             }}
                           >
                              {part.text}
                           </ReactMarkdown>
                        </div>
                      ) : null
                    )
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                       <ReactMarkdown>{String(message.content)}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-1"
            >
              <span className="text-xs font-medium text-blue-500">SRE-0</span>
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-zinc-950/50 backdrop-blur-xl">
          <form 
            onSubmit={handleSubmit} 
            className="relative flex items-center bg-zinc-900/50 border border-white/10 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50 transition-all shadow-inner"
          >
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type a command..."
              className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending || !value.trim()}
              className="absolute right-2 p-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-0 disabled:scale-75 transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 flex justify-center">
            <p className="text-[10px] text-zinc-600 flex items-center gap-1">
              <Command className="w-3 h-3" /> + K to focus
            </p>
          </div>
        </div>
      </div>

      {/* Main Canvas - The "Stage" */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-black/20">
        {/* Spotlights */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

        {/* Canvas Header */}
        <div className="h-16 px-8 flex items-center justify-between z-30 relative bg-zinc-950/50 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <h2 className="text-zinc-400 font-medium text-sm flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Canvas
            </h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/5">
               <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
               <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Live</span>
             </div>
             <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
               us-east-1
             </span>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 overflow-y-auto relative z-10 scroll-smooth custom-scrollbar">
          <div className="min-h-full w-full flex flex-col items-center justify-center p-8">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto rounded-full border border-white/5 flex items-center justify-center animate-pulse-glow">
                    <Activity className="w-8 h-8 text-zinc-700" />
                  </div>
                  <p className="mt-4 text-sm text-zinc-600 font-medium">Waiting for signal...</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="w-full max-w-4xl grid gap-6"
                  layout
                >
                  {/* Rendered components from Tambo */}
                  {messages.map((message, index) => (
                    <div key={message.id || index}>
                      {message.renderedComponent && (
                        <motion.div
                          initial={{ opacity: 0, y: 40, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            delay: index * 0.1 
                          }}
                          className="perspective-1000"
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
      </div>
    </main>
  );
}
