import { Outlet, NavLink, useLocation } from 'react-router';
import {
  FileText,
  ClipboardCheck,
  Download,
  List,
  Settings,
  FileSearch,
  MessageSquareText,
  ShieldCheck,
  ChevronDown,
  User,
  LayoutGrid,
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  label: string;
  path: string;
  icon: any;
  activePrefixes?: string[];
}

const downloadMenuItems: MenuItem[] = [
  { label: '可下载文件', path: '/', icon: Download },
  { label: '入口配置', path: '/approval-config', icon: Settings },
  { label: '审计日志', path: '/audit-logs', icon: FileSearch },
];

const approvalMenuItems: MenuItem[] = [
  {
    label: '我的申请',
    path: '/approval-center/my-applications',
    icon: FileText,
    activePrefixes: ['/approval-center/request/'],
  },
  {
    label: '我的审批',
    path: '/approval-center/my-approvals',
    icon: ClipboardCheck,
    activePrefixes: ['/approval-center/approval/'],
  },
  { label: '全部记录', path: '/approval-center/all-records', icon: List },
];

export function EnterpriseLayout() {
  const location = useLocation();
  const [demoMenuOpen, setDemoMenuOpen] = useState(
    () => location.pathname === '/download-demo'
      || location.pathname === '/feishu-card-demo'
      || location.pathname.startsWith('/data-classification-downgrade-demo'),
  );
  const isApprovalCenter = location.pathname.startsWith('/approval-center');
  const menuItems = isApprovalCenter ? approvalMenuItems : downloadMenuItems;

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
            <span className="text-white/40">/</span>
            <span className="text-sm text-white/85">
              {isApprovalCenter ? '审批中心' : '下载中心'}
            </span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          <NavLink
            to="/approval-center/my-applications"
            aria-label="进入审批中心"
            title="进入审批中心"
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              isApprovalCenter
                ? 'bg-white text-[#3069e6]'
                : 'text-white/90 hover:bg-white/15 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-5 h-5" />
          </NavLink>

          <NavLink
            to="/"
            aria-label="进入下载中心"
            title="进入下载中心"
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              !isApprovalCenter
                ? 'bg-white text-[#3069e6]'
                : 'text-white/90 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Download className="w-5 h-5" />
          </NavLink>

          <div className="mx-2 h-6 w-px bg-white/25"></div>

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
              const isActive = Boolean(
                location.pathname === item.path
                || item.activePrefixes?.some((prefix) => location.pathname.startsWith(prefix)),
              );

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

                </NavLink>
              );
            })}
          </nav>

          {!isApprovalCenter && <div className="p-3 mt-4 border-t border-sidebar-border">
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
                  className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-text-tertiary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>下载Demo</span>
                </NavLink>
                <NavLink
                  to="/feishu-card-demo"
                  className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-text-tertiary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <MessageSquareText className="w-4 h-4" />
                  <span>飞书卡片Demo</span>
                </NavLink>
                <NavLink
                  to="/data-classification-downgrade-demo"
                  className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-text-tertiary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>数据分级降级</span>
                </NavLink>
              </div>
            )}
          </div>}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
