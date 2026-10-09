"use client";

import { WatchedRepo } from "@/lib/types";

interface RepoCardProps {
  repo: WatchedRepo;
  onRemove: (fullName: string) => void;
}

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-green-600",
  Rust: "bg-orange-500",
  Go: "bg-sky-500",
  Java: "bg-red-500",
  "C++": "bg-pink-500",
  C: "bg-gray-500",
  Ruby: "bg-red-600",
  Swift: "bg-orange-600",
  Kotlin: "bg-violet-500",
  Unknown: "bg-gray-400",
};

export default function RepoCard({ repo, onRemove }: RepoCardProps) {
  const dotColor = languageColors[repo.language] || "bg-gray-400";

  return (
    <div className="bg-white border border-[#DFE1E6] rounded-lg p-4 group hover:border-[#6366F1]/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <a
            href={`https://github.com/${repo.fullName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-[#172B4D] hover:text-[#6366F1] transition-colors"
          >
            <span className="text-[#6B778C]">{repo.owner}/</span>
            <span className="font-medium">{repo.name}</span>
          </a>
          {repo.description && (
            <p className="text-[#6B778C] text-sm mt-1.5 leading-relaxed line-clamp-2">
              {repo.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${dotColor}`} />
              <span className="text-xs text-[#6B778C]">{repo.language}</span>
            </div>
            <span className="text-xs text-[#6B778C]">
              {repo.stars.toLocaleString()} stars
            </span>
          </div>
        </div>
        <button
          onClick={() => onRemove(repo.fullName)}
          className="text-[#DFE1E6] hover:text-[#E11D48] transition-colors opacity-0 group-hover:opacity-100 p-1"
          title="Remove"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
