"use client";

import { useState } from "react";
import { getAuthenticatedUser } from "@/lib/github";
import { setToken } from "@/lib/storage";

interface TokenSetupProps {
  onComplete: (username: string) => void;
}

export default function TokenSetup({ onComplete }: TokenSetupProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");

    const username = await getAuthenticatedUser(trimmed);
    if (username) {
      setToken(trimmed);
      onComplete(username);
    } else {
      setError("Invalid token. Make sure it has repo scope.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="mb-8">
          <h1 className="font-mono text-2xl font-semibold tracking-tight text-[#172B4D] mb-2">
            pr-pulse
          </h1>
          <p className="text-[#6B778C] text-sm leading-relaxed">
            Track your contributions across the repos you care about.
            Connect a GitHub token to get started.
          </p>
        </div>

        <div className="bg-white border border-[#DFE1E6] rounded-lg p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#172B4D] mb-1.5">
                Personal access token
              </label>
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full font-mono bg-[#F4F5F7] border border-[#DFE1E6] rounded-md px-3 py-2.5 text-[#172B4D] placeholder-[#B3BAC5] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] text-sm transition-colors"
                disabled={loading}
              />
              <p className="text-xs text-[#6B778C] mt-1.5">
                Needs <code className="font-mono text-[#172B4D] bg-[#F4F5F7] px-1 py-0.5 rounded text-[11px]">repo</code> scope.
                Stored in your browser only.
              </p>
            </div>
            {error && (
              <p className="text-[#E11D48] text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-[#DFE1E6] disabled:text-[#6B778C] text-white font-medium py-2.5 rounded-md transition-colors text-sm"
            >
              {loading ? "Verifying..." : "Connect"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#DFE1E6]">
            <p className="text-xs text-[#6B778C]">
              Create one at{" "}
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6366F1] hover:underline"
              >
                github.com/settings/tokens
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
