"use client";

import { useState } from "react";
import { validateRepo } from "@/lib/github";
import { addWatchedRepo } from "@/lib/storage";
import { WatchedRepo } from "@/lib/types";

interface AddRepoFormProps {
  token: string;
  onAdd: (repos: WatchedRepo[]) => void;
}

export default function AddRepoForm({ token, onAdd }: AddRepoFormProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    const match = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
    if (!match) {
      setError("Use owner/repo format");
      return;
    }

    setLoading(true);
    setError("");

    const repo = await validateRepo(token, match[1], match[2]);
    if (repo) {
      const updated = addWatchedRepo(repo);
      onAdd(updated);
      setInput("");
    } else {
      setError("Repository not found.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="owner/repo"
          className="w-full font-mono bg-white border border-[#DFE1E6] rounded-md px-3 py-2 text-[#172B4D] placeholder-[#B3BAC5] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] text-sm transition-colors"
          disabled={loading}
        />
        {error && (
          <p className="absolute -bottom-5 left-0 text-[#E11D48] text-xs">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-[#DFE1E6] disabled:text-[#6B778C] text-white font-medium px-4 py-2 rounded-md transition-colors text-sm whitespace-nowrap"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
