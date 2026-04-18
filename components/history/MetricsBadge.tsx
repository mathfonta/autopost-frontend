import { type LucideIcon } from "lucide-react";

interface MetricsBadgeProps {
  icon: LucideIcon;
  value: number;
  label: string;
}

export function MetricsBadge({ icon: Icon, value, label }: MetricsBadgeProps) {
  return (
    <div className="flex items-center gap-1 text-gray-500" title={label}>
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{value.toLocaleString("pt-BR")}</span>
    </div>
  );
}
