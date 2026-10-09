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

const labelStyles: Record<string, string> = {
  "good first issue": "bg-lime-50 text-lime-700 border-lime-200",
  "help wanted": "bg-sky-50 text-sky-700 border-sky-200",
  bug: "bg-red-50 text-red-700 border-red-200",
  enhancement: "bg-violet-50 text-violet-700 border-violet-200",
  documentation: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="bg-white border border-[#DFE1E6] rounded-lg px-4 py-3.5 hover:border-[#6366F1]/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <a
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#172B4D] font-medium hover:text-[#6366F1] transition-colors text-sm leading-snug"
          >
            {issue.title}
          </a>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
            <span className="font-mono text-xs text-[#6B778C]">
              {issue.repo}#{issue.number}
            </span>
            {issue.labels.map((label) => (
              <span
                key={label}
                className={`text-[11px] px-1.5 py-0.5 rounded border ${
                  labelStyles[label] || "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {label}
              </span>
            ))}
            {issue.comments > 0 && (
              <span className="text-xs text-[#6B778C]">
                {issue.comments} comment{issue.comments !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <span className="font-mono text-xs text-[#B3BAC5] shrink-0 mt-0.5">
          {timeAgo(issue.createdAt)}
        </span>
      </div>
    </div>
  );
}
