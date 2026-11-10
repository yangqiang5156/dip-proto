import { Activity, BarChart3, BookOpen, Bot, ChartNoAxesCombined, ClipboardCheck, Code2, Download, Database, FileInput, MousePointerClick, LayoutGrid, ListTodo, Network, PanelsTopLeft, PieChart, Settings2, ShieldCheck, Star, Bell, Monitor, Users, UserRoundSearch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const DATA_CLASSIFICATION_PATH = '/data-assets/management/classification-downgrades';

export interface MenuItem {
  label: string;
  path: string;
  activePrefixes?: string[];
  description?: string;
  isNew?: boolean;
  blankPage?: boolean;
}

export interface MenuGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  items: MenuItem[];
  hideTitleInLauncher?: boolean;
}

export const menuGroups: MenuGroup[] = [
  {
    id: 'operations-home', label: '首页', icon: PanelsTopLeft, hideTitleInLauncher: true,
    items: [{ label: '首页', path: '/data-operations/home' }],
  },
  {
    id: 'operations-targets-2026', label: '2026年目标体系', icon: ChartNoAxesCombined,
    items: [
      { label: '战略目标日清', path: '/data-operations/targets/2026/strategy-daily' },
      { label: '月度目标完成', path: '/data-operations/targets/2026/monthly-completion' },
      { label: '月度目标完成-产业', path: '/data-operations/targets/2026/industry-monthly' },
      { label: '战略目标日清-小微', path: '/data-operations/targets/2026/micro-strategy-daily' },
      { label: '收入指标日清', path: '/data-operations/targets/2026/income-daily' },
      { label: '26年核心目标', path: '/data-operations/targets/2026/core-targets' },
    ],
  },
  {
    id: 'operations-screens', label: '智慧家大屏', icon: Monitor,
    items: [
      { label: '智慧家大屏', path: '/data-operations/targets/screens/smart-home' },
      { label: '智慧家大屏-智慧家庭通道', path: '/data-operations/targets/screens/smart-home-channel' },
    ],
  },
  {
    id: 'operations-targets-2025', label: '2025年目标体系', icon: ChartNoAxesCombined,
    items: [
      { label: '战略目标日清', path: '/data-operations/targets/2025/strategy-daily' },
      { label: '月度目标完成', path: '/data-operations/targets/2025/monthly-completion' },
      { label: '三个“1”目标完成', path: '/data-operations/targets/2025/three-ones' },
      { label: '战略目标日清-小微', path: '/data-operations/targets/2025/micro-strategy-daily' },
      { label: '月度目标完成-小微', path: '/data-operations/targets/2025/micro-monthly' },
    ],
  },
  {
    id: 'operations-external-data', label: '对外发布数据', icon: FileInput, hideTitleInLauncher: true,
    items: [{ label: '对外发布数据', path: '/data-operations/targets/external-data' }],
  },
  {
    id: 'operations-app-core', label: '核心指标', icon: BarChart3,
    items: [
      { label: '智家APP核心推送', path: '/data-operations/app/core/push' },
      { label: 'APP目标达成', path: '/data-operations/app/core/target-achievement' },
      { label: '指标体系画布', path: '/data-operations/app/core/metrics-canvas' },
    ],
  },
  {
    id: 'operations-app-users', label: '用户运营', icon: Users,
    items: [
      { label: '流量分析—活跃', path: '/data-operations/app/users/activity' },
      { label: '流量分析—活跃（小微）', path: '/data-operations/app/users/micro-activity' },
      { label: '流量分析—留存', path: '/data-operations/app/users/retention', isNew: true },
      { label: '流量分析—用户分层', path: '/data-operations/app/users/segmentation' },
      { label: '功能分析—故障诊断', path: '/data-operations/app/users/fault-diagnosis' },
      { label: '功能分析—耗材', path: '/data-operations/app/users/consumables' },
      { label: '功能分析—服务智能体', path: '/data-operations/app/users/service-agents' },
      { label: '售后分析—工单', path: '/data-operations/app/users/after-sales-orders' },
      { label: '活动分析—营销魔方', path: '/data-operations/app/users/marketing-cube' },
      { label: '用户评价分析', path: '/data-operations/app/users/reviews' },
    ],
  },
  {
    id: 'operations-app-messages', label: '消息推送', icon: Bell,
    items: [
      { label: '智家APP消息推送数据查询', path: '/data-operations/app/messages/push-data' },
      { label: '全流程消息推送', path: '/data-operations/app/messages/full-process' },
      { label: '短信自动化促绑看板', path: '/data-operations/app/messages/sms-binding' },
    ],
  },
  {
    id: 'operations-app-transactions', label: '平台交易', icon: BarChart3,
    items: [
      { label: '商城交易额', path: '/data-operations/app/transactions/mall' },
      { label: '三翼鸟外报数据', path: '/data-operations/app/transactions/three-winged-bird' },
    ],
  },
  {
    id: 'operations-app-performance', label: '性能指标', icon: Activity,
    items: [{ label: '缺陷逃逸/重开率看板', path: '/data-operations/app/performance/defects' }],
  },

  {
    id: 'application-service-management', label: '主动服务管理', icon: Settings2,
    items: [{ label: '主动服务配置', path: '/intelligent-applications/development/services' }],
  },
  {
    id: 'application-event-management', label: '事件管理', icon: MousePointerClick,
    items: [{ label: '事件配置', path: '/intelligent-applications/development/events' }],
  },
  {
    id: 'application-operations-overview', label: '数据概览', icon: BarChart3,
    items: [
      { label: '技能运营统计', path: '/intelligent-applications/operations/skill-statistics' },
      { label: '技能活跃分产业', path: '/intelligent-applications/operations/active-by-industry' },
      { label: '技能活跃分型号', path: '/intelligent-applications/operations/active-by-model' },
      { label: '技能推送分产业', path: '/intelligent-applications/operations/push-by-industry' },
      { label: '技能配置明细', path: '/intelligent-applications/operations/skill-configurations' },
    ],
  },
  {
    id: 'diagnosis-device-queries', label: '设备查询', icon: Monitor,
    items: [
      { label: '按设备查询', path: '/full-link-diagnosis/business/devices' },
      { label: '按用户查询', path: '/full-link-diagnosis/business/users' },
      { label: '家庭信息查询', path: '/full-link-diagnosis/business/families' },
    ],
  },
  {
    id: 'diagnosis-binding-queries', label: '绑定查询', icon: Network,
    items: [
      { label: '绑定日志查询', path: '/full-link-diagnosis/business/binding-logs' },
      { label: '绑定/解绑记录查询', path: '/full-link-diagnosis/business/binding-records' },
    ],
  },
  {
    id: 'diagnosis-user-queries', label: '用户查询', icon: Users,
    items: [{ label: '按手机号查询', path: '/full-link-diagnosis/business/mobile-users' }],
  },
  {
    id: 'diagnosis-data-reflow', label: '数据回流', icon: FileInput,
    items: [{ label: '日志明细', path: '/full-link-diagnosis/logs/details' }],
  },
  {
    id: 'diagnosis-chain-logs', label: '链式日志', icon: Network,
    items: [{ label: '链式日志查询', path: '/full-link-diagnosis/logs/chains' }],
  },
  {
    id: 'diagnosis-fault-queries', label: '故障查询', icon: Activity,
    items: [
      { label: '故障统计', path: '/full-link-diagnosis/faults/statistics' },
      { label: '故障过滤', path: '/full-link-diagnosis/faults/filter' },
    ],
  },

  {
    id: 'behavior-tracking', label: '埋点管理', icon: MousePointerClick,
    items: [
      { label: '事件管理', path: '/user-behavior/tracking/events', isNew: true },
      { label: '属性管理', path: '/user-behavior/tracking/properties', isNew: true },
    ],
  },
  {
    id: 'behavior-annotation', label: '数据标注', icon: Settings2,
    items: [
      { label: '事件归属', path: '/user-behavior/annotation/events' },
      { label: 'GIO应用归属', path: '/user-behavior/annotation/gio-applications' },
      { label: '其他应用归属', path: '/user-behavior/annotation/other-applications' },
    ],
  },
  {
    id: 'behavior-dictionaries', label: '数据字典管理', icon: BookOpen,
    items: [
      { label: '事件类型管理', path: '/user-behavior/dictionaries/event-types' },
      { label: '17业务归属编码表', path: '/user-behavior/dictionaries/business-17' },
      { label: '17归属自定义', path: '/user-behavior/dictionaries/custom-17' },
      { label: '20业务归属编码表', path: '/user-behavior/dictionaries/business-20' },
      { label: '30战略考核编码表', path: '/user-behavior/dictionaries/strategy-30' },
      { label: '应用组管理', path: '/user-behavior/dictionaries/application-groups' },
    ],
  },
  {
    id: 'behavior-projects', label: '埋点项目管理', icon: LayoutGrid,
    items: [
      { label: '项目管理', path: '/user-behavior/tracking/projects' },
      { label: '项目管理', path: '/user-behavior/tracking/projects-new', isNew: true },
    ],
  },
  {
    id: 'behavior-analysis', label: '用户行为分析', icon: Users, hideTitleInLauncher: true,
    items: [{ label: '用户行为分析(QT)', path: '/user-behavior/analysis/qt', description: '一站式增长分析和性能体验提升', isNew: true }],
  },
  {
    id: 'behavior-ab-testing', label: 'A/B测试', icon: ChartNoAxesCombined, hideTitleInLauncher: true,
    items: [{ label: 'A/B测试', path: '/user-behavior/experiments/ab-testing', description: '通过配置A/B实验，来确定最佳的产品方案', isNew: true }],
  },
  {
    id: 'insights-groups', label: '分群管理', icon: Users,
    items: [{ label: '用户分群', path: '/user-insights/groups' }],
  },
  {
    id: 'insights-portraits', label: '用户画像', icon: UserRoundSearch,
    items: [{ label: '用户画像', path: '/user-insights/portraits' }],
  },
  {
    id: 'insights-operations', label: '用户运营', icon: BarChart3, hideTitleInLauncher: true,
    items: [{ label: '智能用户运营(QA)', path: '/user-insights/operations', description: '智能用户增长运营，企业专属超级营销官', isNew: true }],
  },

  {
    id: 'intelligent-event-analysis',
    label: '事件分析',
    icon: Activity,
    items: [
      { label: '事件分析', path: '/intelligent-analysis/events' },
      { label: '事件明细分析', path: '/intelligent-analysis/event-details' },
    ],
  },
  {
    id: 'intelligent-conversion-analysis',
    label: '转化分析',
    icon: ChartNoAxesCombined,
    items: [
      { label: '转化漏斗', path: '/intelligent-analysis/conversion-funnel' },
    ],
  },
  {
    id: 'asset-data-entry',
    label: '数据录入管理',
    icon: FileInput,
    items: [
      { label: '数据录入', path: '/data-assets/data-entry', blankPage: true },
    ],
  },
  {
    id: 'asset-client-tracking',
    label: '屏端埋点数据管理',
    icon: MousePointerClick,
    items: [
      { label: '埋点事件管理', path: '/data-assets/tracking/events', blankPage: true },
      { label: '事件变量管理', path: '/data-assets/tracking/event-variables', blankPage: true },
      { label: '埋点分类管理', path: '/data-assets/tracking/categories', blankPage: true },
      { label: '合并事件管理', path: '/data-assets/tracking/merged-events', blankPage: true },
      { label: '应用管理', path: '/data-assets/tracking/applications', blankPage: true },
    ],
  },
  {
    id: 'download',
    label: '下载中心',
    icon: Download,
    items: [
      { label: '可下载文件', path: '/downloadable-files' },
      { label: '入口配置', path: '/approval-config' },
      { label: '审计日志', path: '/audit-logs' },
    ],
  },
  {
    id: 'approval',
    label: '审批中心',
    icon: ClipboardCheck,
    items: [
      {
        label: '我的申请',
        path: '/approval-center/my-applications',
        activePrefixes: ['/approval-center/request/'],
      },
      {
        label: '我的审批',
        path: '/approval-center/my-approvals',
        activePrefixes: ['/approval-center/approval/'],
      },
      { label: '全部记录', path: '/approval-center/all-records' },
    ],
  },
  {
    id: 'demo',
    label: '演示功能',
    icon: LayoutGrid,
    items: [
      { label: '下载Demo', path: '/download-demo' },
      { label: '飞书卡片Demo', path: '/feishu-card-demo' },
    ],
  },
  {
    id: 'asset-management',
    label: '数据资产管理',
    icon: Database,
    items: [
      {
        label: '数据分级降级',
        path: DATA_CLASSIFICATION_PATH,
        activePrefixes: [`${DATA_CLASSIFICATION_PATH}/`],
      },
    ],
  },
  {
    id: 'development-governance', label: '数据开发和治理', icon: Network,
    items: [{ label: '智能数据开发和治理', path: '/data-development/governance', description: '数据开发、治理、运营一体化平台', isNew: true }],
  },
  { id: 'algorithm-overview', label: '概览', icon: LayoutGrid, items: [{ label: '资源概览', path: '/data-development/algorithm/resources' }] },
  { id: 'algorithm-quotas', label: '资源配额', icon: Settings2, items: [{ label: '配额组列表', path: '/data-development/algorithm/quotas' }] },
  { id: 'algorithm-users', label: '用户', icon: Users, items: [{ label: '用户列表', path: '/data-development/algorithm/users' }] },
  { id: 'algorithm-notebooks', label: 'Notebook', icon: BookOpen, items: [{ label: 'Notebook列表', path: '/data-development/algorithm/notebooks' }] },
  { id: 'algorithm-tasks', label: '任务', icon: ListTodo, items: [{ label: '任务列表', path: '/data-development/algorithm/tasks' }] },
  {
    id: 'development-services', label: '数据服务', icon: Network,
    items: [
      { label: '数据服务开发', path: '/data-development/services/development' },
      { label: '数据服务调用统计', path: '/data-development/services/call-statistics' },
    ],
  },

  {
    id: 'system-permission-applications', label: '权限申请和授权', icon: ShieldCheck,
    items: [
      { label: '我的申请', path: '/system-management/permissions/applications' },
      { label: '我的授权', path: '/system-management/permissions/authorizations' },
    ],
  },
  {
    id: 'system-permission-config', label: '权限配置管理', icon: Settings2,
    items: [
      { label: '工作空间管理', path: '/system-management/permissions/workspaces' },
      { label: '用户管理', path: '/system-management/permissions/users' },
      { label: '角色管理', path: '/system-management/permissions/roles' },
      { label: '菜单管理', path: '/system-management/permissions/menus' },
      { label: '数据维度组管理', path: '/system-management/permissions/dimension-groups' },
      { label: '数据维度管理', path: '/system-management/permissions/dimensions' },
      { label: '数据字典管理', path: '/system-management/permissions/dictionaries' },
    ],
  },
  {
    id: 'system-notifications', label: '通知管理', icon: Bell,
    items: [
      { label: '通知公告管理', path: '/system-management/notifications/announcements' },
      { label: '测试quickbi', path: '/system-management/notifications/quickbi' },
    ],
  },
  {
    id: 'system-monitoring', label: '系统监控', icon: Monitor,
    items: [{ label: 'node耗时tob环境监控', path: '/system-management/monitoring/node-latency' }],
  },
  {
    id: 'system-config', label: '系统配置', icon: Settings2,
    items: [
      { label: '平台访问统计', path: '/system-management/settings/access-statistics' },
      { label: '审计管理', path: '/system-management/settings/audit' },
    ],
  },

];

