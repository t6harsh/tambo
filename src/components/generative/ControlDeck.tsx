"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, 
  RotateCcw, 
  Scale, 
  Power, 
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

interface ControlDeckProps {
  serviceId: string;
  actions?: string[]; // Made optional for safety
}

type ActionState = "idle" | "loading" | "success" | "error";

interface ActionConfig {
  icon: React.ReactNode;
  gradient: string;
  text: string;
  desc: string;
}

function getActionConfig(action: string): ActionConfig {
  const lowerAction = action.toLowerCase();
  
  if (lowerAction.includes("restart")) {
    return {
      icon: <RefreshCw className="w-5 h-5" />,
      gradient: "from-amber-500 to-orange-500",
      text: "text-amber-500",
      desc: "Graceful restart (30s)"
    };
  }
  if (lowerAction.includes("rollback")) {
    return {
      icon: <RotateCcw className="w-5 h-5" />,
      gradient: "from-blue-500 to-indigo-500",
      text: "text-blue-500",
      desc: "Revert to v1.0.2"
    };
  }
  if (lowerAction.includes("scale")) {
    return {
      icon: <Scale className="w-5 h-5" />,
      gradient: "from-purple-500 to-pink-500",
      text: "text-purple-500",
      desc: "Add 2 replicas"
    };
  }
  
  return {
    icon: <Power className="w-5 h-5" />,
    gradient: "from-red-500 to-rose-600",
    text: "text-red-500",
    desc: "Emergency Stop"
  };
}

export function ControlDeck({ serviceId, actions = [] }: ControlDeckProps) {
  const safeActions = Array.isArray(actions) ? actions : [];
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleAction = async (action: string) => {
    setActionStates(prev => ({ ...prev, [action]: "loading" }));
    await new Promise(resolve => setTimeout(resolve, 2000));
    setActionStates(prev => ({ ...prev, [action]: "success" }));
    setToast({ message: "Operation Executed Successfully", type: "success" });
    
    setTimeout(() => {
      setActionStates(prev => ({ ...prev, [action]: "idle" }));
    }, 3000);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto"
    >
      {/* Card Container */}
      <div className="glass-card rounded-2xl p-1 overflow-hidden bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/5 shadow-2xl">
        <div className="bg-[#0c0c0e] rounded-xl p-6">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20 shadow-lg shadow-orange-900/20">
              <ShieldAlert className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">Remediation Deck</h3>
              <p className="text-xs text-zinc-500 font-medium">Target: <span className="text-zinc-300 font-mono">{serviceId}</span></p>
            </div>
          </div>

          {/* Actions List */}
          <div className="space-y-3">
            {safeActions.length === 0 ? (
                <p className="text-zinc-600 text-sm">No actions available.</p>
            ) : (
                safeActions.map((action) => {
                const config = getActionConfig(action);
                const state = actionStates[action] || "idle";
                const isLoading = state === "loading";
                const isSuccess = state === "success";

                return (
                    <button
                        key={action}
                        onClick={() => handleAction(action)}
                        disabled={isLoading || isSuccess}
                        className="group relative w-full overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-4 transition-all hover:border-white/10 hover:bg-zinc-800 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {/* Progress Bar Background */}
                        {isLoading && (
                        <motion.div 
                            layoutId="progress"
                            className="absolute inset-0 bg-white/5 w-full h-full origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 2, ease: "linear" }}
                        />
                        )}

                        <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg bg-white/5 transition-colors group-hover:bg-white/10 ${isLoading ? "animate-pulse" : ""}`}>
                                {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : config.icon}
                            </div>
                            <div className="text-left">
                            <p className={`text-sm font-semibold transition-colors ${isSuccess ? "text-emerald-500" : "text-zinc-200"}`}>
                                {action}
                            </p>
                            <p className="text-[11px] text-zinc-500">{config.desc}</p>
                            </div>
                        </div>

                        <div className="pr-2">
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                            ) : isSuccess ? (
                                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Done</span>
                            ) : (
                                <ArrowRight className="w-4 h-4 text-zinc-600 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                            )}
                        </div>
                        </div>
                    </button>
                    );
                })
            )}
          </div>

          {/* Footer Warning */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-start gap-3 opacity-60">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              <strong>Simulated Action:</strong> Executing these commands will not affect actual infrastructure. This is a demonstration environment.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-zinc-900 border border-white/10 shadow-2xl flex items-center gap-3 z-50"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-white">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ControlDeck;
