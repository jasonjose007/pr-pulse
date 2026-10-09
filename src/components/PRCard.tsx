"use client";

import { GitHubPR } from "@/lib/types";

interface PRCardProps {
  pr: GitHubPR;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const stateConfig = {
  open: { dot: "bg-[#0284C7]", label: "Open" },
  merged: { dot: "bg-[#8B5CF6]", label: "Merged" },
  closed: { dot: "bg-[#E11D48]", label: "Closed" },
};

export default function PRCard({ pr }: PRCardProps) {
  const state = stateConfig[pr.state];

  return (
    <div className="bg-white border border-[#DFE1E6] rounded-lg px-4 py-3.5 hover:border-[#6366F1]/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <a
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#172B4D] font-medium hover:text-[#6366F1] transition-colors text-sm leading-snug"
          >
            {pr.title}
          </a>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono text-xs text-[#6B778C]">
              {pr.repo}#{pr.number}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#6B778C]">
              <span className={`w-2 h-2 rounded-full ${state.dot}`} />
              {state.label}
            </span>
            {pr.draft && (
              <span className="text-xs text-[#B3BAC5]">Draft</span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="font-mono text-xs text-[#B3BAC5]">
            {timeAgo(pr.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
