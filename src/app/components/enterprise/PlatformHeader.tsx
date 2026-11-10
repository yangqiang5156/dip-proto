import { PlatformLauncher } from './PlatformLauncher';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { BookOpen, ChevronDown, ClipboardCheck, Download, House, NotebookPen, ShieldQuestion } from 'lucide-react';
import { getActiveTopMenu, getPlatformModule } from '../../navigation';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const workspaces = [
  '数据平台', '空气算法', '智慧家技术平台', '视听平台', '厨电平台', '智慧家庭数据运营',
  '制冷平台', '空气运营', '水产业平台', '智家超前企划平台', '全屋智能平台', '洗涤产业',
  '用户增长项目', '智慧楼宇平台', '集团总部', '小家电平台', '家庭机器人平台',
  'ai之眼(开发内部)', '超前企划机器人', '超前场景智能', '智慧家平台-设计自研平台',
];
const workspaceStorageKey = 'dip-proto.workspace';
const shortcuts = [
  { label: '权限申请', icon: ShieldQuestion },
  { label: '指标说明', icon: NotebookPen },
  { label: '帮助手册', icon: BookOpen },
] as const;
type Shortcut = typeof shortcuts[number]['label'];
const iconClass = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80';

function getInitialWorkspace() {
  try {
    const stored = window.localStorage.getItem(workspaceStorageKey);
    return stored && workspaces.includes(stored) ? stored : workspaces[0];
  } catch {
    return workspaces[0];
  }
}

export function PlatformHeader() {
  const { pathname } = useLocation();
  const [workspace, setWorkspace] = useState(getInitialWorkspace);
  const [shortcut, setShortcut] = useState<Shortcut | null>(null);
  const currentModule = getPlatformModule(pathname);
  const isApprovalCenter = currentModule.id === 'approval';
  const isDownloadCenter = currentModule.id === 'download';
  const activeTopMenu = getActiveTopMenu(pathname);

  const selectWorkspace = (value: string) => {
    setWorkspace(value);
    try {
      window.localStorage.setItem(workspaceStorageKey, value);
    } catch {
      // 本地存储不可用时，仍允许在当前页面切换工作空间。
    }
  };

  return (
    <>
      <header className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 border-b border-[#3069e6] bg-[#3069e6] px-6 py-2 xl:grid xl:h-14 xl:grid-cols-[1fr_auto_1fr] xl:gap-x-8 xl:py-0">
        <div className="flex shrink-0 items-center gap-2">
          <PlatformLauncher />
          <span className="whitespace-nowrap text-base font-semibold text-white">智慧家庭数智平台</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/workbench"
                aria-label="快速打开工作台"
                className="ml-2 inline-flex h-7 shrink-0 items-center gap-1.5 rounded bg-white/10 px-2.5 text-xs text-white/95 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <House className="h-3.5 w-3.5" aria-hidden="true" />
                <span>工作台</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">打开工作台</TooltipContent>
          </Tooltip>
        </div>

        <nav aria-label="顶部模块导航" className="order-last flex h-10 w-full items-stretch justify-start gap-8 overflow-x-auto sm:justify-center xl:order-none xl:h-full xl:w-auto">
          {currentModule.topMenus.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-current={item === activeTopMenu ? 'page' : undefined}
              className={`relative flex items-center whitespace-nowrap text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80 ${item === activeTopMenu ? 'font-medium text-white' : 'text-white/65'}`}
            >
              {item.label}
              {item === activeTopMenu && <span className="absolute inset-x-0 bottom-1 h-0.5 bg-white" aria-hidden="true" />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center justify-end gap-1.5 xl:ml-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`选择工作空间，当前：${workspace}`}
                className="mr-3 flex h-8 max-w-48 items-center gap-2 rounded px-2 text-sm text-white/95 outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <span className="truncate">{workspace}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} aria-label="工作空间" className="max-h-[min(780px,calc(100vh-80px))] w-[260px] rounded-sm py-2 shadow-lg">
              <DropdownMenuRadioGroup value={workspace} onValueChange={selectWorkspace}>
                {workspaces.map((name) => (
                  <DropdownMenuRadioItem key={name} value={name} className="min-h-9 cursor-pointer text-text-secondary data-[state=checked]:text-primary">
                    {name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/approval-center/my-applications" aria-label="进入审批中心" className={`${iconClass} ${isApprovalCenter ? 'bg-white !text-[#3069e6]' : ''}`}>
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="bottom">审批中心</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/downloadable-files" aria-label="进入下载中心" className={`${iconClass} ${isDownloadCenter ? 'bg-white !text-[#3069e6]' : ''}`}>
                <Download className="h-5 w-5" aria-hidden="true" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="bottom">下载中心</TooltipContent>
          </Tooltip>
          {shortcuts.map(({ label, icon: Icon }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <button type="button" aria-label={label} onClick={() => setShortcut(label)} className={iconClass}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{label}</TooltipContent>
            </Tooltip>
          ))}
          <div title="杨强" aria-label="当前用户：杨强" className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs text-[#3069e6]">
            杨强
          </div>
        </div>
      </header>

      <Dialog open={shortcut !== null} onOpenChange={(open) => { if (!open) setShortcut(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{shortcut}</DialogTitle>
            <DialogDescription>
              {shortcut === '权限申请' && '在审批中心查看权限申请记录及审批进度。'}
              {shortcut === '指标说明' && '暂无指标说明。'}
              {shortcut === '帮助手册' && '平台导航与常用操作说明。'}
            </DialogDescription>
          </DialogHeader>
          {shortcut === '权限申请' && (
            <Button asChild onClick={() => setShortcut(null)}>
              <Link to="/approval-center/my-applications">前往我的申请</Link>
            </Button>
          )}
          {shortcut === '帮助手册' && (
            <div className="space-y-3 text-sm leading-6 text-text-secondary">
              <p>点击左上角九宫格切换模块，顶部和左侧菜单会同步更新；在工作空间下拉框中选择当前空间。</p>
              <p>在“数据资产 → 数据资产管理 → 数据分级降级”中查看或新建降级申请。</p>
              <p>右上角审批中心用于查看申请和处理审批，下载中心用于查看文件、入口配置及审计日志。</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
