import { Clock, Eye, PenLine, Image, ThumbsUp, Send, CheckCircle, XCircle, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  ContentStatus,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending:           { label: "Na fila",             color: "bg-gray-100 text-gray-600",    icon: Clock },
  analyzing:         { label: "Analisando foto",      color: "bg-blue-100 text-blue-700",    icon: Eye },
  copy:              { label: "Gerando legenda",       color: "bg-blue-100 text-blue-700",    icon: PenLine },
  design:            { label: "Preparando imagem",     color: "bg-blue-100 text-blue-700",    icon: Image },
  awaiting_approval: { label: "Aguarda aprovação",     color: "bg-yellow-100 text-yellow-700",icon: ThumbsUp },
  approved:          { label: "Aprovado",              color: "bg-blue-100 text-blue-700",    icon: Send },
  publishing:        { label: "Publicando...",          color: "bg-blue-100 text-blue-700",    icon: Send },
  published:         { label: "Publicado ✓",            color: "bg-green-100 text-green-700",  icon: CheckCircle },
  failed:            { label: "Falhou",                color: "bg-red-100 text-red-700",      icon: XCircle },
  rejected:          { label: "Rejeitado",             color: "bg-orange-100 text-orange-700", icon: ThumbsDown },
};

interface StatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.color, className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
