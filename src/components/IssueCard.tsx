"use client";

import { GitHubIssue } from "@/lib/types";

interface IssueCardProps {
  issue: GitHubIssue;
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

const labelColors: Record<string, string> = {
  "good first issue": "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
  "help wanted": "bg-blue-400/15 text-blue-400 border-blue-400/30",
  bug: "bg-red-400/15 text-red-400 border-red-400/30",
  enhancement: "bg-purple-400/15 text-purple-400 border-purple-400/30",
  documentation: "bg-amber-400/15 text-amber-400 border-amber-400/30",
};

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-gray-500 font-medium">{issue.repo}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">#{issue.number}</span>
          </div>
          <a
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-medium hover:text-emerald-400 transition-colors text-sm leading-snug"
          >
            {issue.title}
          </a>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {issue.labels.map((label) => (
              <span
                key={label}
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  labelColors[label] || "bg-gray-800 text-gray-400 border-gray-700"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs text-gray-500">{timeAgo(issue.createdAt)}</span>
          {issue.comments > 0 && (
            <div className="flex items-center gap-1 mt-1.5 justify-end">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs text-gray-500">{issue.comments}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
