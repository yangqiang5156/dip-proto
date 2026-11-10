import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { getPlatformModuleId, matchesMenuItem, menuGroups, platformCategories } from '../../navigation';
import { FavoriteButton } from './FavoriteButton';
import { useMenuFavorites } from '../../hooks/useMenuFavorites';
import type { MenuItem, MenuCatalogEntry } from '../../navigation';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const modules = platformCategories.flatMap((category) => category.modules);

function LauncherMenuItem({ item, pathname, onNavigate }: { item: MenuItem; pathname: string; onNavigate: () => void }) {
  const active = matchesMenuItem(item, pathname);
  return (
    <div className={`flex min-w-0 items-center gap-0.5 rounded ${item.description ? 'col-span-full bg-[#ebeff8] p-2' : ''}`}>
      <Link
        to={item.path}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={`min-w-0 rounded px-1 py-1.5 text-sm leading-6 transition-colors hover:bg-[#e8edf5] hover:text-[#409eff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#409eff] ${active ? 'font-medium text-[#409eff]' : 'text-[#606266]'}`}
      >
        <span className="inline-flex flex-wrap items-center gap-1.5 break-words">
          {item.label}
          {item.isNew && <span className="rounded-sm bg-[#ff3b55] px-1 text-[9px] font-semibold italic leading-4 text-white">NEW</span>}
        </span>
        {item.description && <span className="mt-0.5 block text-xs font-normal text-[#909399]">{item.description}</span>}
      </Link>
      <FavoriteButton path={item.path} label={item.label} />
    </div>
  );
}


