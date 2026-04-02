/**
 * Structured logger for API routes.
 * Emits JSON in production (compatible with Vercel Log Drains + Datadog/Logtail).
 * Emits readable output in development.
 */

type Level = "info" | "warn" | "error";

interface LogFields {
  msg: string;
  level?: Level;
  route?: string;
  method?: string;
  status?: number;
  durationMs?: number;
  userId?: string;
  [key: string]: unknown;
}

function emit(level: Level, fields: LogFields) {
  const entry = {
    level,
    ts: new Date().toISOString(),
    ...fields,
  };

  if (process.env.NODE_ENV === "production") {
    console.log(JSON.stringify(entry));
  } else {
    const { msg, ts: _ts, level: _lvl, ...rest } = entry;
    const prefix = level === "error" ? "\x1b[31mERROR\x1b[0m" : level === "warn" ? "\x1b[33mWARN\x1b[0m" : "\x1b[36mINFO\x1b[0m";
    const extra = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : "";
    console.log(`${prefix} ${msg}${extra}`);
  }
}

export const logger = {
  info: (msg: string, fields?: Omit<LogFields, "msg">) => emit("info", { msg, ...fields }),
  warn: (msg: string, fields?: Omit<LogFields, "msg">) => emit("warn", { msg, ...fields }),
  error: (msg: string, fields?: Omit<LogFields, "msg">) => emit("error", { msg, ...fields }),
};

/**
 * Log an API request/response. Call at the end of a route handler.
 * Usage:
 *   const start = Date.now();
 *   // ... handler logic ...
 *   logRequest(request, response, start, { userId: session?.user?.id });
 */
export function logRequest(
  request: { method: string; url: string },
  response: { status: number },
  startMs: number,
  extra?: Record<string, unknown>
) {
  const url = new URL(request.url);
  const durationMs = Date.now() - startMs;
  const level: Level = response.status >= 500 ? "error" : response.status >= 400 ? "warn" : "info";

  emit(level, {
    msg: `${request.method} ${url.pathname} ${response.status}`,
    route: url.pathname,
    method: request.method,
    status: response.status,
    durationMs,
    ...extra,
  });
}
