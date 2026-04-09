import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: LucideIcon;
  iconColor?: string;
  suffix?: string;
  progress?: number; // 0-100 pour barre de progression
  progressLabel?: string;
}

export default function StatsCard({
  title,
  value,
  delta,
  deltaLabel = "vs sem. dern.",
  icon: Icon,
  iconColor = "text-blue-400",
  suffix,
  progress,
  progressLabel,
}: StatsCardProps) {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <Card className="bg-[#1E293B] border-[#334155]">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 font-medium truncate">{title}</p>
            <p className="text-2xl font-bold text-white mt-1 leading-none">
              {value}
              {suffix && <span className="text-sm text-slate-400 ml-1">{suffix}</span>}
            </p>
            {delta !== undefined && (
              <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? "+" : ""}{delta} {deltaLabel}
              </div>
            )}
          </div>
          {Icon && (
            <div className={`w-9 h-9 rounded-lg bg-[#0F172A] flex items-center justify-center shrink-0 ${iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        {progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progression</span>
              <span>{progressLabel || `${progress}%`}</span>
            </div>
            <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