export function PlatformLauncher() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { favorites } = useMenuFavorites();
  const favoriteGroups = new Map<string, MenuCatalogEntry[]>();
  favorites.forEach((item) => {
    const label = [item.moduleLabel, item.topMenuLabel, item.groupLabel].filter((value, index, list) => value && value !== list[index - 1]).join(' / ');
    favoriteGroups.set(label, [...(favoriteGroups.get(label) || []), item]);
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(() => getPlatformModuleId(pathname));
  const [sideOffset, setSideOffset] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const moduleRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selectedModule = modules.find((module) => module.id === selectedId) || modules[0];
  const category = platformCategories.find((item) => item.modules.some((module) => module.id === selectedModule.id))!;

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const header = trigger?.closest('header');
    if (!trigger || !header) return;
    const updateOffset = () => setSideOffset(Math.max(0, header.getBoundingClientRect().bottom - trigger.getBoundingClientRect().bottom));
    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(header);
    window.addEventListener('resize', updateOffset);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateOffset);
    };
  }, [open]);

  const changeOpen = (value: boolean) => {
    if (value) {
      setSelectedId(getPlatformModuleId(pathname));
      const trigger = triggerRef.current;
      const header = trigger?.closest('header');
      if (trigger && header) setSideOffset(Math.max(0, header.getBoundingClientRect().bottom - trigger.getBoundingClientRect().bottom));
    }
    setOpen(value);
  };

  const focusModule = (key: string) => {
    const index = modules.findIndex((module) => module.id === selectedId);
    const target = key === 'Home' ? 0 : key === 'End' ? modules.length - 1
      : (index + (key === 'ArrowDown' ? 1 : -1) + modules.length) % modules.length;
    moduleRefs.current[modules[target].id]?.focus();
  };

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          aria-label="平台模块导航"
          title="平台模块导航"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${open ? 'bg-white/20' : ''}`}
        >
          <span className="grid h-5 w-5 grid-cols-3 gap-1" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <span key={index} className="bg-current" />)}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        aria-label="平台模块导航菜单"
        align="start"
        alignOffset={-24}
        sideOffset={sideOffset}
        collisionPadding={0}
        style={{ height: 'min(780px, calc(var(--radix-popover-content-available-height) - 8px))' }}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          moduleRefs.current[selectedId]?.focus({ preventScroll: true });
        }}
        className="flex max-h-[calc(100dvh-56px)] w-[680px] max-w-[100vw] gap-0 overflow-hidden rounded-none border-0 p-0 shadow-[4px_8px_24px_rgba(0,0,0,0.12)]"
      >
        <div role="tablist" aria-label="平台模块" aria-orientation="vertical" className="w-[180px] shrink-0 overflow-y-auto bg-white py-2 max-[480px]:w-[140px]">
          {platformCategories.map((item) => (
            <section key={item.id} aria-labelledby={`launcher-category-${item.id}`} className="mb-3">
              <h2 id={`launcher-category-${item.id}`} className="px-4 pb-1 pt-2 text-xs font-medium text-[#909399]">{item.label}</h2>
              {item.modules.map((module) => {
                const Icon = module.icon;
                const selected = module.id === selectedId;
                return (
                  <button
                    key={module.id}
                    ref={(element) => { moduleRefs.current[module.id] = element; }}
                    type="button"
                    role="tab"
                    id={`launcher-module-${module.id}`}
                    aria-selected={selected}
                    aria-controls="launcher-module-menus"
                    tabIndex={selected ? 0 : -1}
                    onMouseEnter={() => setSelectedId(module.id)}
                    onFocus={() => setSelectedId(module.id)}
                    onClick={() => {
                      navigate(module.topMenus[0].path);
                      setOpen(false);
                    }}
                    onKeyDown={(event) => {
                      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                        event.preventDefault();
                        focusModule(event.key);
                      }
                    }}
                    className={`flex min-h-10 w-full items-center gap-2 px-4 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#409eff] ${selected ? 'bg-[#ecf5ff] text-[#409eff]' : 'text-[#303133] hover:bg-[#f5f7fa]'}`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[#409eff]" aria-hidden="true" />
                    <span>{module.label}</span>
                    {module.isNew && <span className="rounded-sm bg-[#ff3b55] px-1 text-[9px] font-semibold italic leading-4 text-white">NEW</span>}
                    {selected && <ChevronRight className="ml-auto h-3 w-3 shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </section>
          ))}
        </div>

        <div id="launcher-module-menus" role="tabpanel" aria-labelledby={`launcher-module-${selectedModule.id}`} tabIndex={0} className="min-w-0 flex-1 overflow-y-auto bg-[#f5f6fa] px-6 py-5 outline-none max-[480px]:px-4">
          <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-[#909399]">
            <span>{category.label}</span>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span>{selectedModule.label}</span>
          </div>
          <nav aria-label={`${selectedModule.label}模块菜单`} className="space-y-7">
            {selectedModule.topMenus.map((topMenu) => (
              <section key={topMenu.path}>
                <div className="mb-4 flex items-center gap-1">
                  <Link to={topMenu.path} onClick={() => setOpen(false)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#409eff] hover:text-[#1677ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#409eff]">
                    {topMenu.label}
                    {topMenu.isNew && <span className="rounded-sm bg-[#ff3b55] px-1 text-[9px] font-semibold italic leading-4 text-white">NEW</span>}
                  </Link>
                  {topMenu.groupIds.length === 0 && selectedId !== 'favorites' && <FavoriteButton path={topMenu.path} label={topMenu.label} />}
                </div>
                <div className="space-y-5 pl-5 max-[480px]:pl-0">
                  {topMenu.groupIds.map((id) => menuGroups.find((group) => group.id === id)!).map((group) => (
                    <section key={group.id} aria-label={group.label}>
                      {!group.hideTitleInLauncher && <h3 className="mb-2 text-sm font-normal text-[#909399]">{group.label}</h3>}
                      <div className="grid grid-cols-1 gap-x-5 gap-y-1 min-[560px]:grid-cols-2">
                        {group.items.map((item) => (
                          <LauncherMenuItem key={item.path} item={item} pathname={pathname} onNavigate={() => setOpen(false)} />
                        ))}
                      </div>
                    </section>
                  ))}
                  {selectedId === 'favorites' && (favorites.length === 0 ? (
                    <p className="text-sm leading-6 text-[#909399]">暂无收藏菜单，点击功能旁的五角星即可收藏。</p>
                  ) : [...favoriteGroups].map(([label, items]) => (
                    <section key={label} aria-label={label}>
                      <h3 className="mb-2 text-sm font-normal text-[#909399]">{label}</h3>
                      <div className="grid grid-cols-1 gap-x-5 gap-y-1 min-[560px]:grid-cols-2">
                        {items.map((item) => (
                          <LauncherMenuItem key={item.path} item={item} pathname={pathname} onNavigate={() => setOpen(false)} />
                        ))}
                      </div>
                    </section>
                  )))}
                </div>
              </section>
            ))}
          </nav>
        </div>
      </PopoverContent>
    </Popover>
  );
}
