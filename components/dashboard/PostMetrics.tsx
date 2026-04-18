import { Eye, Heart, MessageCircle, TrendingUp } from "lucide-react";
import type { ContentRequest } from "@/lib/types";

interface PostMetricsProps {
  post: ContentRequest;
}

export function PostMetrics({ post }: PostMetricsProps) {
  const metrics = post.publish_result?.metrics as Record<string, number> | undefined;

  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className="text-center py-4 text-sm text-gray-400">
        Métricas disponíveis ~24h após publicação
      </div>
    );
  }

  const items = [
    { label: "Impressões", value: metrics.impressions, icon: Eye },
    { label: "Curtidas", value: metrics.likes ?? metrics.like_count, icon: Heart },
    { label: "Comentários", value: metrics.comments ?? metrics.comments_count, icon: MessageCircle },
    { label: "Alcance", value: metrics.reach, icon: TrendingUp },
  ].filter((item) => item.value !== undefined && item.value !== null);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-lg font-bold text-gray-900 leading-none">
              {(value as number).toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
