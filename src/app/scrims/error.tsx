"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function ScrimsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("[scrims] page error", { error: String(error) });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center" style={{ backgroundColor: "#111111" }}>
      <h2 className="font-heading font-black text-2xl text-white mb-2">
        Something went wrong
      </h2>
      <p className="text-white/40 text-sm mb-6 max-w-sm">
        Failed to load the scrim application form. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 text-sm font-semibold uppercase tracking-wide rounded"
        style={{ backgroundColor: "#c5d400", color: "#0d0d0d" }}
      >
        Try again
      </button>
    </div>
  );
}