export function matchesMenuItem(item: MenuItem, pathname: string) {
  return pathname === item.path
    || Boolean(item.activePrefixes?.some((prefix) => pathname.startsWith(prefix)));
}

export interface PlatformModule {
  id: string;
  label: string;
  icon: LucideIcon;
  topMenus: Array<{ label: string; path: string; groupIds: string[]; isNew?: boolean }>;
  routePrefix?: string;
  blankPages?: boolean;
  isNew?: boolean;
}

export const platformCategories: Array<{ id: string; label: string; modules: PlatformModule[] }> = [
  {
    id: 'workbench',
    label: '工作台',
    modules: [
      { id: 'workbench', label: '工作台', icon: PanelsTopLeft, topMenus: [{ label: '工作台', path: '/workbench', groupIds: [] }] },
    ],
  },
  {
    id: 'data-processing',
    label: '数据加工',
    modules: [
      {
        id: 'data-assets', label: '数据资产', icon: Database,
        topMenus: [{ label: '资产管理', path: DATA_CLASSIFICATION_PATH, groupIds: ['asset-data-entry', 'asset-client-tracking', 'asset-management'] }],
      },
      {
        id: 'data-development', label: '数据开发', icon: Code2, routePrefix: '/data-development', blankPages: true,
        topMenus: [
          { label: '数据开发和治理', path: '/data-development/governance', groupIds: ['development-governance'], isNew: true },
          { label: '算法开发', path: '/data-development/algorithm/resources', groupIds: ['algorithm-overview', 'algorithm-quotas', 'algorithm-users', 'algorithm-notebooks', 'algorithm-tasks'] },
          { label: '数据服务', path: '/data-development/services/development', groupIds: ['development-services'] },
        ],
      },
    ],
  },
  {
    id: 'insight-analysis', label: '洞察分析',
    modules: [
      {
        id: 'data-operations', label: '数据运营', icon: BarChart3, routePrefix: '/data-operations', blankPages: true,
        topMenus: [
          { label: '首页', path: '/data-operations/home', groupIds: ['operations-home'] },
          { label: '目标体系', path: '/data-operations/targets/2026/strategy-daily', groupIds: ['operations-targets-2026', 'operations-screens', 'operations-targets-2025', 'operations-external-data'] },
          { label: 'APP运营', path: '/data-operations/app/core/push', groupIds: ['operations-app-core', 'operations-app-users', 'operations-app-messages', 'operations-app-transactions', 'operations-app-performance'] },
        ],
      },
      { id: 'intelligent-analysis', label: '智能分析', icon: PieChart, routePrefix: '/intelligent-analysis', blankPages: true, topMenus: [{ label: '屏端行为分析', path: '/intelligent-analysis/events', groupIds: ['intelligent-event-analysis', 'intelligent-conversion-analysis'] }] },
      {
        id: 'user-behavior', label: '用户行为分析', icon: Users, routePrefix: '/user-behavior', blankPages: true, isNew: true,
        topMenus: [
          { label: '埋点管理', path: '/user-behavior/tracking/events', groupIds: ['behavior-tracking', 'behavior-annotation', 'behavior-dictionaries', 'behavior-projects'], isNew: true },
          { label: '用户行为分析', path: '/user-behavior/analysis/qt', groupIds: ['behavior-analysis'] },
          { label: 'A/B测试', path: '/user-behavior/experiments/ab-testing', groupIds: ['behavior-ab-testing'] },
        ],
      },
      {
        id: 'user-insights', label: '用户洞察', icon: UserRoundSearch, routePrefix: '/user-insights', blankPages: true,
        topMenus: [
          { label: '群体圈选', path: '/user-insights/groups', groupIds: ['insights-groups'] },
          { label: '群体洞察', path: '/user-insights/portraits', groupIds: ['insights-portraits'] },
          { label: '用户运营', path: '/user-insights/operations', groupIds: ['insights-operations'] },
        ],
      },
    ],
  },
  {
    id: 'data-applications', label: '数据应用',
    modules: [
      {
        id: 'intelligent-applications', label: '智能应用', icon: Bot, routePrefix: '/intelligent-applications', blankPages: true,
        topMenus: [
          { label: '主动服务开发', path: '/intelligent-applications/development/services', groupIds: ['application-service-management', 'application-event-management'] },
          { label: '主动服务运营', path: '/intelligent-applications/operations/skill-statistics', groupIds: ['application-operations-overview'] },
        ],
      },
      {
        id: 'full-link-diagnosis', label: '全链路诊断', icon: Activity, routePrefix: '/full-link-diagnosis', blankPages: true,
        topMenus: [
          { label: '业务查询', path: '/full-link-diagnosis/business/devices', groupIds: ['diagnosis-device-queries', 'diagnosis-binding-queries', 'diagnosis-user-queries'] },
          { label: '日志查询', path: '/full-link-diagnosis/logs/details', groupIds: ['diagnosis-data-reflow', 'diagnosis-chain-logs'] },
          { label: '故障查询', path: '/full-link-diagnosis/faults/statistics', groupIds: ['diagnosis-fault-queries'] },
        ],
      },
    ],
  },
  {
    id: 'platform-services',
    label: '平台管理',
    modules: [
      { id: 'approval', label: '审批中心', icon: ClipboardCheck, topMenus: [{ label: '审批中心', path: '/approval-center/my-applications', groupIds: ['approval'] }] },
      { id: 'download', label: '下载中心', icon: Download, topMenus: [{ label: '下载中心', path: '/downloadable-files', groupIds: ['download', 'demo'] }] },
      {
        id: 'system-management', label: '系统管理', icon: Settings2, routePrefix: '/system-management', blankPages: true,
        topMenus: [
          { label: '权限管理', path: '/system-management/permissions/applications', groupIds: ['system-permission-applications', 'system-permission-config'] },
          { label: '通知管理', path: '/system-management/notifications/announcements', groupIds: ['system-notifications'] },
          { label: '监控告警', path: '/system-management/monitoring/node-latency', groupIds: ['system-monitoring'] },
          { label: '系统管理', path: '/system-management/settings/access-statistics', groupIds: ['system-config'] },
        ],
      },
      { id: 'favorites', label: '我的收藏', icon: Star, routePrefix: '/favorites', topMenus: [{ label: '我的收藏', path: '/favorites', groupIds: [] }] },
    ],
  },
];

