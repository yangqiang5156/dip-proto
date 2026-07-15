import React from 'react';

export type ApprovalStatus =
  | '审批中'
  | '已驳回'
  | '审批通过'
  | '文件生成中'
  | '待下载'
  | '已下载'
  | '已过期'
  | '生成失败'
  | '已停用';

interface StatusBadgeProps {
  status: ApprovalStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<ApprovalStatus, { className: string; dotColor: string }> = {
  审批中: {
    className: 'bg-warning-light text-warning border border-warning/20',
    dotColor: 'bg-warning',
  },
  已驳回: {
    className: 'bg-destructive-light text-destructive border border-destructive/20',
    dotColor: 'bg-destructive',
  },
  审批通过: {
    className: 'bg-success-light text-success border border-success/20',
    dotColor: 'bg-success',
  },
  文件生成中: {
    className: 'bg-info-light text-info border border-info/20',
    dotColor: 'bg-info',
  },
  待下载: {
    className: 'bg-primary-light text-primary border border-primary/20',
    dotColor: 'bg-primary',
  },
  已下载: {
    className: 'bg-muted text-text-secondary border border-border',
    dotColor: 'bg-text-tertiary',
  },
  已过期: {
    className: 'bg-muted text-text-secondary border border-border',
    dotColor: 'bg-text-tertiary',
  },
  生成失败: {
    className: 'bg-destructive-light text-destructive border border-destructive/20',
    dotColor: 'bg-destructive',
  },
  已停用: {
    className: 'bg-muted text-text-secondary border border-border',
    dotColor: 'bg-text-tertiary',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium ${sizeClass} ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></span>
      {status}
    </span>
  );
}
