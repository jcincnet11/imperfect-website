"use client";

import { useState } from "react";

export default function CopyBoilerplateButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-sm font-semibold px-4 py-2 rounded-lg border transition-all ${
        copied
          ? "bg-green-500/10 border-green-500/30 text-green-400"
          : "bg-[#c5d400]/10 border-[#c5d400]/20 text-[#c5d400] hover:bg-[#c5d400]/20"
      }`}
    >
      {copied ? "Copied!" : "Copy Boilerplate"}
    </button>
  );
}
