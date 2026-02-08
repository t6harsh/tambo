"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, 
  RotateCcw, 
  Scale, 
  Power, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Shield
} from "lucide-react";

interface ControlDeckProps {
  serviceId: string;
  actions: string[];
}

type ActionState = "idle" | "loading" | "success" | "error";

interface ActionConfig {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

function getActionConfig(action: string): ActionConfig {
  const lowerAction = action.toLowerCase();
  
  if (lowerAction.includes("restart")) {
    return {
      icon: <RefreshCw className="w-4 h-4" />,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30",
      description: "~30s downtime expected"
    };
  }
  if (lowerAction.includes("rollback")) {
    return {
      icon: <RotateCcw className="w-4 h-4" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30",
      description: "Revert to previous version"
    };
  }
  if (lowerAction.includes("scale")) {
    return {
      icon: <Scale className="w-4 h-4" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30",
      description: "Add more replicas"
    };
  }
  if (lowerAction.includes("stop") || lowerAction.includes("kill")) {
    return {
      icon: <Power className="w-4 h-4" />,
      color: "text-red-400",
      bgColor: "bg-red-500/20 hover:bg-red-500/30 border-red-500/30",
      description: "Complete service shutdown"
    };
  }
  
  return {
    icon: <Shield className="w-4 h-4" />,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/30",
    description: "Execute action"
  };
}

export function ControlDeck({ serviceId, actions }: ControlDeckProps) {
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleAction = async (action: string) => {
    setActionStates(prev => ({ ...prev, [action]: "loading" }));
    
    // Simulate action execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setActionStates(prev => ({ ...prev, [action]: "success" }));
    setToast({ 
      message: `${action} executed successfully on ${serviceId}`, 
      type: "success" 
    });
    
    // Reset after delay
    setTimeout(() => {
      setActionStates(prev => ({ ...prev, [action]: "idle" }));
    }, 3000);
    
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-6 glass border border-amber-500/30 glow-cyan"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Control Deck</h3>
            <p className="text-xs text-gray-400">Remediation actions for {serviceId}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30">
          High-Risk Actions
        </span>
      </div>

      {/* Warning */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-400">Simulated Environment</p>
          <p className="text-xs text-gray-400 mt-1">
            These actions are mocked for demonstration. In production, they would execute real infrastructure changes.
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid gap-3">
        {actions.map((action) => {
          const config = getActionConfig(action);
          const state = actionStates[action] || "idle";
          
          return (
            <motion.button
              key={action}
              onClick={() => handleAction(action)}
              disabled={state === "loading"}
              whileHover={{ scale: state === "loading" ? 1 : 1.02 }}
              whileTap={{ scale: state === "loading" ? 1 : 0.98 }}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${config.bgColor} ${
                state === "loading" ? "opacity-70 cursor-wait" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={config.color}>
                  {state === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : state === "success" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    config.icon
                  )}
                </span>
                <div className="text-left">
                  <p className={`font-medium ${config.color}`}>{action}</p>
                  <p className="text-xs text-gray-400">{config.description}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                state === "success" 
                  ? "bg-green-500/20 text-green-400" 
                  : state === "loading"
                  ? "bg-gray-500/20 text-gray-400"
                  : "bg-white/5 text-gray-400"
              }`}>
                {state === "success" ? "Done" : state === "loading" ? "Executing..." : "Ready"}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg flex items-center gap-3 ${
              toast.type === "success" 
                ? "bg-green-500/20 border border-green-500/30 text-green-400" 
                : "bg-red-500/20 border border-red-500/30 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ControlDeck;
