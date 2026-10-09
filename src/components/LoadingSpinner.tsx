"use client";

export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-[#DFE1E6] border-t-[#6366F1] rounded-full animate-spin mb-3" />
      <p className="text-sm text-[#6B778C]">{text}</p>
    </div>
  );
}
