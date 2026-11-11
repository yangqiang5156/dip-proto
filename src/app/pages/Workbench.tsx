import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ArrowRight, BookOpen, ChevronRight, Clock3, LockKeyhole, Plus, Search, X } from 'lucide-react';
import { useMenuFavorites } from '../hooks/useMenuFavorites';
import { formatVisitTime, useRecentVisits } from '../hooks/useRecentVisits';
import { getMenuIcon, getMenuSource, searchWorkbenchMenus, workbenchGuides } from '../workbenchData';
import { FavoriteButton } from '../components/enterprise/FavoriteButton';
import { FavoriteManager, WorkbenchHelpDialog } from '../components/workbench/WorkbenchDialogs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import '../../styles/workbench.css';
import { getMenuAccess, getPermissionApplicationUrl } from '../data/menuAccess';
import { WorkbenchTodos } from '../components/workbench/WorkbenchTodos';
import { WorkbenchDate } from '../components/workbench/WorkbenchDate';

const hotSearches = ['数据资产', '数据开发', '用户行为分析', '数据服务', '用户分群'];

export default function Workbench() {
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites } = useMenuFavorites();
  const recentVisits = useRecentVisits();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const [managerOpen, setManagerOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [guideId, setGuideId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const resultListId = useId();
  const matches = useMemo(() => query.trim() ? searchWorkbenchMenus(query) : [], [query]);
  const results = [...matches].sort((a, b) => Number(getMenuAccess(a.path) === 'requestable') - Number(getMenuAccess(b.path) === 'requestable')).slice(0, 8);
  const showResults = searchOpen && Boolean(query.trim());

  useEffect(() => {
    if (location.state?.focusSearch) searchRef.current?.focus();
  }, [location.key, location.state]);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (event.target instanceof Node && !searchWrapRef.current?.contains(event.target)) setSearchOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const updateSearch = (value: string) => {
    setQuery(value);
    setActiveResult(0);
    setSearchOpen(Boolean(value.trim()));
  };
  const openResult = (path: string) => { setSearchOpen(false); setQuery(''); navigate(getMenuAccess(path) === 'requestable' ? getPermissionApplicationUrl(path) : path); };

  return (
    <div className="wb-workbench">
      <section className="wb-hero wb-shell" aria-label="工作台欢迎与搜索">
        <div className="wb-welcome"><h1>欢迎回来，杨强</h1><p title="在这里快速启动常用工具，探索平台能力，让数据创造更大价值。">在这里快速启动常用工具，探索平台能力，让数据创造更大价值。</p></div>
        <div ref={searchWrapRef} className="wb-search-wrap">
          <div className="wb-search-field">
            <Search size={22} aria-hidden="true" />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => updateSearch(event.target.value)}
              onFocus={() => setSearchOpen(Boolean(query.trim()))}
              onKeyDown={(event) => {
                if (event.key === 'Escape') { setSearchOpen(false); setQuery(''); }
                if (results.length && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                  event.preventDefault();
                  setSearchOpen(true);
                  setActiveResult((value) => (value + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
                }
                if (event.key === 'Enter' && results[activeResult]) { event.preventDefault(); openResult(results[activeResult].path); }
              }}
              placeholder="搜索功能、模块、菜单"
              aria-label="搜索平台功能"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showResults}
              aria-controls={resultListId}
              aria-activedescendant={showResults && results.length ? `${resultListId}-${activeResult}` : undefined}
            />
            {query && <button type="button" className="wb-clear-search" aria-label="清空搜索" onClick={() => { searchRef.current?.focus(); updateSearch(''); }}><X size={16} /></button>}
            <kbd className="wb-keyhint">⌘ K</kbd>
          </div>
          {showResults && <div className="wb-search-results">
            <div className="wb-result-caption">功能页面{matches.length > 0 && <span>找到 {matches.length} 项{matches.length > 8 ? '，显示前 8 项' : ''}</span>}</div>
            <ul role="listbox" id={resultListId} aria-label="功能搜索结果">
              {results.map((item, index) => {
                const Icon = getMenuIcon(item);
                const needsAccess = getMenuAccess(item.path) === 'requestable';
                return <li key={item.path} id={`${resultListId}-${index}`} role="option" aria-selected={index === activeResult}>
                  <button type="button" tabIndex={-1} aria-label={needsAccess ? `申请权限 ${item.label}` : `打开 ${item.label}`} className={`${index === activeResult ? 'wb-selected' : ''} ${needsAccess ? 'wb-result-locked' : ''}`} onMouseEnter={() => setActiveResult(index)} onClick={() => openResult(item.path)}>
                    <span className="wb-result-icon"><Icon size={20} aria-hidden="true" /></span>
                    <span><strong className="wb-result-title">{item.label}{needsAccess && <span className="wb-access-label"><LockKeyhole size={12} aria-hidden="true" />需申请</span>}</strong><small>{getMenuSource(item)}</small></span>
                    {needsAccess ? <span className="wb-request-access">申请权限<ArrowRight size={14} aria-hidden="true" /></span> : <ChevronRight size={17} aria-hidden="true" />}
                  </button>
                </li>;
              })}
            </ul>
            {results.length === 0 && <div className="wb-no-result">没有找到“{query.trim()}”相关功能，试试模块或菜单名称。</div>}
          </div>}
        </div>
        <div className="wb-hot-search">热门搜索： {hotSearches.map((term) => <button key={term} type="button" onClick={() => { searchRef.current?.focus(); updateSearch(term); }}>{term}</button>)}</div>
        <WorkbenchDate />
      </section>

      <div className="wb-shell wb-dashboard">
        <section className="wb-favorites-section" aria-labelledby="wb-favorites-heading">
          <div className="wb-section-head"><h2 id="wb-favorites-heading">收藏的功能</h2><button type="button" className="wb-text-action" onClick={() => setManagerOpen(true)}>管理收藏</button></div>
          <div className="wb-favorite-grid">
            {favorites.slice(0, 9).map((item) => {
              const Icon = getMenuIcon(item);
              return <article key={item.path} className="wb-favorite-card wb-favorite-tile">
                <Link to={item.path} className="wb-favorite-card-link">
                  <span className="wb-favorite-icon"><Icon size={24} aria-hidden="true" /></span>
                  <span className="wb-favorite-title">{item.label}</span>
                  <span className="wb-favorite-desc" title={getMenuSource(item)}>{getMenuSource(item)}</span>
                </Link>
                <span className="wb-star-control"><FavoriteButton path={item.path} label={item.label} /></span>
              </article>;
            })}
            <button type="button" className="wb-favorite-card wb-add-card" onClick={() => setManagerOpen(true)}><Plus size={30} aria-hidden="true" /><span className="wb-favorite-title">添加收藏</span><span className="wb-favorite-desc">定制你的常用入口</span></button>
            {favorites.length === 0 && <div className="wb-favorites-empty"><strong>把常用功能放在这里</strong><p>点击“添加收藏”，或在九宫格菜单中点亮五角星，即可定制你的工作台。</p></div>}
          </div>
        </section>

        <div className="wb-content-grid">
          <WorkbenchTodos />

          <div className="wb-right-column">
            <section className="wb-side-panel" aria-labelledby="wb-help-heading">
              <div className="wb-section-head"><h2 id="wb-help-heading">帮助与公告</h2><button type="button" className="wb-text-action" onClick={() => setGuideId('all')}>更多<ArrowRight size={14} aria-hidden="true" /></button></div>
              {workbenchGuides.slice(0, 5).map((guide) => <button key={guide.id} type="button" className="wb-side-row wb-announcement" onClick={() => setGuideId(guide.id)}><BookOpen size={19} aria-hidden="true" /><span>{guide.title}</span><small>{guide.tag}</small></button>)}
            </section>
            <section className="wb-side-panel" aria-labelledby="wb-recent-heading">
              <div className="wb-section-head"><h2 id="wb-recent-heading">最近使用</h2><button type="button" className="wb-text-action" onClick={() => setRecentOpen(true)}>更多<ArrowRight size={14} aria-hidden="true" /></button></div>
              {recentVisits.length ? recentVisits.slice(0, 5).map((item) => {
                const Icon = getMenuIcon(item);
                return <Link key={item.path} to={item.path} className="wb-side-row" title={`${item.label} · ${getMenuSource(item)}`}><Icon size={20} aria-hidden="true" /><span>{item.label}</span><time dateTime={new Date(item.visitedAt).toISOString()}>{formatVisitTime(item.visitedAt)}</time></Link>;
              }) : <div className="wb-side-empty"><Clock3 size={28} aria-hidden="true" /><span>还没有使用记录</span><p>打开平台功能后，会在这里留下快捷入口。</p><button type="button" className="wb-text-action" onClick={() => searchRef.current?.focus()}>搜索平台功能<ArrowRight size={14} aria-hidden="true" /></button></div>}
            </section>
          </div>
        </div>
      </div>

      <FavoriteManager open={managerOpen} onOpenChange={setManagerOpen} />
      {guideId !== null && <WorkbenchHelpDialog guideId={guideId} onClose={() => setGuideId(null)} />}
      <Dialog open={recentOpen} onOpenChange={setRecentOpen}>
        <DialogContent className="wb-dialog wb-recent-dialog">
          <DialogHeader><DialogTitle>最近使用</DialogTitle><DialogDescription>最近打开的功能，最多保留 20 条记录。</DialogDescription></DialogHeader>
          <div className="wb-recent-list">{recentVisits.length ? recentVisits.map((item) => {
            const Icon = getMenuIcon(item);
            return <Link key={item.path} to={item.path} onClick={() => setRecentOpen(false)}><Icon size={21} aria-hidden="true" /><span><strong>{item.label}</strong><small>{getMenuSource(item)}</small></span><time dateTime={new Date(item.visitedAt).toISOString()}>{formatVisitTime(item.visitedAt)}</time><ChevronRight size={16} aria-hidden="true" /></Link>;
          }) : <p className="wb-dialog-empty">暂无使用记录。搜索或打开一个平台功能后，再回来看看。</p>}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
