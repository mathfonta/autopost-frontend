export function SkeletonPostCard() {
  return (
    <div className="max-w-[375px] mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-1">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-2 bg-gray-100 rounded w-12" />
        </div>
      </div>

      {/* Imagem */}
      <div className="aspect-square w-full bg-gray-200" />

      {/* Ações */}
      <div className="flex gap-4 p-3">
        <div className="h-6 w-6 bg-gray-200 rounded" />
        <div className="h-6 w-6 bg-gray-200 rounded" />
        <div className="h-6 w-6 bg-gray-200 rounded" />
      </div>

      {/* Legenda */}
      <div className="px-3 pb-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-3/5" />
      </div>
    </div>
  );
}
