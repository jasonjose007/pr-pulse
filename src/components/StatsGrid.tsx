"use client";

import { DashboardStats } from "@/lib/types";

interface StatsGridProps {
  stats: DashboardStats;
  loading: boolean;
}

const items = [
  { key: "totalRepos" as const, label: "Repos watched" },
  { key: "totalIssues" as const, label: "Open issues" },
  { key: "totalPRs" as const, label: "Pull requests" },
  { key: "mergedPRs" as const, label: "Merged" },
];

export default function StatsGrid({ stats, loading }: StatsGridProps) {
  return (
    <div className="flex items-end gap-12">
      {items.map((item) => (
        <div key={item.key}>
          <p className="font-mono text-4xl font-semibold text-[#172B4D] tabular-nums">
            {loading ? (
              <span className="inline-block w-10 h-9 bg-[#DFE1E6] rounded animate-pulse" />
            ) : (
              stats[item.key]
            )}
          </p>
          <p className="text-sm text-[#6B778C] mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
