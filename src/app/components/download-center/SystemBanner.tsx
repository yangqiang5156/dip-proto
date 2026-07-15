import React from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '../ui/button';

export type BannerType = 'info' | 'warning' | 'error';

interface SystemBannerProps {
  type: BannerType;
  title: string;
  message: string;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const bannerConfig = {
  info: {
    icon: Info,
    className: 'bg-accent/10 border-accent/20 text-accent',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-warning/10 border-warning/20 text-warning',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-destructive/10 border-destructive/20 text-destructive',
  },
};

export function SystemBanner({
  type,
  title,
  message,
  onDismiss,
  action,
}: SystemBannerProps) {
  const config = bannerConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border p-4 ${config.className}`}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <h4 className="font-medium">{title}</h4>
          <p className="mt-1 text-sm opacity-90">{message}</p>

          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="mt-3"
            >
              {action.label}
            </Button>
          )}
        </div>

        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
