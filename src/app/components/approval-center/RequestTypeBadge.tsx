import { Database, Download, ShieldCheck } from 'lucide-react';

export type RequestType = '数据下载' | '数据表权限' | '数据分级降级';

interface RequestTypeBadgeProps {
  type: RequestType;
}

export function RequestTypeBadge({ type }: RequestTypeBadgeProps) {
  const isDownload = type === '数据下载';
  const isTablePermission = type === '数据表权限';
  const Icon = isDownload ? Download : isTablePermission ? Database : ShieldCheck;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${
        isDownload
          ? 'border-primary/20 bg-primary-light text-primary'
          : isTablePermission
            ? 'border-violet-200 bg-violet-50 text-violet-700'
            : 'border-amber-200 bg-amber-50 text-amber-700'
      }`}
    >
      <Icon className="h-3 w-3" />
      {type}
    </span>
  );
}
