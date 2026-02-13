"use client";

import { useEffect, useState } from "react";
import { Share2, Check } from "lucide-react";
import { useWeddingTemplate, WeddingTemplateState } from "./WeddingTemplateProvider";

/** Strip large binary data (images/files) from state to keep the share link small. */
function stripBinaryData(state: WeddingTemplateState): WeddingTemplateState {
  return {
    ...state,
    inspiration: {
      ...state.inspiration,
      images: [],
      files: [],
    },
    timeline: state.timeline.map((t) => ({
      ...t,
      images: undefined,
      files: undefined,
    })),
  };
}

async function compressState(state: WeddingTemplateState): Promise<string> {
  const stripped = stripBinaryData(state);
  const json = JSON.stringify(stripped);
  const bytes = new TextEncoder().encode(json);
  const cs = new CompressionStream("gzip");
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const compressed = await new Response(cs.readable).arrayBuffer();
  const b64 = btoa(
    Array.from(new Uint8Array(compressed))
      .map((b) => String.fromCharCode(b))
      .join("")
  );
  // Make URL-safe
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function decompressState(encoded: string): Promise<WeddingTemplateState> {
  // Restore standard base64
  let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const ds = new DecompressionStream("gzip");
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const decompressed = await new Response(ds.readable).text();
  return JSON.parse(decompressed);
}

export function ShareButton() {
  const { state } = useWeddingTemplate();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      const encoded = await compressState(state);
      const url = `${window.location.origin}/?data=${encoded}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: prompt
      const encoded = await compressState(state);
      const url = `${window.location.origin}/?data=${encoded}`;
      window.prompt("Copy this link to share your wedding data:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="share-btn"
      title="Copy share link"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      <span className="hidden md:inline">
        {copied ? "Copied!" : "Share"}
      </span>
    </button>
  );
}

export function DataImporter() {
  const { replaceState } = useWeddingTemplate();
  const [imported, setImported] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (!data) return;

    (async () => {
      try {
        const state = await decompressState(data);
        replaceState(state);
        setImported(true);
        // Clean URL
        const clean = window.location.pathname;
        window.history.replaceState({}, "", clean);
        setTimeout(() => setImported(false), 4000);
      } catch {
        console.error("Failed to import shared data");
      }
    })();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!imported) return null;

  return (
    <div className="data-import-toast">
      <Check size={16} />
      <span>Wedding data loaded from shared link!</span>
    </div>
  );
}
