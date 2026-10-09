"use client";

import { DashboardStats } from "@/lib/types";

interface StatsGridProps {
  stats: DashboardStats;
  loading: boolean;
}

const cards = [
  {
    key: "totalRepos" as const,
    label: "Watched Repos",
    icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    key: "totalIssues" as const,
    label: "Open Issues",
    icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    key: "totalPRs" as const,
    label: "My PRs",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    key: "mergedPRs" as const,
    label: "Merged PRs",
    icon: "M5 13l4 4L19 7",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

export default function StatsGrid({ stats, loading }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`${card.bg} p-2 rounded-lg`}>
              <svg className={`w-5 h-5 ${card.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
              </svg>
            </div>
            <span className="text-sm text-gray-400">{card.label}</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {loading ? (
              <span className="inline-block w-12 h-8 bg-gray-800 rounded animate-pulse" />
            ) : (
              stats[card.key]
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
