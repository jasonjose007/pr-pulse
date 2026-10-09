"use client";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <h3 className="text-base font-medium text-[#172B4D] mb-1">{title}</h3>
      <p className="text-sm text-[#6B778C] text-center max-w-xs">{description}</p>
      {action && (
        <a
          href={action.href}
          className="mt-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
