import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, Plus, ShieldCheck } from 'lucide-react';
import { FilterBar, FilterItem } from '../components/enterprise';
import { RequestTypeBadge } from '../components/approval-center';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

type DowngradeStatus = '审批中' | '审批通过' | '已驳回';

interface DowngradeRecord {
  id: string;
  requestId: string;
  databaseName: string;
  tableName: string;
  fields: string[];
  originalLevel: string;
  targetLevel: string;
  applicant: string;
  applyTime: string;
  status: DowngradeStatus;
  currentNode: string;
}

const records: DowngradeRecord[] = [
  {
    id: 'classification-downgrade-1',
    requestId: 'CL20260727001',
    databaseName: 'user_profile_dw',
    tableName: 'dwd_user_profile',
    fields: ['mobile_phone', 'home_address'],
    originalLevel: 'S4',
    targetLevel: 'S2',
    applicant: '杨强',
    applyTime: '2026-07-27 10:18:32',
    status: '审批中',
    currentNode: '技术负责人',
  },
  {
    id: 'classification-downgrade-2',
    requestId: 'CL20260726008',
    databaseName: 'device_ads',
    tableName: 'ads_device_active_summary',
    fields: ['region_code'],
    originalLevel: 'S3',
    targetLevel: 'S2',
    applicant: '李明',
    applyTime: '2026-07-26 16:42:10',
    status: '审批通过',
    currentNode: '流程结束',
  },
  {
    id: 'classification-downgrade-3',
    requestId: 'CL20260725003',
    databaseName: 'customer_dwd',
    tableName: 'dwd_customer_contact',
    fields: ['contact_phone', 'contact_address'],
    originalLevel: 'S4',
    targetLevel: 'S3',
    applicant: '张敏',
    applyTime: '2026-07-25 09:36:45',
    status: '已驳回',
    currentNode: '技术负责人',
  },
];

const statusStyles: Record<DowngradeStatus, string> = {
  审批中: 'border-warning/20 bg-warning-light text-warning',
  审批通过: 'border-success/20 bg-success-light text-success',
  已驳回: 'border-destructive/20 bg-destructive-light text-destructive',
};

export default function DataClassificationDowngradeDemo() {
  const navigate = useNavigate();
  const [requestId, setRequestId] = useState('');
  const [tableName, setTableName] = useState('');
  const [status, setStatus] = useState('all');

  const filteredRecords = useMemo(() => records.filter((record) => {
    const matchesRequestId = record.requestId.toLowerCase().includes(requestId.trim().toLowerCase());
    const matchesTableName = record.tableName.toLowerCase().includes(tableName.trim().toLowerCase());
    const matchesStatus = status === 'all' || record.status === status;
    return matchesRequestId && matchesTableName && matchesStatus;
  }), [requestId, status, tableName]);

  const reset = () => {
    setRequestId('');
    setTableName('');
    setStatus('all');
  };

  return (
    <div className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">数据分级降级申请</h1>
          <p className="mt-1 text-sm text-text-secondary">查看和发起数据表字段分级降级申请</p>
        </div>
        <Button onClick={() => navigate('/data-classification-downgrade-demo/new')}>
          <Plus className="mr-2 h-4 w-4" />新建降级申请
        </Button>
      </div>

      <FilterBar onSearch={() => undefined} onReset={reset}>
        <FilterItem label="申请单号">
          <Input value={requestId} onChange={(event) => setRequestId(event.target.value)} placeholder="请输入申请单号" />
        </FilterItem>
        <FilterItem label="数据表">
          <Input value={tableName} onChange={(event) => setTableName(event.target.value)} placeholder="请输入数据表名" />
        </FilterItem>
        <FilterItem label="审批状态">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="审批中">审批中</SelectItem>
              <SelectItem value="审批通过">审批通过</SelectItem>
              <SelectItem value="已驳回">已驳回</SelectItem>
            </SelectContent>
          </Select>
        </FilterItem>
      </FilterBar>

      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">申请单号</TableHead>
              <TableHead className="font-semibold">申请类型</TableHead>
              <TableHead className="font-semibold">数据库</TableHead>
              <TableHead className="font-semibold">数据表</TableHead>
              <TableHead className="font-semibold">降级字段</TableHead>
              <TableHead className="font-semibold">分级调整</TableHead>
              <TableHead className="font-semibold">申请人</TableHead>
              <TableHead className="font-semibold">申请时间</TableHead>
              <TableHead className="font-semibold">审批状态</TableHead>
              <TableHead className="font-semibold">当前节点</TableHead>
              <TableHead className="text-right font-semibold">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs font-medium text-primary">{record.requestId}</TableCell>
                <TableCell><RequestTypeBadge type="数据分级降级" /></TableCell>
                <TableCell>{record.databaseName}</TableCell>
                <TableCell className="font-medium">{record.tableName}</TableCell>
                <TableCell>
                  <div className="flex max-w-48 flex-wrap gap-1">
                    {record.fields.map((field) => <span key={field} className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{field}</span>)}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold">
                    <span className="text-destructive">{record.originalLevel}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-primary">{record.targetLevel}</span>
                  </span>
                </TableCell>
                <TableCell>{record.applicant}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{record.applyTime}</TableCell>
                <TableCell>
                  <span className={`inline-flex whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium ${statusStyles[record.status]}`}>
                    {record.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{record.currentNode}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/approval-center/request/${record.id}`)}>
                    <Eye className="mr-1 h-4 w-4" />查看详情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                  <ShieldCheck className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  暂无符合条件的降级申请
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">共 {filteredRecords.length} 条记录</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>上一页</Button>
          <span className="px-2 text-sm text-muted-foreground">1 / 1</span>
          <Button variant="outline" size="sm" disabled>下一页</Button>
        </div>
      </div>
    </div>
  );
}