export function getPlatformModuleId(pathname: string) {
  const routedModule = platformCategories.flatMap((category) => category.modules).find((module) =>
    module.routePrefix && (pathname === module.routePrefix || pathname.startsWith(`${module.routePrefix}/`)),
  );
  if (routedModule) return routedModule.id;
  if (pathname.startsWith('/data-assets')) return 'data-assets';
  if (pathname === '/workbench') return 'workbench';
  if (pathname.startsWith('/approval-center')) return 'approval';
  return 'download';
}

export function getPlatformModule(pathname: string) {
  const modules = platformCategories.flatMap((category) => category.modules);
  return modules.find((module) => module.id === getPlatformModuleId(pathname))!;
}

export function getActiveTopMenu(pathname: string) {
  const currentModule = getPlatformModule(pathname);
  return currentModule.topMenus.find((item) =>
    pathname === item.path || item.groupIds.some((id) =>
      menuGroups.find((group) => group.id === id)?.items.some((child) => matchesMenuItem(child, pathname)),
    ),
  ) || currentModule.topMenus[0];
}

export const blankModulePagePaths = [...new Set(
  platformCategories.flatMap((category) => category.modules)
    .filter((module) => module.blankPages)
    .flatMap((module) => module.topMenus.flatMap((item) => [
      item.path,
      ...item.groupIds.flatMap((id) => menuGroups.find((group) => group.id === id)?.items.map((child) => child.path) || []),
    ]))
    .concat(menuGroups.flatMap((group) => group.items.filter((item) => item.blankPage).map((item) => item.path))),
)];

export interface MenuCatalogEntry extends MenuItem {
  moduleLabel: string;
  topMenuLabel: string;
  groupLabel?: string;
}

// 只记录真实功能入口；同名功能通过路径区分，不收藏收藏模块自身。
export const menuCatalog: MenuCatalogEntry[] = platformCategories.flatMap((category) =>
  category.modules.filter((module) => module.id !== 'favorites').flatMap((module) =>
    module.topMenus.flatMap((topMenu) => {
      const source = { moduleLabel: module.label, topMenuLabel: topMenu.label };
      if (!topMenu.groupIds.length) return [{ label: topMenu.label, path: topMenu.path, ...source }];
      return topMenu.groupIds.flatMap((id) => {
        const group = menuGroups.find((item) => item.id === id);
        return group?.items.map((item) => ({ ...item, ...source, groupLabel: group.label })) || [];
      });
    }),
  ),
);
