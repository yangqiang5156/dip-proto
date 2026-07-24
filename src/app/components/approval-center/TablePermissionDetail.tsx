import { Check, ChevronDown, Search, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export interface TablePermissionDetailData {
  systemName: string;
  databaseName: string;
  tableNames: string[];
  permissions: string[];
  dataScope: string;
  validity: string;
  effectiveTime?: string;
}

interface TablePermissionDetailProps {
  permission: TablePermissionDetailData;
  creator: string;
  createdAt: string;
  reason: string;
  requestName: string;
}

const fieldRows = [
  { name: 'sn', description: 'sn', classification: '内部使用默认', level: 'S2', type: 'string' },
  { name: 'userid', description: '用户id', classification: '用户ID', level: 'S2', type: 'string' },
  { name: 'iot_userid', description: 'iot用户id', classification: '用户ID', level: 'S2', type: 'string' },
  { name: 'device_id', description: '设备id', classification: '设备ID', level: 'S2', type: 'string' },
  { name: 'create_time', description: '创建时间', classification: '创建时间', level: 'S2', type: 'string' },
  { name: 'status', description: '状态', classification: '状态数据', level: 'S2', type: 'string' },
  { name: 'domain', description: '服务域', classification: '内部使用默认', level: 'S2', type: 'string' },
];

export function TablePermissionDetail({
  permission,
  creator,
  createdAt,
  reason,
  requestName,
}: TablePermissionDetailProps) {
  const tableName = permission.tableNames[0] || 't05_ai_nlp_wakeup_log';
  const isWakeupLog = tableName === 't05_ai_nlp_wakeup_log';
  const tableDescription = isWakeupLog ? '语音唤醒日志' : requestName.replace(/^.*?[:：]/, '').replace(/权限审批申请$/, '').trim();
  const projectName = permission.databaseName === 'hdw_dwb'
    ? 'hdw_dwb（hdw_dwb）'
    : `${permission.databaseName}（${permission.databaseName}）`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基础信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
          <Info label="创建人" value={creator} />
          <Info label="来源系统" value={permission.systemName || '权限管理'} />
          <Info label="任务类型" value="权限审批" />
          <Info label="创建时间" value={createdAt} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>任务详情</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <Info label="数据对象类型" value="物理表权限" />
            <Info label="个人账号" value={creator} />
            <Info label="数据环境" value="生产环境" />
            <Info label="有效期至" value={permission.validity || '长期'} />
            <Info label="所属项目" value={projectName} />
            <Info label="申请原因" value={reason} />
            <Info label="权限类型" value={permission.permissions.join('、')} />
            <Info label="数据范围" value={permission.dataScope} />
            {permission.effectiveTime && <Info label="生效时间" value={permission.effectiveTime} />}
          </div>

          <div className="overflow-hidden rounded-lg border">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/40 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-text-secondary" />
                <span className="truncate text-sm font-medium">
                  物理表：{tableName}（{tableDescription}）
                </span>
                <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                  查看数据（表级）
                </Button>
              </div>
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <Input className="h-8 pl-8" placeholder="请输入字段关键词" />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20">
                  <TableHead className="w-12">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-primary text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  </TableHead>
                  <TableHead>序号</TableHead>
                  <TableHead>字段名</TableHead>
                  <TableHead>字段描述</TableHead>
                  <TableHead>数据分类</TableHead>
                  <TableHead>数据分级</TableHead>
                  <TableHead>数据类型</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldRows.map((field, index) => (
                  <TableRow key={field.name} className="bg-primary/[0.04] hover:bg-primary/[0.08]">
                    <TableCell>
                      <span className="flex h-4 w-4 items-center justify-center rounded bg-primary/70 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell>{field.description}</TableCell>
                    <TableCell>
                      <p className="text-xs text-text-tertiary">/数据分类/</p>
                      <p>{field.classification}</p>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500 px-2 py-0.5 text-xs font-medium text-cyan-600">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {field.level}
                      </span>
                    </TableCell>
                    <TableCell>{field.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">{label}</p>
      <p className="text-sm leading-relaxed text-foreground">{value}</p>
    </div>
  );
}
