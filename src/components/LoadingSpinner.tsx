"use client";

export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-gray-700 border-t-emerald-400 rounded-full animate-spin mb-4" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
