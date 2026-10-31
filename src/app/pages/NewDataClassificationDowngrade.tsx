import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, CheckCircle2, Database, Loader2, Plus, ShieldCheck, Table2, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

type SubmitState = 'editing' | 'submitting' | 'success';
interface DowngradeFieldRow {
  id: number;
  field: string;
  originalLevel: string;
  targetLevel: string;
  reason: string;
}

const classificationLevels = ['S4', 'S3', 'S2', 'S1'];
const createEmptyRow = (id: number): DowngradeFieldRow => ({
  id,
  field: '',
  originalLevel: 'S4',
  targetLevel: 'S2',
  reason: '',
});

export default function NewDataClassificationDowngrade() {
  const navigate = useNavigate();
  const [databaseName, setDatabaseName] = useState('user_profile_dw');
  const [tableName, setTableName] = useState('dwd_user_profile');
  const [rows, setRows] = useState<DowngradeFieldRow[]>([
    {
      id: 1,
      field: 'mobile_phone',
      originalLevel: 'S4',
      targetLevel: 'S2',
      reason: '字段已完成脱敏处理，仅用于内部聚合分析。',
    },
  ]);
  const [nextRowId, setNextRowId] = useState(2);
  const [submitState, setSubmitState] = useState<SubmitState>('editing');
  const [validationError, setValidationError] = useState('');

  const detailUrl = useMemo(() => {
    const firstRow = rows[0] || createEmptyRow(0);
    const search = new URLSearchParams({
      databaseName,
      tableName,
      fields: rows.map((row) => row.field).join(','),
      originalLevel: firstRow.originalLevel,
      targetLevel: firstRow.targetLevel,
      reason: firstRow.reason,
      items: JSON.stringify(rows.map(({ field, originalLevel, targetLevel, reason }) => ({
        field,
        originalLevel,
        targetLevel,
        reason,
      }))),
    });
    return `/approval-center/request/classification-downgrade-1?${search.toString()}`;
  }, [databaseName, rows, tableName]);

  const updateRow = (id: number, changes: Partial<DowngradeFieldRow>) => {
    setRows((currentRows) => currentRows.map((row) => row.id === id ? { ...row, ...changes } : row));
    setValidationError('');
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, createEmptyRow(nextRowId)]);
    setNextRowId((currentId) => currentId + 1);
  };

  const removeRow = (id: number) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== id));
    setValidationError('');
  };

  const submit = () => {
    if (![databaseName, tableName].every((value) => value.trim()) || rows.some((row) => !row.field.trim() || !row.reason.trim())) {
      setValidationError('请完整填写所有必填信息。');
      return;
    }
    if (rows.some((row) => /[,，\s]/.test(row.field.trim()))) {
      setValidationError('每行只能填写一个字段，字段名中不能包含逗号或空格。');
      return;
    }
    if (new Set(rows.map((row) => row.field.trim())).size !== rows.length) {
      setValidationError('降级字段不能重复。');
      return;
    }
    if (rows.some((row) => classificationLevels.indexOf(row.targetLevel) <= classificationLevels.indexOf(row.originalLevel))) {
      setValidationError('每一行的降级后分级都必须低于降级前分级。');
      return;
    }

    setValidationError('');
    setSubmitState('submitting');
    window.setTimeout(() => setSubmitState('success'), 700);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate('/data-classification-downgrade-demo')}>
        <ArrowLeft className="mr-2 h-4 w-4" />返回降级申请列表
      </Button>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">新建数据分级降级申请</h1>
        <p className="mt-1 text-sm text-text-secondary">申请调整指定表字段的数据分级，提交后进入审批流程</p>
      </div>

      {submitState === 'success' && (
        <Alert className="mb-6 border-success/30 bg-success-light">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3 text-foreground">
            <span>申请 CL20260727001 已提交，当前节点：技术负责人。</span>
            <Button size="sm" onClick={() => navigate(detailUrl)}>查看申请详情</Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>申请信息</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="数据库名" required>
                <div className="relative">
                  <Database className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" value={databaseName} onChange={(event) => setDatabaseName(event.target.value)} placeholder="请输入数据库名" />
                </div>
              </FormField>
              <FormField label="数据表名" required>
                <div className="relative">
                  <Table2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" value={tableName} onChange={(event) => setTableName(event.target.value)} placeholder="请输入数据表名" />
                </div>
              </FormField>
            </div>

            <div className="space-y-3 border-t pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-foreground">字段降级明细</h3>
                  <p className="mt-1 text-xs text-muted-foreground">每行只能填写一个字段，不同字段可配置不同的分级调整和降级原因。</p>
                </div>
                <Button variant="outline" size="sm" onClick={addRow}>
                  <Plus className="mr-1.5 h-4 w-4" />新增一行
                </Button>
              </div>

              <div className="hidden grid-cols-[minmax(150px,1fr)_120px_120px_minmax(220px,1.5fr)_36px] gap-3 px-3 text-xs font-medium text-muted-foreground lg:grid">
                <span><span className="text-destructive">*</span> 要降级的表字段</span>
                <span><span className="text-destructive">*</span> 降级前分级</span>
                <span><span className="text-destructive">*</span> 降级后分级</span>
                <span><span className="text-destructive">*</span> 降级原因</span>
                <span />
              </div>

              {rows.map((row, index) => (
                <div key={row.id} className="grid grid-cols-1 gap-3 rounded-lg border bg-muted/20 p-3 lg:grid-cols-[minmax(150px,1fr)_120px_120px_minmax(220px,1.5fr)_36px]">
                  <div>
                    <Label className="mb-1.5 block text-xs lg:hidden">要降级的表字段</Label>
                    <Input
                      aria-label={`第${index + 1}行要降级的表字段`}
                      value={row.field}
                      onChange={(event) => updateRow(row.id, { field: event.target.value })}
                      placeholder="例如：mobile_phone"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-xs lg:hidden">降级前分级</Label>
                    <Select value={row.originalLevel} onValueChange={(value) => updateRow(row.id, { originalLevel: value })}>
                      <SelectTrigger aria-label={`第${index + 1}行降级前分级`}><SelectValue /></SelectTrigger>
                      <SelectContent>{classificationLevels.map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-xs lg:hidden">降级后分级</Label>
                    <Select value={row.targetLevel} onValueChange={(value) => updateRow(row.id, { targetLevel: value })}>
                      <SelectTrigger aria-label={`第${index + 1}行降级后分级`}><SelectValue /></SelectTrigger>
                      <SelectContent>{classificationLevels.map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-xs lg:hidden">降级原因</Label>
                    <Input
                      aria-label={`第${index + 1}行降级原因`}
                      value={row.reason}
                      onChange={(event) => updateRow(row.id, { reason: event.target.value })}
                      maxLength={200}
                      placeholder="请输入该字段的降级原因"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`删除第${index + 1}行`}
                    disabled={rows.length === 1}
                    onClick={() => removeRow(row.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            {validationError && <p className="text-sm text-destructive">{validationError}</p>}

            <div className="flex justify-end border-t pt-5">
              <Button onClick={submit} disabled={submitState === 'submitting'}>
                {submitState === 'submitting' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                提交申请
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle>审批流程</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3" data-testid="approval-flow">
              <FlowNode icon={CheckCircle2} title="申请人" active />
              <FlowArrow />
              <FlowNode icon={Table2} title="技术负责人" assignee="陈晨" />
              <FlowArrow />
              <FlowNode icon={ShieldCheck} title="信息安全" assignee="王玮 / 李子超（或签）" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FormField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block">{required && <span className="mr-1 text-destructive">*</span>}{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function FlowNode({
  icon: Icon,
  title,
  assignee,
  active = false,
}: {
  icon: typeof CheckCircle2;
  title: string;
  assignee?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 ${active ? 'border-primary/30 bg-primary-light' : 'bg-card'}`}
      data-testid="approval-flow-node"
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        {assignee && <p className="mt-0.5 text-xs text-muted-foreground">{assignee}</p>}
      </div>
    </div>
  );
}

function FlowArrow() {
  return <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />;
}
