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
import { RequestTypeBadge, RequestType } from '../components/approval-center';

type ApprovalStatus = '待审批' | '审批通过' | '已驳回';
type PageState = 'loading' | 'error' | 'empty' | 'data';

interface ApprovalRecord {
  id: string;
  requestId: string;
  requestType: RequestType;
  applicant: string;
  department: string;
  module: string;
  entryName: string;
  status: ApprovalStatus;
  currentNode: string;
  updatedAt: string;
  isNew?: boolean;
}

const records: ApprovalRecord[] = [
  {
    id: '1', requestId: 'DL202604290015', requestType: '数据下载', applicant: '李明', department: '产品部',
    module: '数据分析', entryName: '用户行为分析', status: '待审批',
    currentNode: '功能负责人', updatedAt: '2026-04-29 09:15:30', isNew: true,
  },
  {
    id: '2', requestId: 'DL202604290012', requestType: '数据下载', applicant: '王芳', department: '财务部',
    module: '财务管理', entryName: '销售数据导出', status: '待审批',
    currentNode: '功能负责人', updatedAt: '2026-04-29 08:30:15', isNew: true,
  },
  {
    id: 'table-approval-1', requestId: 'TB20260710001', requestType: '数据表权限', applicant: '杨强', department: '智慧家庭平台',
    module: '权限管理', entryName: '物理表：PROD-t05_ai_nlp_wakeup_log（语音唤醒日志）权限审批申请', status: '待审批',
    currentNode: '数据Owner', updatedAt: '2026-07-10 14:22:17', isNew: true,
  },
  {
    id: '3', requestId: 'DL202604280097', requestType: '数据下载', applicant: '张敏', department: '市场部',
    module: '客户管理', entryName: '客户信息表', status: '待审批',
    currentNode: '功能负责人', updatedAt: '2026-04-28 16:45:10',
  },
  {
    id: '4', requestId: 'DL202604280075', requestType: '数据下载', applicant: '刘强', department: '运营部',
    module: '订单管理', entryName: '订单明细', status: '待审批',
    currentNode: '功能负责人', updatedAt: '2026-04-28 14:20:30',
  },
  {
    id: '5', requestId: 'DL202604280056', requestType: '数据下载', applicant: '陈华', department: '人力资源部',
    module: '人力资源', entryName: '员工绩效数据', status: '审批通过',
    currentNode: '流程结束', updatedAt: '2026-04-28 11:40:22',
  },
  {
    id: 'table-approval-2', requestId: 'TB202604270143', requestType: '数据表权限', applicant: '周杰', department: '技术部',
    module: '数据仓库', entryName: 'ads_order_summary 订单汇总表', status: '审批通过',
    currentNode: '流程结束', updatedAt: '2026-04-27 16:15:30',
  },
  {
    id: 'table-approval-3', requestId: 'TB202604270089', requestType: '数据表权限', applicant: '吴明', department: '市场部',
    module: '营销数据集市', entryName: 'dwd_customer_contact 客户触达明细', status: '已驳回',
    currentNode: '数据Owner', updatedAt: '2026-04-27 10:25:15',
  },
  {
    id: '8', requestId: 'DL202604260123', requestType: '数据下载', applicant: '郑丽', department: '财务部',
    module: '财务管理', entryName: '费用报销明细', status: '审批通过',
    currentNode: '流程结束', updatedAt: '2026-04-26 14:50:40',
  },
];

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

  const filteredRecords = useMemo(() => records.filter((record) => {
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
      <div className="flex-1 p-6 overflow-auto">
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
                        {record.isNew && <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">新</span>}
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
            <div className="mt-4 flex items-center justify-between">
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
