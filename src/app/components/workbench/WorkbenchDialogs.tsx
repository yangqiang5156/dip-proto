import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, ChevronRight, Search, Star } from 'lucide-react';
import { menuGroups } from '../../navigation';
import type { PlatformModule } from '../../navigation';
import { useMenuFavorites } from '../../hooks/useMenuFavorites';
import { getMenuIcon, getMenuSource, moduleDescriptions, searchWorkbenchMenus, workbenchCategories, workbenchGuides, workbenchModules } from '../../workbenchData';
import { FavoriteButton } from '../enterprise/FavoriteButton';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

export function FavoriteManager({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) {
  const [query, setQuery] = useState('');
  const [moduleLabel, setModuleLabel] = useState('');
  const { favoritePaths, toggleFavorite } = useMenuFavorites();
  const menus = useMemo(() => searchWorkbenchMenus(query, moduleLabel), [query, moduleLabel]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="wb-dialog wb-manager-dialog">
        <DialogHeader>
          <DialogTitle>管理收藏</DialogTitle>
          <DialogDescription>选择常用功能，在“查看全部收藏”中拖动排序，前 5 个会显示在工作台。</DialogDescription>
        </DialogHeader>
        <div className="wb-manager-filters">
          <label className="wb-manager-search"><Search size={18} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索功能名称或菜单路径" aria-label="搜索可收藏功能" /></label>
          <select value={moduleLabel} onChange={(event) => setModuleLabel(event.target.value)} aria-label="按模块筛选收藏功能">
            <option value="">全部模块</option>
            {workbenchModules.filter((module) => module.id !== 'favorites').map((module) => <option key={module.id} value={module.label}>{module.label}</option>)}
          </select>
        </div>
        <div className="wb-manager-list">
          {menus.map((item) => {
            const Icon = getMenuIcon(item);
            const saved = favoritePaths.includes(item.path);
            return (
              <button key={item.path} type="button" aria-pressed={saved} onClick={() => toggleFavorite(item.path)} className={saved ? 'chosen' : ''}>
                <span className="wb-function-icon"><Icon size={24} aria-hidden="true" /></span>
                <span className="wb-manager-copy"><strong>{item.label}{item.isNew && <span className="wb-new">NEW</span>}</strong><small>{getMenuSource(item)}</small></span>
                <Star size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>
            );
          })}
          {menus.length === 0 && <p className="wb-dialog-empty">没有匹配的功能，换个关键词试试。</p>}
        </div>
        <div className="wb-dialog-footer"><span>已收藏 {favoritePaths.length} 个功能</span><div><Link to="/favorites" onClick={() => onOpenChange(false)} className="wb-text-action">查看全部收藏</Link><Button onClick={() => onOpenChange(false)}>完成</Button></div></div>
      </DialogContent>
    </Dialog>
  );
}

export function ExploreMenusDialog({ categoryId, initialModuleId, onClose }: { categoryId: string | null; initialModuleId: string; onClose: () => void }) {
  const category = workbenchCategories.find((item) => item.id === categoryId);
  const [selected, setSelected] = useState(initialModuleId);
  const module = category?.modules.find((item) => item.id === selected) || category?.modules.find((item) => item.id === initialModuleId) || category?.modules[0];
  return (
    <Dialog open={Boolean(category)} onOpenChange={(value) => { if (!value) onClose(); }}>
      <DialogContent className="wb-dialog wb-explore-dialog">
        <DialogHeader>
          <DialogTitle>探索{category?.label}</DialogTitle>
          <DialogDescription>按模块查看顶部菜单和各级功能，点击功能可直接进入。</DialogDescription>
        </DialogHeader>
        {category && module && <div className="wb-explore-dialog-body">
          <nav aria-label="选择探索模块" className="wb-dialog-modules">
            {category.modules.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} type="button" aria-pressed={item.id === module.id} onClick={() => setSelected(item.id)}><Icon size={18} aria-hidden="true" />{item.label}<ChevronRight size={14} aria-hidden="true" /></button>;
            })}
          </nav>
          <ModuleMenus module={module} onClose={onClose} />
        </div>}
      </DialogContent>
    </Dialog>
  );
}

function ModuleMenus({ module, onClose }: { module: PlatformModule; onClose: () => void }) {
  return <div className="wb-module-menus">
    <div className="wb-module-intro"><h3>{module.label}</h3><p>{moduleDescriptions[module.id]}</p></div>
    {module.topMenus.map((topMenu) => <section key={topMenu.path}>
      <div className="wb-menu-section-title"><Link to={topMenu.path} onClick={onClose}>{topMenu.label}<ArrowUpRight size={14} aria-hidden="true" /></Link>{topMenu.groupIds.length === 0 && module.id !== 'favorites' && <FavoriteButton path={topMenu.path} label={topMenu.label} />}</div>
      {topMenu.groupIds.map((id) => menuGroups.find((group) => group.id === id)).filter(Boolean).map((group) => group && <div key={group.id} className="wb-menu-group">
        <h4>{group.label}</h4>
        <div className="wb-leaf-grid">{group.items.map((item) => <div key={item.path}><Link to={item.path} onClick={onClose}>{item.label}{item.isNew && <span className="wb-new">NEW</span>}</Link><FavoriteButton path={item.path} label={item.label} /></div>)}</div>
      </div>)}
      {module.id === 'favorites' && <p className="wb-module-note">打开“我的收藏”，统一查看已收藏的功能。</p>}
    </section>)}
  </div>;
}

export function WorkbenchHelpDialog({ guideId, onClose }: { guideId: string | null; onClose: () => void }) {
  const guide = workbenchGuides.find((item) => item.id === guideId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = guide || workbenchGuides.find((item) => item.id === selectedId);
  return <Dialog open={guideId !== null} onOpenChange={(value) => { if (!value) { onClose(); setSelectedId(null); } }}>
    <DialogContent className="wb-dialog wb-help-dialog">
      <DialogHeader><DialogTitle>{selected?.title || '帮助与公告'}</DialogTitle><DialogDescription>查看平台导航和常用操作说明。</DialogDescription></DialogHeader>
      {selected ? <div className="wb-guide-content">{guideId === 'all' && <button type="button" className="wb-text-action" onClick={() => setSelectedId(null)}>返回全部内容</button>}{selected.paragraphs.map((text) => <p key={text}>{text}</p>)}<div>{selected.actions.map((action) => <Button key={action.path} asChild><Link to={action.path} onClick={onClose}>{action.label}</Link></Button>)}</div></div>
        : <div className="wb-guide-list">{workbenchGuides.map((item) => <button key={item.id} onClick={() => setSelectedId(item.id)}>{item.title}<ChevronRight size={16} aria-hidden="true" /></button>)}</div>}
    </DialogContent>
  </Dialog>;
}
