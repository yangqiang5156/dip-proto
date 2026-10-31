import { ArrowDown, Database, ShieldCheck, Table2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export interface ClassificationDowngradeDetailData {
  databaseName: string;
  tableName: string;
  fields: string[];
  originalLevel: string;
  targetLevel: string;
  reason: string;
  technicalOwner: string;
  items?: ClassificationDowngradeFieldItem[];
}

export interface ClassificationDowngradeFieldItem {
  field: string;
  originalLevel: string;
  targetLevel: string;
  reason: string;
}

interface ClassificationDowngradeDetailProps {
  downgrade: ClassificationDowngradeDetailData;
}

export function ClassificationDowngradeDetail({ downgrade }: ClassificationDowngradeDetailProps) {
  const items = downgrade.items?.length
    ? downgrade.items
    : downgrade.fields.map((field) => ({
        field,
        originalLevel: downgrade.originalLevel,
        targetLevel: downgrade.targetLevel,
        reason: downgrade.reason,
      }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>数据分级降级内容</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DetailItem icon={Database} label="数据库名" value={downgrade.databaseName} />
          <DetailItem icon={Table2} label="数据表名" value={downgrade.tableName} />
          <DetailItem icon={ShieldCheck} label="技术负责人" value={downgrade.technicalOwner} />
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[minmax(140px,1fr)_180px_minmax(220px,1.5fr)] gap-4 bg-muted/50 px-4 py-2.5 text-xs font-medium text-muted-foreground">
            <span>降级字段</span>
            <span>分级调整</span>
            <span>降级原因</span>
          </div>
          {items.map((item, index) => (
            <div key={`${item.field}-${index}`} className="grid grid-cols-[minmax(140px,1fr)_180px_minmax(220px,1.5fr)] gap-4 border-t px-4 py-3 text-sm">
              <span className="font-mono font-medium">{item.field}</span>
              <span className="flex items-center gap-2">
                <LevelBadge level={item.originalLevel} strong />
                <ArrowDown className="h-4 w-4 -rotate-90 text-muted-foreground" />
                <LevelBadge level={item.targetLevel} />
              </span>
              <span className="leading-6 text-foreground">{item.reason}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: typeof Database; label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function LevelBadge({ level, strong = false }: { level: string; strong?: boolean }) {
  return (
    <span className={`rounded-md border px-3 py-1 text-sm font-semibold ${
      strong
        ? 'border-destructive/30 bg-destructive-light text-destructive'
        : 'border-primary/30 bg-primary-light text-primary'
    }`}>
      {level}
    </span>
  );
}
