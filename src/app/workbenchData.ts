import { BarChart3, Bot, Database, PanelsTopLeft, Settings2 } from 'lucide-react';
import { menuCatalog, platformCategories } from './navigation';
import type { MenuCatalogEntry } from './navigation';

const categoryDetails = {
  workbench: { icon: PanelsTopLeft, description: '汇集收藏、最近使用和平台功能入口，从这里开启你的日常工作。', roles: ['平台用户', '业务人员', '开发人员'] },
  'data-processing': { icon: Database, description: '统一管理数据资产、数据录入与屏端埋点，提供数据开发、算法开发和数据服务的功能入口。', roles: ['数据开发人员', '数据治理人员', '数据架构师', '业务分析师'] },
  'insight-analysis': { icon: BarChart3, description: '连接数据运营、智能分析、用户行为分析与用户洞察，按业务目标找到适合的分析工具。', roles: ['业务分析师', '数据分析师', '运营人员'] },
  'data-applications': { icon: Bot, description: '探索主动服务开发与运营能力，查询设备、用户、日志和故障，衔接具体业务场景。', roles: ['应用开发人员', '产品经理', '业务运营人员'] },
  'platform-services': { icon: Settings2, description: '集中处理审批、下载、权限和系统配置，通过收藏快速返回经常使用的功能。', roles: ['平台管理员', '项目管理员', '安全管理员'] },
};

export const workbenchCategories = platformCategories.map((category) => ({
  ...category,
  ...categoryDetails[category.id as keyof typeof categoryDetails],
}));

export const moduleDescriptions: Record<string, string> = {
  workbench: '搜索平台功能，查看收藏与最近使用',
  'data-assets': '数据录入、屏端埋点与数据分级管理',
  'data-development': '数据开发治理、算法开发与数据服务',
  'data-operations': '目标体系、APP运营与经营数据入口',
  'intelligent-analysis': '屏端事件分析、事件明细与转化漏斗',
  'user-behavior': '埋点管理、用户行为分析与A/B测试',
  'user-insights': '用户分群、用户画像与智能用户运营',
  'intelligent-applications': '主动服务配置、事件配置与技能运营',
  'full-link-diagnosis': '设备与用户查询、日志查询、故障查询',
  approval: '查看我的申请、处理审批与查询全部记录',
  download: '文件下载、入口配置、审计日志与演示功能',
  'system-management': '权限管理、通知管理、监控告警与系统配置',
  favorites: '统一查看并管理已收藏的功能入口',
};

export const workbenchModules = platformCategories.flatMap((category) => category.modules);

export function getMenuSource(item: MenuCatalogEntry) {
  return [item.moduleLabel, item.topMenuLabel, item.groupLabel]
    .filter((label, index, labels) => label && label !== labels[index - 1]).join(' / ');
}

export function getMenuIcon(item: MenuCatalogEntry) {
  return workbenchModules.find((module) => module.label === item.moduleLabel)?.icon || PanelsTopLeft;
}

export function searchWorkbenchMenus(query: string, moduleLabel = '') {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return menuCatalog.filter((item) => {
    if (moduleLabel && item.moduleLabel !== moduleLabel) return false;
    const text = `${item.label} ${getMenuSource(item)} ${item.description || ''} ${item.path}`.toLocaleLowerCase();
    return words.every((word) => text.includes(word));
  }).sort((a, b) => {
    if (!words.length) return 0;
    const term = query.trim().toLocaleLowerCase();
    const score = (item: MenuCatalogEntry) => item.label.toLocaleLowerCase() === term ? 0 : item.label.toLocaleLowerCase().includes(term) ? 1 : 2;
    return score(a) - score(b);
  });
}

export const workbenchGuides = [
  { id: 'navigation', title: '平台导航与功能搜索', tag: '指南', paragraphs: ['通过左上角九宫格查看平台分类和模块。悬浮模块可以预览菜单，点击模块会同步切换顶部与左侧菜单。', '工作台搜索支持功能名称、模块名称和菜单路径。可使用方向键选择结果，按 Enter 打开功能；按 ⌘ K 或 Ctrl K 可快速返回工作台搜索。'], actions: [{ label: '探索数据资产', path: '/data-assets/management/classification-downgrades' }] },
  { id: 'favorites', title: '收藏功能使用指南', tag: '指南', paragraphs: ['点击功能旁的五角星即可收藏或取消收藏。工作台、九宫格菜单与“我的收藏”使用同一份收藏列表。', '收藏保存在当前浏览器，刷新后保留。相同名称、不同路径的功能可以分别收藏。'], actions: [{ label: '查看我的收藏', path: '/favorites' }] },
  { id: 'workspace', title: '工作空间与模块切换', tag: '说明', paragraphs: ['顶部右侧的工作空间下拉框可切换当前显示的工作空间，选择会保留在当前浏览器。', '平台名称后的“工作台”按钮可从任意模块返回工作台。顶部菜单随当前模块变化，右侧审批中心和下载中心为全局入口。'], actions: [{ label: '进入工作台', path: '/workbench' }] },
  { id: 'approval', title: '数据申请与审批流程', tag: '指南', paragraphs: ['在“审批中心”中查看我的申请、我的审批及全部记录；在“下载中心”中查看文件、入口配置和审计日志。', '数据分级降级申请位于“数据资产 → 资产管理 → 数据资产管理 → 数据分级降级”。'], actions: [{ label: '进入审批中心', path: '/approval-center/my-applications' }, { label: '查看可下载文件', path: '/' }] },
  { id: 'favorite-order', title: '收藏排序与工作台展示', tag: '说明', paragraphs: ['在工作台点击“管理收藏”，再点击“查看全部收藏”进入我的收藏页面。拖动卡片左上角的手柄即可调整排序，也可以使用上移、下移按钮。', '排序会保存在当前浏览器。工作台按收藏顺序展示前 5 项，其余功能可在我的收藏中查看。'], actions: [{ label: '管理收藏顺序', path: '/favorites' }] },
  { id: 'download-files', title: '下载文件查看说明', tag: '指南', paragraphs: ['审批通过后，可通过下载中心查看导出文件及其生成状态。文件生成完成后，使用对应的下载入口获取文件。', '下载中心还提供入口配置与审计日志，便于查看下载相关配置和操作记录。'], actions: [{ label: '打开下载中心', path: '/' }] },
  { id: 'workbench-todos', title: '工作台待办使用说明', tag: '说明', paragraphs: ['工作台“我的待办”展示审批中心中待我处理的申请，可直接查看申请类型、申请人、当前节点和更新时间。', '点击卡片中的“去处理”进入对应审批详情；点击“全部审批”查看审批中心记录。没有待办时，也可以通过快捷入口查看我的申请与历史审批记录。'], actions: [{ label: '查看我的审批', path: '/approval-center/my-approvals' }] },
];
