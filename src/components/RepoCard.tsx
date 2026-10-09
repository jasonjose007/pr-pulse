"use client";

import { WatchedRepo } from "@/lib/types";

interface RepoCardProps {
  repo: WatchedRepo;
  onRemove: (fullName: string) => void;
}

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-400",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-400",
  Rust: "bg-orange-400",
  Go: "bg-cyan-400",
  Java: "bg-red-400",
  "C++": "bg-pink-400",
  C: "bg-gray-400",
  Ruby: "bg-red-500",
  Swift: "bg-orange-500",
  Kotlin: "bg-purple-400",
  Unknown: "bg-gray-500",
};

export default function RepoCard({ repo, onRemove }: RepoCardProps) {
  const dotColor = languageColors[repo.language] || "bg-gray-500";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <a
            href={`https://github.com/${repo.fullName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold hover:text-emerald-400 transition-colors text-sm"
          >
            <span className="text-gray-500">{repo.owner}/</span>
            {repo.name}
          </a>
          {repo.description && (
            <p className="text-gray-400 text-sm mt-1.5 line-clamp-2">{repo.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
              <span className="text-xs text-gray-400">{repo.language}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs text-gray-400">{repo.stars.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onRemove(repo.fullName)}
          className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
          title="Remove repo"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
