export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  category: string;
  message: string;
  data?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 500;

  private addLog(level: LogEntry["level"], category: string, message: string, data?: unknown) {
    if (typeof window === "undefined") return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
    };
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const prefix = `[${level}] [${category}]`;
    const color = level === "ERROR" ? "#ff4444" : level === "WARN" ? "#ffaa00" : level === "DEBUG" ? "#888888" : "#22c55e";
    console.log(`%c${prefix} ${message}`, `color: ${color}`, data || "");
  }

  info(category: string, message: string, data?: unknown) {
    if (typeof window === "undefined") return;
    this.addLog("INFO", category, message, data);
  }

  warn(category: string, message: string, data?: unknown) {
    if (typeof window === "undefined") return;
    this.addLog("WARN", category, message, data);
  }

  error(category: string, message: string, data?: unknown) {
    if (typeof window === "undefined") return;
    this.addLog("ERROR", category, message, data);
  }

  debug(category: string, message: string, data?: unknown) {
    if (typeof window === "undefined") return;
    this.addLog("DEBUG", category, message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();

export async function getDeployInfo(): Promise<{ commit: string; timestamp: string; url: string; buildNumber: string }> {
  try {
    const res = await fetch("/api/debug-info");
    const data = await res.json();
    return {
      commit: data.commit || "unknown",
      timestamp: data.timestamp || "unknown",
      url: data.url || window.location.href,
      buildNumber: data.buildNumber || process.env.NEXT_PUBLIC_BUILD_NUMBER || "dev",
    };
  } catch {
    return {
      commit: "unknown",
      timestamp: "unknown",
      url: window.location.href,
      buildNumber: process.env.NEXT_PUBLIC_BUILD_NUMBER || "dev",
    };
  }
}