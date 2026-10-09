"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRateLimit } from "@/lib/github";
import { useEffect, useState } from "react";
import { RateLimit } from "@/lib/types";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/repos", label: "Repos" },
  { href: "/issues", label: "Issues" },
  { href: "/prs", label: "My PRs" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRateLimit(getRateLimit());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white border-b border-[#DFE1E6]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-10">
            <Link href="/" className="font-mono text-base font-semibold tracking-tight text-[#172B4D]">
              pr-pulse
            </Link>
            <div className="flex items-center gap-1">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      active
                        ? "font-medium text-[#6366F1] bg-indigo-50"
                        : "text-[#6B778C] hover:text-[#172B4D] hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          {rateLimit && (
            <span className="font-mono text-xs text-[#6B778C]">
              {rateLimit.remaining}/{rateLimit.limit}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
