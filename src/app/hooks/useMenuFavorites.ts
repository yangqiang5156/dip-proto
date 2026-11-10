import { useMemo, useSyncExternalStore } from 'react';
import { menuCatalog } from '../navigation';

const storageKey = 'dip-proto.menu-favorites';
const catalogByPath = new Map(menuCatalog.map((item) => [item.path, item]));
const legacyPaths: Record<string, string> = {
  '/data-operations': '/data-operations/home',
  '/intelligent-analysis': '/intelligent-analysis/events',
  '/user-behavior': '/user-behavior/tracking/events',
  '/user-insights': '/user-insights/groups',
  '/intelligent-applications': '/intelligent-applications/development/services',
  '/full-link-diagnosis': '/full-link-diagnosis/business/devices',
};
const emptyPaths: string[] = [];
const listeners = new Set<() => void>();

function readStoredFavorites(): string[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    return Array.isArray(value)
      ? [...new Set(value.filter((path): path is string => typeof path === 'string')
        .map((path) => legacyPaths[path] || path).filter((path) => catalogByPath.has(path)))]
      : [];
  } catch {
    return [];
  }
}

let favoritePaths = readStoredFavorites();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function refreshFromStorage(event: StorageEvent) {
  if (event.key !== storageKey && event.key !== null) return;
  const next = readStoredFavorites();
  if (JSON.stringify(next) !== JSON.stringify(favoritePaths)) {
    favoritePaths = next;
    emitChange();
  }
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('storage', refreshFromStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', refreshFromStorage);
  };
}

function toggleFavorite(path: string) {
  if (!catalogByPath.has(path)) return;
  favoritePaths = favoritePaths.includes(path)
    ? favoritePaths.filter((item) => item !== path)
    : [...favoritePaths, path];
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(favoritePaths));
  } catch {
    // 本地存储不可用时，当前会话仍可正常使用收藏。
  }
  emitChange();
}

function moveFavorite(path: string, targetPath: string) {
  const from = favoritePaths.indexOf(path);
  const to = favoritePaths.indexOf(targetPath);
  if (from < 0 || to < 0 || from === to) return;
  const next = [...favoritePaths];
  next.splice(from, 1);
  next.splice(to, 0, path);
  favoritePaths = next;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(favoritePaths));
  } catch {
    // 本地存储不可用时，当前会话仍保留排序。
  }
  emitChange();
}

export function useMenuFavorites() {
  const paths = useSyncExternalStore(subscribe, () => favoritePaths, () => emptyPaths);
  const favorites = useMemo(() => paths.flatMap((path) => catalogByPath.get(path) || []), [paths]);
  return { favoritePaths: paths, favorites, toggleFavorite, moveFavorite };
}
