import { Link } from 'react-router';
import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, GripVertical, Star } from 'lucide-react';
import { useMenuFavorites } from '../hooks/useMenuFavorites';
import { FavoriteButton } from '../components/enterprise/FavoriteButton';

export default function MyFavorites() {
  const { favorites, moveFavorite } = useMenuFavorites();
  const [draggedPath, setDraggedPath] = useState<string | null>(null);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dropTarget = (x: number, y: number) => document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-favorite-path]')?.dataset.favoritePath;
  const clearDrag = () => { dragStart.current = null; setDraggedPath(null); setTargetPath(null); };
  const [announcement, setAnnouncement] = useState('');
  const move = (path: string, target: string) => {
    moveFavorite(path, target);
    const item = favorites.find((entry) => entry.path === path);
    setAnnouncement(`已将${item?.label || '收藏'}移动到第 ${favorites.findIndex((entry) => entry.path === target) + 1} 位，排序已保存。`);
  };

  return (
    <div className="w-full min-w-0 p-4 xl:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-text-primary">我的收藏</h1>
        <p className="mt-1 text-sm text-text-secondary">拖动卡片左上角的手柄调整顺序，前 5 个收藏会显示在工作台，排序自动保存。</p>
      </div>
      <p role="status" className="sr-only">{announcement}</p>
      {favorites.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border bg-white p-6 text-center">
          <Star className="h-10 w-10 text-[#c0c4cc]" aria-hidden="true" />
          <p className="text-sm font-medium text-text-primary">暂无收藏菜单</p>
          <p className="text-sm text-text-secondary">点击九宫格悬浮菜单中的五角星，收藏常用功能。</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-text-secondary">共 {favorites.length} 个收藏菜单</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
            {favorites.map((item, index) => (
              <article
                key={item.path}
                data-favorite-path={item.path}
                className={`min-w-0 rounded-lg border bg-white p-4 transition-shadow hover:shadow-sm ${targetPath === item.path ? 'border-primary ring-2 ring-primary/25' : ''} ${draggedPath === item.path ? 'opacity-50' : ''}`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <button
                    type="button"
                    style={{ touchAction: 'none' }}
                    aria-label={`拖动排序 ${item.label}，当前第 ${index + 1} 位`}
                    title="拖动排序，也可使用方向键调整"
                    onPointerDown={(event) => {
                      if (event.button !== 0) return;
                      dragStart.current = { x: event.clientX, y: event.clientY };
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onPointerMove={(event) => {
                      const start = dragStart.current;
                      if (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) < 5) return;
                      setDraggedPath(item.path);
                      const target = dropTarget(event.clientX, event.clientY);
                      setTargetPath(target && target !== item.path ? target : null);
                    }}
                    onPointerUp={(event) => {
                      const start = dragStart.current;
                      const target = dropTarget(event.clientX, event.clientY);
                      if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) >= 5 && target && target !== item.path) move(item.path, target);
                      clearDrag();
                    }}
                    onPointerCancel={clearDrag}
                    onLostPointerCapture={clearDrag}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') { clearDrag(); return; }
                      const target = event.key === 'ArrowUp' ? favorites[index - 1] : event.key === 'ArrowDown' ? favorites[index + 1] : null;
                      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') event.preventDefault();
                      if (target) move(item.path, target.path);
                    }}
                    className="select-none cursor-grab rounded p-1 text-text-secondary hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary active:cursor-grabbing"
                  ><GripVertical className="h-4 w-4" aria-hidden="true" /></button>
                  <span className="text-xs text-text-secondary">{index + 1}</span>
                  {index < 5 && <span className="rounded bg-[#eef5ff] px-2 py-0.5 text-xs text-primary">工作台展示</span>}
                  <div className="ml-auto flex gap-1">
                    <button type="button" disabled={index === 0} aria-label={`上移 ${item.label}`} title="上移" onClick={() => move(item.path, favorites[index - 1].path)} className="rounded p-1.5 text-text-secondary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button type="button" disabled={index === favorites.length - 1} aria-label={`下移 ${item.label}`} title="下移" onClick={() => move(item.path, favorites[index + 1].path)} className="rounded p-1.5 text-text-secondary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Link to={item.path} className="min-w-0 break-words text-base font-medium text-primary hover:underline">
                    {item.label}
                    {item.isNew && <span className="ml-1.5 rounded-sm bg-[#ff3b55] px-1 text-[9px] font-semibold italic leading-4 text-white">NEW</span>}
                  </Link>
                  <FavoriteButton path={item.path} label={item.label} />
                </div>
                <p className="break-words text-xs leading-6 text-text-secondary">
                  {[item.moduleLabel, item.topMenuLabel, item.groupLabel].filter((label, index, list) => label && label !== list[index - 1]).join(' / ')}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
