import { Outlet, NavLink, useLocation } from 'react-router';
import {
  FileText,
  Clock,
  CheckCircle2,
  Download,
  List,
  Settings,
  FileSearch,
  Bell,
  ChevronRight,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { NotificationDrawer } from '../download-center/NotificationDrawer';

interface MenuItem {
  label: string;
  path: string;
  icon: any;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { label: '我的申请', path: '/', icon: FileText },
  { label: '待我审批', path: '/pending-approval', icon: Clock, badge: 3 },
  { label: '我已审批', path: '/approved', icon: CheckCircle2 },
  { label: '全部记录', path: '/all-records', icon: List },
  { label: '入口配置', path: '/approval-config', icon: Settings },
  { label: '审计日志', path: '/audit-logs', icon: FileSearch },
];

export function EnterpriseLayout() {
  const [notificationCount] = useState(5);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="bg-topnav-background border-b border-topnav-border h-14 flex items-center px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Download className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold text-topnav-foreground">下载中心</span>
          </div>
        </div>

        {/* Breadcrumb area */}
        <div className="ml-8 flex items-center gap-2 text-sm text-text-secondary">
          <span>数据智能平台</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary">下载中心</span>
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-4">
          <button
            className="relative text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setNotificationDrawerOpen(true)}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground">
                {notificationCount}
              </Badge>
            )}
          </button>

          <div className="h-6 w-px bg-border"></div>

          <button className="flex items-center gap-2 text-sm text-text-primary hover:text-primary transition-colors">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
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
              const isActive = location.pathname === item.path;

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

          {/* Development only - component showcase link */}
          <div className="p-3 mt-4 border-t border-sidebar-border space-y-1">
            <NavLink
              to="/component-showcase"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-tertiary hover:text-text-primary hover:bg-muted transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>组件展示</span>
            </NavLink>
            <NavLink
              to="/download-request-modal-demo"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-tertiary hover:text-text-primary hover:bg-muted transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>下载申请弹窗</span>
            </NavLink>
            <NavLink
              to="/approval-chain-demo"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-tertiary hover:text-text-primary hover:bg-muted transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>审批链配置</span>
            </NavLink>
            <NavLink
              to="/notification-drawer-demo"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-tertiary hover:text-text-primary hover:bg-muted transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>消息通知</span>
            </NavLink>
            <NavLink
              to="/download-demo"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-tertiary hover:text-text-primary hover:bg-muted transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>下载Demo</span>
            </NavLink>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>

      <NotificationDrawer
        open={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
    </div>
  );
}
