import { menuCatalog } from '../navigation';

// 原型权限配置；接入权限服务后，替换为当前用户、当前工作空间的授权结果。
const requestablePaths = new Set([
  '/system-management/permissions/workspaces',
  '/system-management/permissions/users',
  '/system-management/permissions/roles',
  '/system-management/permissions/menus',
  '/system-management/permissions/dimension-groups',
  '/system-management/permissions/dimensions',
  '/system-management/permissions/dictionaries',
]);
export const permissionApplicationPath = '/system-management/permissions/applications/new';
export function getMenuAccess(path: string): 'granted' | 'requestable' {
  return requestablePaths.has(path) ? 'requestable' : 'granted';
}
export const requestableMenus = menuCatalog.filter((item) => getMenuAccess(item.path) === 'requestable');
export function getPermissionApplicationUrl(path: string) {
  return `${permissionApplicationPath}?${new URLSearchParams({ menu: path })}`;
}
