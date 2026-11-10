import { useMemo, useSyncExternalStore } from 'react';
import { matchesMenuItem, menuCatalog } from '../navigation';

interface Visit { path: string; visitedAt: number }
const storageKey = 'dip-proto.recent-visits';
const listeners = new Set<() => void>();
const emptyVisits: Visit[] = [];
const catalog = new Map(menuCatalog.map((item) => [item.path, item]));

function readVisits(): Visit[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(value)) return [];
    const seen = new Set<string>();
    return value.filter((item): item is Visit => {
      if (!item || typeof item !== 'object' || !catalog.has(item.path) || item.path === '/workbench'
        || !Number.isFinite(item.visitedAt) || item.visitedAt <= 0 || seen.has(item.path)) return false;
      seen.add(item.path);
      return true;
    }).sort((a, b) => b.visitedAt - a.visitedAt).slice(0, 20);
  } catch { return []; }
}

let visits = readVisits();
function emit() { listeners.forEach((listener) => listener()); }
function onStorage(event: StorageEvent) {
  if (event.key !== storageKey && event.key !== null) return;
  const next = readVisits();
  if (JSON.stringify(next) !== JSON.stringify(visits)) { visits = next; emit(); }
}
function subscribe(listener: () => void) {
  if (!listeners.size) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener('storage', onStorage);
  };
}

export function recordRecentVisit(pathname: string) {
  if (pathname === '/workbench' || pathname === '/favorites') return;
  const item = menuCatalog.find((menu) => matchesMenuItem(menu, pathname));
  if (!item) return;
  visits = [{ path: item.path, visitedAt: Date.now() }, ...visits.filter((visit) => visit.path !== item.path)].slice(0, 20);
  try { window.localStorage.setItem(storageKey, JSON.stringify(visits)); } catch { /* 当前会话仍保留最近使用。 */ }
  emit();
}

export function useRecentVisits() {
  const snapshot = useSyncExternalStore(subscribe, () => visits, () => emptyVisits);
  return useMemo(() => snapshot.flatMap((visit) => {
    const item = catalog.get(visit.path);
    return item ? [{ ...item, visitedAt: visit.visitedAt }] : [];
  }), [snapshot]);
}

export function formatVisitTime(timestamp: number) {
  const now = Date.now();
  if (now - timestamp < 60_000) return '刚刚';
  const day = (value: number) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(value);
  const time = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false }).format(timestamp);
  if (day(timestamp) === day(now)) return `今天 ${time}`;
  if (day(timestamp) === day(now - 86_400_000)) return `昨天 ${time}`;
  return new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit' }).format(timestamp);
}
