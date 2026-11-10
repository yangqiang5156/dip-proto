import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, Loader2, RotateCw, XCircle } from 'lucide-react';
import { FilterBar, FilterItem, EmptyState } from '../components/enterprise';
import { Button } from '../components/ui/button';
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
import { approvalRecords, type ApprovalStatus } from '../data/approvalRecords';
import { RequestTypeBadge } from '../components/approval-center';

type PageState = 'loading' | 'error' | 'empty' | 'data';

const statusStyles: Record<ApprovalStatus, string> = {
  待审批: 'bg-warning-light text-warning border-warning/20',
  审批通过: 'bg-success-light text-success border-success/20',
  已驳回: 'bg-destructive-light text-destructive border-destructive/20',
};

export default function MyApprovals() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('data');
  const [requestId, setRequestId] = useState('');
  const [applicant, setApplicant] = useState('');
  const [entryName, setEntryName] = useState('');
  const [status, setStatus] = useState('all');
  const [requestType, setRequestType] = useState('all');

  const filteredRecords = useMemo(() => approvalRecords.filter((record) => {
    const statusMatches = status === 'all'
      || (status === 'pending' && record.status === '待审批')
      || (status === 'approved' && record.status === '审批通过')
      || (status === 'rejected' && record.status === '已驳回');
    const typeMatches = requestType === 'all' || record.requestType === requestType;
    return statusMatches && typeMatches
      && record.requestId.toLowerCase().includes(requestId.trim().toLowerCase())
      && record.applicant.includes(applicant.trim())
      && record.entryName.includes(entryName.trim());
  }), [applicant, entryName, requestId, requestType, status]);

  const handleSearch = () => {
    setPageState('loading');
    setTimeout(() => setPageState('data'), 500);
  };

  const handleReset = () => {
    setRequestId('');
    setApplicant('');
    setEntryName('');
    setStatus('all');
    setRequestType('all');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="min-w-0 flex-1 overflow-auto p-4 xl:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-text-primary">我的审批</h1>
          <p className="mt-1 text-sm text-text-secondary">统一处理和查看数据下载、数据表权限及数据分级降级审批</p>
        </div>

        <FilterBar onSearch={handleSearch} onReset={handleReset}>
          <FilterItem label="申请单号">
            <Input placeholder="请输入申请单号" value={requestId} onChange={(event) => setRequestId(event.target.value)} />
          </FilterItem>
          <FilterItem label="申请人">
            <Input placeholder="请输入申请人" value={applicant} onChange={(event) => setApplicant(event.target.value)} />
          </FilterItem>
          <FilterItem label="申请名称">
            <Input placeholder="请输入申请名称" value={entryName} onChange={(event) => setEntryName(event.target.value)} />
          </FilterItem>
          <FilterItem label="申请类型">
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="数据下载">数据下载</SelectItem>
                <SelectItem value="数据表权限">数据表权限</SelectItem>
                <SelectItem value="数据分级降级">数据分级降级</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
          <FilterItem label="审批状态">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待审批</SelectItem>
                <SelectItem value="approved">审批通过</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
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
        {pageState === 'error' && (
          <div className="rounded-lg border bg-white p-20 text-center">
            <XCircle className="mx-auto mb-3 h-12 w-12 text-destructive" />
            <p className="mb-4 text-sm text-text-secondary">数据加载失败，请重试</p>
            <Button variant="outline" size="sm" onClick={handleSearch}>
              <RotateCw className="mr-1.5 h-4 w-4" />重新加载
            </Button>
          </div>
        )}
        {pageState === 'data' && filteredRecords.length === 0 && (
          <div className="rounded-lg border bg-white">
            <EmptyState type="no-data" title="暂无审批记录" description="没有符合当前筛选条件的审批记录" />
          </div>
        )}
        {pageState === 'data' && filteredRecords.length > 0 && (
          <>
            <div className="overflow-hidden rounded-lg border bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">申请单号</TableHead>
                    <TableHead className="font-semibold">申请类型</TableHead>
                    <TableHead className="font-semibold">申请人</TableHead>
                    <TableHead className="font-semibold">所属部门</TableHead>
                    <TableHead className="font-semibold">模块</TableHead>
                    <TableHead className="font-semibold">申请名称</TableHead>
                    <TableHead className="font-semibold">审批状态</TableHead>
                    <TableHead className="font-semibold">当前节点</TableHead>
                    <TableHead className="font-semibold">更新时间</TableHead>
                    <TableHead className="text-right font-semibold">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs font-medium text-primary">
                        <span>{record.requestId}</span>
                      </TableCell>
                      <TableCell><RequestTypeBadge type={record.requestType} /></TableCell>
                      <TableCell className="font-medium">{record.applicant}</TableCell>
                      <TableCell className="text-text-secondary">{record.department}</TableCell>
                      <TableCell className="text-text-secondary">{record.module}</TableCell>
                      <TableCell className="font-medium">{record.entryName}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${statusStyles[record.status]}`}>
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-text-secondary">{record.currentNode}</TableCell>
                      <TableCell className="text-sm text-text-secondary">{record.updatedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/approval-center/approval/${record.id}`)}>
                          <Eye className="mr-1 h-4 w-4" />查看详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-text-secondary">共 {filteredRecords.length} 条审批记录</span>
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
