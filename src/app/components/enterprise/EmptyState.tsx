import React from 'react';
import { FileX, ShieldOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

export type EmptyStateType = 'no-data' | 'no-permission' | 'no-pending' | 'error';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

const emptyStateConfig: Record<
  EmptyStateType,
  { icon: any; defaultTitle: string; defaultDescription: string }
> = {
  'no-data': {
    icon: FileX,
    defaultTitle: '暂无数据',
    defaultDescription: '当前没有符合条件的数据',
  },
  'no-permission': {
    icon: ShieldOff,
    defaultTitle: '暂无权限',
    defaultDescription: '您当前没有访问此内容的权限,请联系管理员',
  },
  'no-pending': {
    icon: CheckCircle,
    defaultTitle: '暂无待处理事项',
    defaultDescription: '当前没有需要您处理的审批',
  },
  error: {
    icon: AlertCircle,
    defaultTitle: '加载失败',
    defaultDescription: '数据加载失败,请稍后重试',
  },
};

export function EmptyState({
  type = 'no-data',
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = icon || config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {React.isValidElement(Icon) ? (
          Icon
        ) : (
          <Icon className="w-8 h-8 text-text-tertiary" />
        )}
      </div>

      <h3 className="text-base font-medium text-text-primary mb-1">
        {title || config.defaultTitle}
      </h3>

      <p className="text-sm text-text-secondary text-center max-w-md mb-6">
        {description || config.defaultDescription}
      </p>

      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
