import { ChevronRight, Database, GitBranch, Info } from 'lucide-react';

export type DataClassificationLevel = 'S1' | 'S2' | 'S3' | 'S4';

export interface ClassificationFlowStep {
  name: string;
  type: 'initiator' | 'approval' | 'notification' | 'automatic';
}

const levelMeta: Record<DataClassificationLevel, { name: string; className: string }> = {
  S1: { name: '外部公开', className: 'border-success/30 bg-success-light text-success' },
  S2: { name: '内部使用', className: 'border-info/30 bg-info-light text-info' },
  S3: { name: '秘密', className: 'border-warning/30 bg-warning-light text-warning' },
  S4: { name: '绝密', className: 'border-destructive/30 bg-destructive-light text-destructive' },
};

export function getClassificationFlow(
  level: DataClassificationLevel,
  hasPersonalInfoOrCrossBorder = true,
): ClassificationFlowStep[] {
  if (level === 'S1') {
    return [
      { name: '提出人', type: 'initiator' },
      { name: '无需审批', type: 'automatic' },
    ];
  }

  if (level === 'S2') {
    return [
      { name: '提出人', type: 'initiator' },
      { name: 'iHaier卡片通知', type: 'notification' },
      { name: 'L3数据管家', type: 'approval' },
    ];
  }

  if (level === 'S3') {
    return [
      { name: '提出人', type: 'initiator' },
      { name: 'L3数据管家', type: 'approval' },
      { name: '信息安全（王玮/李子超或签）', type: 'approval' },
      ...(hasPersonalInfoOrCrossBorder
        ? [
            { name: '法务祝文君', type: 'approval' as const },
            { name: 'iHaier卡片通知', type: 'notification' as const },
          ]
        : []),
      { name: 'L3数据主人', type: 'approval' },
    ];
  }

  return [
    { name: '提出人', type: 'initiator' },
    { name: '直线', type: 'approval' },
    { name: '小微主', type: 'approval' },
    { name: 'L2数据管家', type: 'approval' },
    { name: '信息安全（王玮/李子超或签）', type: 'approval' },
    { name: '法务祝文君', type: 'approval' },
    { name: 'iHaier卡片通知', type: 'notification' },
    { name: 'L2数据主人', type: 'approval' },
  ];
}

export function getApprovalRoleNames(
  level: DataClassificationLevel,
  hasPersonalInfoOrCrossBorder = true,
) {
  return getClassificationFlow(level, hasPersonalInfoOrCrossBorder)
    .filter((step) => step.type === 'approval')
    .map((step) => step.name);
}

export function getRoleDisplayName(role: string) {
  if (role === '直线') return '张敏（数据开发平台角色）';
  if (role === '小微主') return '王芳（数据开发平台角色）';
  if (role === 'L2数据管家' || role === 'L3数据管家') return '李晨（数据开发平台角色）';
  if (role.startsWith('信息安全')) return '王玮 / 李子超（或签）';
  if (role === '法务祝文君') return '祝文君';
  if (role === 'L2数据主人' || role === 'L3数据主人') return '周强（数据开发平台角色）';
  if (role === 'iHaier卡片通知' || role === '无需审批') return '系统';
  return '数据开发平台自动解析';
}

interface DataClassificationApprovalFlowProps {
  level: DataClassificationLevel;
  hasPersonalInfoOrCrossBorder?: boolean;
  showSourceNotice?: boolean;
}

export function DataClassificationApprovalFlow({
  level,
  hasPersonalInfoOrCrossBorder = true,
  showSourceNotice = true,
}: DataClassificationApprovalFlowProps) {
  const meta = levelMeta[level];
  const steps = getClassificationFlow(level, hasPersonalInfoOrCrossBorder);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${meta.className}`}>
            {level} {meta.name}
          </span>
          <span className="text-sm font-medium text-text-primary">按导出字段最高密级自动匹配</span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
          <Database className="h-3.5 w-3.5" />数据开发平台
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div key={`${step.name}-${index}`} className="contents">
            <span
              className={`rounded-md border px-2.5 py-1.5 text-xs ${
                step.type === 'approval'
                  ? 'border-primary/25 bg-primary/10 text-primary'
                  : step.type === 'notification'
                    ? 'border-warning/30 bg-warning-light text-warning'
                    : step.type === 'automatic'
                      ? 'border-success/30 bg-success-light text-success'
                      : 'border-border bg-card text-text-secondary'
              }`}
            >
              {step.name}
            </span>
            {index < steps.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" />}
          </div>
        ))}
      </div>

      {level === 'S3' && (
        <p className="flex items-start gap-1.5 text-xs text-text-secondary">
          <GitBranch className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          涉及个人信息或跨境时进入“法务祝文君 → iHaier卡片通知”；否则信息安全通过后直接进入L3数据主人。
        </p>
      )}

      {showSourceNotice && (
        <p className="flex items-start gap-1.5 rounded-md bg-muted/50 px-3 py-2 text-xs text-text-secondary">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          审批角色及对应人员由数据开发平台按表自动解析，下载中心仅展示流程，不维护节点人员。
        </p>
      )}
    </div>
  );
}

export function DataClassificationFlowMatrix() {
  return (
    <div className="space-y-4">
      {(['S4', 'S3', 'S2', 'S1'] as DataClassificationLevel[]).map((level) => (
        <div key={level} className="rounded-lg border bg-card p-3">
          <DataClassificationApprovalFlow
            level={level}
            hasPersonalInfoOrCrossBorder
            showSourceNotice={false}
          />
        </div>
      ))}
      <p className="flex items-start gap-1.5 rounded-md bg-primary/5 px-3 py-2 text-xs text-text-secondary">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        流程按本次导出字段的最高密级匹配。A账号不允许发起下载；S1自动免审。
      </p>
      <p className="flex items-start gap-1.5 text-xs text-text-secondary">
        <Database className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        所有节点角色和人员均来自数据开发平台，下载中心不提供人员配置。
      </p>
    </div>
  );
}
