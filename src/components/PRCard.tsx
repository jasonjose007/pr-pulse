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

const stateStyles = {
  open: {
    bg: "bg-green-400/15",
    text: "text-green-400",
    border: "border-green-400/30",
    label: "Open",
    icon: "M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829",
  },
  merged: {
    bg: "bg-purple-400/15",
    text: "text-purple-400",
    border: "border-purple-400/30",
    label: "Merged",
    icon: "M5 13l4 4L19 7",
  },
  closed: {
    bg: "bg-red-400/15",
    text: "text-red-400",
    border: "border-red-400/30",
    label: "Closed",
    icon: "M6 18L18 6M6 6l12 12",
  },
};

export default function PRCard({ pr }: PRCardProps) {
  const style = stateStyles[pr.state];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-gray-500 font-medium">{pr.repo}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">#{pr.number}</span>
          </div>
          <a
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-medium hover:text-emerald-400 transition-colors text-sm leading-snug"
          >
            {pr.title}
          </a>
          <div className="flex items-center gap-3 mt-3">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={style.icon} />
              </svg>
              {style.label}
            </span>
            {pr.draft && (
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">Draft</span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs text-gray-500">{timeAgo(pr.createdAt)}</span>
          <div className="text-xs text-gray-600 mt-1">
            updated {timeAgo(pr.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
