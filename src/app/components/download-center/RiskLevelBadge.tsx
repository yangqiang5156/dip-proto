import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RiskLevelBadgeProps {
  level: 'low' | 'medium' | 'high';
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

const riskConfig = {
  low: {
    label: '低风险',
    className: 'bg-success-light text-success border border-success/20',
    icon: ShieldCheck,
  },
  medium: {
    label: '中风险',
    className: 'bg-warning-light text-warning border border-warning/20',
    icon: AlertTriangle,
  },
  high: {
    label: '高风险',
    className: 'bg-destructive-light text-destructive border border-destructive/20',
    icon: AlertCircle,
  },
};

export function RiskLevelBadge({ level, showIcon = true, size = 'md' }: RiskLevelBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium ${sizeClass} ${config.className}`}
    >
      {showIcon && <Icon className={iconSize} />}
      {config.label}
    </span>
  );
}
