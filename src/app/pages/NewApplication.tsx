import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Database, Download, Info, Loader2, Send } from 'lucide-react';
import { RequestType } from '../components/approval-center';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

const permissionOptions = ['只读查询', '数据导出', '数据写入'];

export default function NewApplication() {
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState<RequestType>('数据表权限');
  const [systemName, setSystemName] = useState('');
  const [databaseName, setDatabaseName] = useState('');
  const [tableNames, setTableNames] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['只读查询']);
  const [dataScope, setDataScope] = useState('');
  const [validity, setValidity] = useState('90');
  const [purpose, setPurpose] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const togglePermission = (permission: string) => {
    setPermissions((current) => current.includes(permission)
      ? current.filter((item) => item !== permission)
      : [...current, permission]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!systemName.trim()) nextErrors.systemName = '请输入所属系统';
    if (!databaseName.trim()) nextErrors.databaseName = '请输入数据库名称';
    if (!tableNames.trim()) nextErrors.tableNames = '请输入数据表名称';
    if (permissions.length === 0) nextErrors.permissions = '请至少选择一种权限';
    if (!purpose.trim()) nextErrors.purpose = '请输入申请用途';
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      alert('数据表权限申请已提交');
      navigate('/approval-center/my-applications');
    }, 800);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate('/approval-center/my-applications')}>
        <ArrowLeft className="mr-2 h-4 w-4" />返回我的申请
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">新建申请</h1>
        <p className="mt-1 text-sm text-text-secondary">审批中心采用统一流程承载不同类型的申请</p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>选择申请类型</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRequestType('数据表权限')}
              className={`rounded-lg border-2 p-4 text-left transition-colors ${
                requestType === '数据表权限' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
              }`}
            >
              <Database className="mb-3 h-5 w-5 text-violet-600" />
              <p className="font-medium">数据表权限</p>
              <p className="mt-1 text-sm text-text-secondary">申请数据表的查询、导出或写入权限</p>
            </button>
            <button
              type="button"
              onClick={() => setRequestType('数据下载')}
              className={`rounded-lg border-2 p-4 text-left transition-colors ${
                requestType === '数据下载' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
              }`}
            >
              <Download className="mb-3 h-5 w-5 text-primary" />
              <p className="font-medium">数据下载</p>
              <p className="mt-1 text-sm text-text-secondary">从业务页面带入筛选条件后提交下载申请</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {requestType === '数据下载' ? (
        <Card className="mt-5">
          <CardContent className="p-6">
            <Alert className="border-primary/20 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription>
                下载申请需要固化业务页面中的筛选条件和数据范围，请从目标业务页面的“导出数据”入口发起。
              </AlertDescription>
            </Alert>
            <div className="mt-5 flex justify-end">
              <Button onClick={() => navigate('/download-demo')}>
                <Download className="mr-2 h-4 w-4" />前往下载Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="mt-5">
            <CardHeader className="border-b">
              <CardTitle>数据表权限内容</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="systemName">所属系统 <span className="text-destructive">*</span></Label>
                  <Input id="systemName" placeholder="例：客户数据平台" value={systemName} onChange={(event) => setSystemName(event.target.value)} />
                  {errors.systemName && <p className="text-xs text-destructive">{errors.systemName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="databaseName">数据库名称 <span className="text-destructive">*</span></Label>
                  <Input id="databaseName" placeholder="例：customer_dw" value={databaseName} onChange={(event) => setDatabaseName(event.target.value)} />
                  {errors.databaseName && <p className="text-xs text-destructive">{errors.databaseName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tableNames">数据表名称 <span className="text-destructive">*</span></Label>
                <Textarea
                  id="tableNames"
                  rows={3}
                  placeholder="请输入数据表名称，多个表请换行填写"
                  value={tableNames}
                  onChange={(event) => setTableNames(event.target.value)}
                />
                {errors.tableNames && <p className="text-xs text-destructive">{errors.tableNames}</p>}
              </div>

              <div className="space-y-2">
                <Label>权限类型 <span className="text-destructive">*</span></Label>
                <div className="flex flex-wrap gap-3">
                  {permissionOptions.map((permission) => (
                    <label key={permission} className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="h-4 w-4 accent-primary"
                      />
                      {permission}
                    </label>
                  ))}
                </div>
                {errors.permissions && <p className="text-xs text-destructive">{errors.permissions}</p>}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="dataScope">数据范围</Label>
                  <Input id="dataScope" placeholder="例：仅华东区域数据" value={dataScope} onChange={(event) => setDataScope(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validity">权限有效期 <span className="text-destructive">*</span></Label>
                  <Select value={validity} onValueChange={setValidity}>
                    <SelectTrigger id="validity"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30天</SelectItem>
                      <SelectItem value="90">90天</SelectItem>
                      <SelectItem value="180">180天</SelectItem>
                      <SelectItem value="365">1年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">申请用途 <span className="text-destructive">*</span></Label>
                <Textarea
                  id="purpose"
                  rows={4}
                  placeholder="请说明使用场景、业务目标和必要性"
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                />
                {errors.purpose && <p className="text-xs text-destructive">{errors.purpose}</p>}
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium">审批流程预览</p>
                <p className="mt-2 text-sm text-text-secondary">直属主管 → 数据Owner → 安全审批组</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-5 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/approval-center/my-applications')}>取消</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              提交申请
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
