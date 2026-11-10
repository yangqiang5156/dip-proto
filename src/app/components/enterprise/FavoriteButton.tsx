import { Star } from 'lucide-react';
import { useMenuFavorites } from '../../hooks/useMenuFavorites';

export function FavoriteButton({ path, label }: { path: string; label: string }) {
  const { favoritePaths, toggleFavorite } = useMenuFavorites();
  const saved = favoritePaths.includes(path);
  const title = `${saved ? '取消收藏' : '收藏'} ${label}`;

  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      aria-pressed={saved}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(path);
      }}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#409eff] ${saved ? 'text-[#e6a23c]' : 'text-[#909399] hover:text-[#e6a23c]'}`}
    >
      <Star className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  );
}
