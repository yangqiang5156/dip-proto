import { Outlet, NavLink, useLocation } from 'react-router';
import {
  FileText,
  ClipboardCheck,
  Download,
  List,
  Settings,
  FileSearch,
  ChevronDown,
  User,
  LayoutGrid,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';

interface MenuItem {
  label: string;
  path: string;
  icon: any;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { label: '我的申请', path: '/', icon: FileText },
  { label: '我的审批', path: '/my-approvals', icon: ClipboardCheck, badge: 4 },
  { label: '全部记录', path: '/all-records', icon: List },
  { label: '入口配置', path: '/approval-config', icon: Settings },
  { label: '审计日志', path: '/audit-logs', icon: FileSearch },
];

export function EnterpriseLayout() {
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="bg-[#3069e6] border-b border-[#3069e6] h-14 flex items-center px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-white">智慧家庭数智平台</span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-4">
          <NavLink
            to="/"
            aria-label="进入下载中心"
            title="进入下载中心"
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/15 hover:text-white"
          >
            <Download className="w-5 h-5" />
          </NavLink>

          <div className="h-6 w-px bg-white/25"></div>

          <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span>管理员</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-52 bg-sidebar border-r border-sidebar-border flex-shrink-0 overflow-y-auto">
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path
                || (item.path === '/my-approvals' && location.pathname.startsWith('/approval-decision/'));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors
                    ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'text-sidebar-foreground hover:bg-muted'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant={isActive ? 'default' : 'secondary'}
                      className="h-5 min-w-5 px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Development only - component showcase links */}
          <div className="p-3 mt-4 border-t border-sidebar-border">
            <button
              type="button"
              onClick={() => setDemoMenuOpen((open) => !open)}
              aria-expanded={demoMenuOpen}
              className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-text-tertiary transition-colors hover:bg-muted hover:text-text-primary"
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                演示功能
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${demoMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {demoMenuOpen && (
              <div className="mt-1 space-y-1">
                <NavLink
                  to="/download-demo"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-tertiary hover:text-text-primary hover:bg-muted transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>下载Demo</span>
                </NavLink>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
