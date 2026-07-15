import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface ContextSummaryProps {
  entryName: string;
  moduleName: string;
  pageName: string;
  downloadButtonName: string;
  exportConditions: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const riskLevelConfig = {
  low: { label: '低风险', color: 'bg-success text-success-foreground' },
  medium: { label: '中风险', color: 'bg-warning text-warning-foreground' },
  high: { label: '高风险', color: 'bg-destructive text-destructive-foreground' },
};

export function ContextSummary({
  entryName,
  moduleName,
  pageName,
  downloadButtonName,
  exportConditions,
  riskLevel,
}: ContextSummaryProps) {
  const risk = riskLevelConfig[riskLevel];

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">申请上下文</h3>
          <Badge className={risk.color}>{risk.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">入口名称:</span>
            <p className="mt-1 text-foreground">{entryName}</p>
          </div>
          <div>
            <span className="text-muted-foreground">所属模块:</span>
            <p className="mt-1 text-foreground">{moduleName}</p>
          </div>
          <div>
            <span className="text-muted-foreground">页面名称:</span>
            <p className="mt-1 text-foreground">{pageName}</p>
          </div>
          <div>
            <span className="text-muted-foreground">下载按钮名称:</span>
            <p className="mt-1 text-foreground">{downloadButtonName}</p>
          </div>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">导出条件摘要:</span>
          <p className="mt-1 text-foreground">{exportConditions}</p>
        </div>
      </div>
    </Card>
  );
}
