import type { LeadSource } from "@/lib/types";

const SOURCE_CONFIG: Record<LeadSource, { color: string }> = {
  SEO: { color: "bg-green-500/15 text-green-400 border-green-500/30" },
  "Ads Google": { color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  Instagram: { color: "bg-pink-500/15 text-pink-400 border-pink-500/30" },
  Facebook: { color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  LinkedIn: { color: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  Referral: { color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  Manuel: { color: "bg-gray-500/15 text-gray-400 border-gray-500/30" },
};

export default function SourceBadge({ source }: { source: LeadSource }) {
  const config = SOURCE_CONFIG[source];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {source}
    </span>
  );
}
