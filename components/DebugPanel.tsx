"use client";

import { useEffect, useState } from "react";
import { logger, type LogEntry } from "@/lib/logger";
import { Bug, X, Trash2, RefreshCw, Globe, GitCommit, Clock, Server } from "lucide-react";

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [deployInfo, setDeployInfo] = useState<{
    commit?: string;
    deployedAt?: string;
    url?: string;
    environment?: string;
  }>({});

  useEffect(() => {
    setLogs(logger.getLogs());

    const interval = setInterval(() => {
      setLogs(logger.getLogs());
    }, 1000);

    fetch("/api/debug-info")
      .then((res) => res.json())
      .then(setDeployInfo)
      .catch(() => {});

    return () => clearInterval(interval);
  }, []);

  const refreshLogs = () => {
    setLogs(logger.getLogs());
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR": return "text-red-400";
      case "WARN": return "text-yellow-400";
      case "DEBUG": return "text-gray-400";
      default: return "text-green-400";
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-50 p-3 bg-lime-400 text-black rounded-full shadow-lg hover:bg-lime-300 transition-colors"
        title="Debug Panel"
      >
        <Bug size={20} />
      </button>

      {isOpen && (
        <div className="fixed bottom-32 right-4 z-50 w-96 max-h-[70vh] bg-[#0a1628] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0f2744]">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Bug size={16} className="text-lime-400" />
              Debug Panel
            </h3>
            <div className="flex gap-2">
              <button onClick={refreshLogs} className="p-2 text-white/60 hover:text-white" title="Refresh">
                <RefreshCw size={14} />
              </button>
              <button onClick={clearLogs} className="p-2 text-white/60 hover:text-red-400" title="Clear">
                <Trash2 size={14} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 text-white/60 hover:text-white">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-white/10 bg-[#0f2744]/50">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <GitCommit size={14} className="text-orange-400" />
                <span className="truncate">{deployInfo.commit?.slice(0, 7) || "loading..."}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Clock size={14} className="text-blue-400" />
                <span className="truncate">{deployInfo.deployedAt ? new Date(deployInfo.deployedAt).toLocaleString() : "loading..."}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Globe size={14} className="text-purple-400" />
                <span className="truncate">{deployInfo.url || window.location.href}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Server size={14} className="text-green-400" />
                <span>{deployInfo.environment || process.env.NODE_ENV}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {logs.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-4">No logs yet</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-xs p-2 bg-white/5 rounded font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-white/30">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className={`${getLevelColor(log.level)} font-bold`}>[{log.level}]</span>
                    <span className="text-orange-400">{log.category}</span>
                  </div>
                  <p className="text-white/80 mt-1">{log.message}</p>
                  {log.data && (
                    <pre className="text-white/50 mt-1 text-[10px] overflow-x-auto">
                      {typeof log.data === "object" ? JSON.stringify(log.data, null, 2) : String(log.data)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}