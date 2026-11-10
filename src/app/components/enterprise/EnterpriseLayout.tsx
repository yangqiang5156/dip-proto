import { recordRecentVisit } from '../../hooks/useRecentVisits';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { getActiveTopMenu, menuGroups, matchesMenuItem } from '../../navigation';
import type { MenuGroup } from '../../navigation';
import { PlatformHeader } from './PlatformHeader';
import { useEffect, useState } from 'react';

function SidebarMenuGroup({ group, pathname }: { group: MenuGroup; pathname: string }) {
  const isGroupActive = group.items.some((item) => matchesMenuItem(item, pathname));
  const [open, setOpen] = useState(isGroupActive || group.id !== 'demo');
  const Icon = group.icon;

  useEffect(() => {
    if (isGroupActive) setOpen(true);
  }, [pathname, isGroupActive]);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={`sidebar-${group.id}`}
        className={`flex h-11 w-full items-center gap-2.5 px-6 text-sm transition-colors hover:bg-[#f5f7fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#409eff] ${
          isGroupActive ? 'text-[#409eff]' : 'text-[#303133]'
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{group.label}</span>
        <ChevronDown
          className={`ml-auto h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${isGroupActive ? 'text-[#409eff]' : 'text-[#909399]'}`}
          aria-hidden="true"
        />
      </button>
      <ul id={`sidebar-${group.id}`} hidden={!open}>
        {group.items.map((item) => {
          const isActive = matchesMenuItem(item, pathname);
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-10 items-center border-r-[3px] pl-11 pr-6 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#409eff] ${
                  isActive
                    ? 'border-[#409eff] bg-[#ecf5ff] text-[#409eff]'
                    : 'border-transparent text-[#303133] hover:bg-[#f5f7fa]'
                }`}
              >
                <span>{item.label}</span>
                {item.isNew && <span className="ml-1.5 rounded-sm bg-[#ff3b55] px-1 text-[9px] font-semibold italic leading-4 text-white">NEW</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export function EnterpriseLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => { recordRecentVisit(location.pathname); }, [location.pathname]);
  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        navigate('/workbench', { state: { focusSearch: true } });
      }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, [navigate]);
  const activeTopMenu = getActiveTopMenu(location.pathname);
  const isWorkbench = activeTopMenu.label === '工作台';
  const visibleMenuGroups = activeTopMenu.groupIds.flatMap((id) =>
    menuGroups.find((group) => group.id === id) || [],
  );

  return (
    <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-background">
      <PlatformHeader />

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* Left Sidebar */}
        {visibleMenuGroups.length > 0 && <aside className="w-[220px] shrink-0 overflow-y-auto border-r border-sidebar-border bg-white">
          <nav aria-label="平台导航" className="py-0.5">
            <ul>
              {visibleMenuGroups.map((group) => (
                <SidebarMenuGroup key={group.id} group={group} pathname={location.pathname} />
              ))}
            </ul>
          </nav>
        </aside>}

        {/* Main Content Area */}
        <main aria-label={isWorkbench ? '工作台' : '页面内容'} className="platform-content min-h-0 min-w-0 flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
