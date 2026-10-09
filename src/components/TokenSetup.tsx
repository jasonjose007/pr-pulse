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
      setError("Invalid token. Make sure it has 'repo' scope.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <svg className="w-16 h-16 text-emerald-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h1 className="text-3xl font-bold text-white mb-2">PR Pulse</h1>
          <p className="text-gray-400">Track your open-source contributions across GitHub repos</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Connect GitHub</h2>
          <p className="text-sm text-gray-400 mb-4">
            Enter a GitHub Personal Access Token with <code className="text-emerald-400 bg-gray-800 px-1.5 py-0.5 rounded text-xs">repo</code> scope.
            Your token stays in your browser and is only sent to api.github.com.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? "Verifying..." : "Connect"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Create a token at{" "}
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                GitHub Settings → Tokens
              </a>
              . Select <strong>repo</strong> scope.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
