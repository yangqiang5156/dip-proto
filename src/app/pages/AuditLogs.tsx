import { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { FilterBar, FilterItem } from '../components/enterprise';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

type LogCategory = '下载日志' | '配置变更';
type OperationResult = 'success' | 'failure';
type PageState = 'normal' | 'loading' | 'empty';

interface AuditLogEntry {
  id: string;
  requestId: string;
  entryName: string;
  applicant: string;
  operator: string;
  category: LogCategory;
  operation: string;
  operationResult: OperationResult;
  timestamp: string;
  remark: string;
  ipAddress: string;
}

const auditLogs: AuditLogEntry[] = [
  {
    id: '1', requestId: 'REQ-20260429-001', entryName: '销售数据导出', applicant: '张三',
    operator: '张三', category: '下载日志', operation: '文件下载', operationResult: 'success',
    timestamp: '2026-04-29 14:35:50', remark: '文件大小: 2.3 MB', ipAddress: '10.120.45.67',
  },
  {
    id: '2', requestId: 'REQ-20260428-085', entryName: '订单明细', applicant: '吴七',
    operator: '吴七', category: '下载日志', operation: '文件下载', operationResult: 'success',
    timestamp: '2026-04-28 17:20:15', remark: '文件大小: 5.7 MB', ipAddress: '10.120.45.120',
  },
  {
    id: '3', requestId: 'REQ-20260428-083', entryName: '供应商信息表', applicant: '郑八',
    operator: '郑八', category: '下载日志', operation: '文件下载', operationResult: 'failure',
    timestamp: '2026-04-28 16:15:08', remark: '下载失败: 文件已过期', ipAddress: '10.120.45.125',
  },
  {
    id: '4', requestId: '-', entryName: '销售数据导出', applicant: '-',
    operator: '系统管理员', category: '配置变更', operation: '修改配置', operationResult: 'success',
    timestamp: '2026-04-29 08:00:00', remark: '更新入口基础信息', ipAddress: '10.120.45.200',
  },
  {
    id: '5', requestId: '-', entryName: '客户信息表', applicant: '-',
    operator: '系统管理员', category: '配置变更', operation: '新建配置', operationResult: 'success',
    timestamp: '2026-04-28 13:45:30', remark: '创建新入口配置，密级审批规则由数据开发平台提供', ipAddress: '10.120.45.200',
  },
  {
    id: '6', requestId: '-', entryName: '用户行为分析', applicant: '-',
    operator: '系统管理员', category: '配置变更', operation: '修改审批规则', operationResult: 'success',
    timestamp: '2026-04-28 11:20:15', remark: '同步数据开发平台密级审批规则', ipAddress: '10.120.45.200',
  },
];

export default function AuditLogs() {
  const [pageState, setPageState] = useState<PageState>('normal');
  const [requestId, setRequestId] = useState('');
  const [entryName, setEntryName] = useState('');
  const [operator, setOperator] = useState('');
  const [category, setCategory] = useState('all');
  const [operationResult, setOperationResult] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  const filteredLogs = useMemo(() => auditLogs.filter((log) => {
    const categoryMatches = category === 'all'
      || (category === 'download' && log.category === '下载日志')
      || (category === 'config' && log.category === '配置变更');
    const resultMatches = operationResult === 'all' || log.operationResult === operationResult;

    return categoryMatches
      && resultMatches
      && log.requestId.toLowerCase().includes(requestId.trim().toLowerCase())
      && log.entryName.includes(entryName.trim())
      && log.operator.includes(operator.trim());
  }), [category, entryName, operationResult, operator, requestId]);

  const handleSearch = () => {
    setPageState('loading');
    setTimeout(() => setPageState(filteredLogs.length === 0 ? 'empty' : 'normal'), 500);
  };

  const handleReset = () => {
    setRequestId('');
    setEntryName('');
    setOperator('');
    setCategory('all');
    setOperationResult('all');
    setTimeRange('all');
    setPageState('normal');
  };

  const getResultBadge = (result: OperationResult) => result === 'success' ? (
    <Badge className="border border-success/20 bg-success-light text-success">
      <CheckCircle2 className="mr-1 h-3 w-3" />成功
    </Badge>
  ) : (
    <Badge className="border border-destructive/20 bg-destructive-light text-destructive">
      <XCircle className="mr-1 h-3 w-3" />失败
    </Badge>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-text-primary">审计日志</h1>
          <p className="mt-1 text-sm text-text-secondary">统一查看下载日志和配置变更日志</p>
        </div>

        <FilterBar onSearch={handleSearch} onReset={handleReset}>
          <FilterItem label="申请单号">
            <Input placeholder="输入申请单号" value={requestId} onChange={(event) => setRequestId(event.target.value)} />
          </FilterItem>
          <FilterItem label="入口名称">
            <Input placeholder="输入入口名称" value={entryName} onChange={(event) => setEntryName(event.target.value)} />
          </FilterItem>
          <FilterItem label="操作人">
            <Input placeholder="输入操作人" value={operator} onChange={(event) => setOperator(event.target.value)} />
          </FilterItem>
          <FilterItem label="操作类型">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="download">下载日志</SelectItem>
                <SelectItem value="config">配置变更</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
          <FilterItem label="操作结果">
            <Select value={operationResult} onValueChange={setOperationResult}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部结果</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failure">失败</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
          <FilterItem label="时间范围">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部时间</SelectItem>
                <SelectItem value="today">今天</SelectItem>
                <SelectItem value="week">最近7天</SelectItem>
                <SelectItem value="month">最近30天</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterBar>

        {pageState === 'loading' && (
          <div className="rounded-lg border bg-white p-20 text-center">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-text-secondary">加载中...</p>
          </div>
        )}

        {(pageState === 'empty' || (pageState === 'normal' && filteredLogs.length === 0)) && (
          <div className="rounded-lg border bg-white p-20 text-center">
            <Calendar className="mx-auto mb-3 h-12 w-12 text-text-tertiary" />
            <h3 className="mb-2 text-base font-medium text-text-primary">暂无审计记录</h3>
            <p className="mb-4 text-sm text-text-secondary">当前筛选条件下没有找到相关记录</p>
            <Button onClick={handleReset} variant="outline" size="sm">重置筛选</Button>
          </div>
        )}

        {pageState === 'normal' && filteredLogs.length > 0 && (
          <>
            <div className="overflow-hidden rounded-lg border bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">申请单号</TableHead>
                    <TableHead className="font-semibold">入口名称</TableHead>
                    <TableHead className="font-semibold">申请人</TableHead>
                    <TableHead className="font-semibold">操作人</TableHead>
                    <TableHead className="font-semibold">操作类型</TableHead>
                    <TableHead className="font-semibold">操作内容</TableHead>
                    <TableHead className="font-semibold">操作结果</TableHead>
                    <TableHead className="font-semibold">操作时间</TableHead>
                    <TableHead className="font-semibold">备注</TableHead>
                    <TableHead className="font-semibold">IP地址</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-primary">{log.requestId}</TableCell>
                      <TableCell className="font-medium">{log.entryName}</TableCell>
                      <TableCell className="text-text-secondary">{log.applicant}</TableCell>
                      <TableCell className="text-text-secondary">{log.operator}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={log.category === '下载日志' ? 'text-primary' : 'text-warning'}>
                          {log.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.operation}</TableCell>
                      <TableCell>{getResultBadge(log.operationResult)}</TableCell>
                      <TableCell className="text-sm text-text-secondary">{log.timestamp}</TableCell>
                      <TableCell className="max-w-xs text-sm text-text-secondary">{log.remark}</TableCell>
                      <TableCell className="text-xs text-text-tertiary">{log.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">共 {filteredLogs.length} 条记录</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>上一页</Button>
                <span className="px-3 py-1 text-sm text-text-secondary">1 / 1</span>
                <Button variant="outline" size="sm" disabled>下一页</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
