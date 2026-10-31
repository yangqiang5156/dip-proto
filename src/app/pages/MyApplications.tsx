import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Download, Eye, Loader2, RotateCw, XCircle } from 'lucide-react';
import { FilterBar, FilterItem, EmptyState } from '../components/enterprise';
import { RequestTypeBadge, RequestType } from '../components/approval-center';
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
import { StatusBadge } from '../components/download-center';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

type ApprovalStatus = '审批中' | '审批通过' | '已驳回';
type BusinessStatus =
  | '未生成'
  | '生成中'
  | '待下载'
  | '已下载'
  | '已过期'
  | '生成失败'
  | '待生效'
  | '已生效'
  | '已回收';
type PageState = 'loading' | 'error' | 'empty' | 'data';

interface Application {
  id: string;
  requestId: string;
  requestType: RequestType;
  classificationLevel?: string;
  requestName: string;
  module: string;
  applyTime: string;
  approvalStatus: ApprovalStatus;
  currentNode: string;
  businessStatus: BusinessStatus;
  canWithdraw: boolean;
}

const applications: Application[] = [
  {
    id: '1', requestId: 'DL20260429001', requestType: '数据下载', classificationLevel: 'S3', requestName: '销售分析报表导出',
    module: '数据分析', applyTime: '2026-04-29 10:30:15', approvalStatus: '审批中',
    currentNode: 'L3数据管家', businessStatus: '未生成', canWithdraw: true,
  },
  {
    id: 'table-request-1', requestId: 'TB20260710001', requestType: '数据表权限',
    requestName: '物理表：PROD-t05_ai_nlp_wakeup_log（语音唤醒日志）权限审批申请', module: '权限管理',
    applyTime: '2026-07-10 14:22:17', approvalStatus: '审批中', currentNode: '数据Owner',
    businessStatus: '待生效', canWithdraw: true,
  },
  {
    id: 'classification-downgrade-1', requestId: 'CL20260727001', requestType: '数据分级降级',
    requestName: 'dwd_user_profile 字段分级 S4 → S2', module: '数据治理',
    applyTime: '2026-07-27 10:18:32', approvalStatus: '审批中', currentNode: '技术负责人',
    businessStatus: '待生效', canWithdraw: true,
  },
  {
    id: '2', requestId: 'DL20260429002', requestType: '数据下载', classificationLevel: 'S3', requestName: '用户行为数据导出',
    module: '用户管理', applyTime: '2026-04-29 09:15:22', approvalStatus: '审批通过',
    currentNode: '-', businessStatus: '生成中', canWithdraw: false,
  },
  {
    id: 'table-request-2', requestId: 'TB20260428004', requestType: '数据表权限',
    requestName: 'ads_order_summary 订单汇总表', module: '数据仓库',
    applyTime: '2026-04-28 18:05:36', approvalStatus: '审批通过', currentNode: '流程结束',
    businessStatus: '已生效', canWithdraw: false,
  },
  {
    id: '3', requestId: 'DL20260428003', requestType: '数据下载', classificationLevel: 'S2', requestName: '订单明细导出',
    module: '订单中心', applyTime: '2026-04-28 16:45:30', approvalStatus: '审批通过',
    currentNode: '-', businessStatus: '待下载', canWithdraw: false,
  },
  {
    id: 'table-request-3', requestId: 'TB20260428006', requestType: '数据表权限',
    requestName: 'dwd_customer_contact 客户触达明细', module: '营销数据集市',
    applyTime: '2026-04-28 14:20:18', approvalStatus: '已驳回', currentNode: '信息安全',
    businessStatus: '待生效', canWithdraw: false,
  },
  {
    id: '5', requestId: 'DL20260427005', requestType: '数据下载', classificationLevel: 'S3', requestName: '客户信息导出',
    module: '客户管理', applyTime: '2026-04-27 11:35:42', approvalStatus: '审批通过',
    currentNode: '-', businessStatus: '已下载', canWithdraw: false,
  },
  {
    id: '7', requestId: 'DL20260425007', requestType: '数据下载', classificationLevel: 'S3', requestName: '物流数据导出',
    module: '物流管理', applyTime: '2026-04-25 09:50:33', approvalStatus: '审批通过',
    currentNode: '-', businessStatus: '生成失败', canWithdraw: false,
  },
];

const businessStatusStyles: Record<BusinessStatus, string> = {
  未生成: 'bg-muted text-text-secondary border-border',
  生成中: 'bg-info-light text-info border-info/20',
  待下载: 'bg-primary-light text-primary border-primary/20',
  已下载: 'bg-success-light text-success border-success/20',
  已过期: 'bg-muted text-text-secondary border-border',
  生成失败: 'bg-destructive-light text-destructive border-destructive/20',
  待生效: 'bg-warning-light text-warning border-warning/20',
  已生效: 'bg-success-light text-success border-success/20',
  已回收: 'bg-muted text-text-secondary border-border',
};

export default function MyApplications() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('data');
  const [requestId, setRequestId] = useState('');
  const [requestType, setRequestType] = useState('all');
  const [status, setStatus] = useState('all');
  const [requestName, setRequestName] = useState('');
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const filteredApplications = useMemo(() => applications.filter((application) => {
    const typeMatches = requestType === 'all' || application.requestType === requestType;
    const statusMatches = status === 'all' || application.approvalStatus === status;
    return typeMatches
      && statusMatches
      && application.requestId.toLowerCase().includes(requestId.trim().toLowerCase())
      && application.requestName.toLowerCase().includes(requestName.trim().toLowerCase());
  }), [requestId, requestName, requestType, status]);

  const handleSearch = () => {
    setPageState('loading');
    setTimeout(() => setPageState(filteredApplications.length === 0 ? 'empty' : 'data'), 500);
  };

  const handleReset = () => {
    setRequestId('');
    setRequestType('all');
    setStatus('all');
    setRequestName('');
    setPageState('data');
  };

  const handleWithdraw = (id: string) => {
    console.log('Withdrawing request:', id);
    setWithdrawingId(null);
    alert('申请已撤回');
  };

  const canDownload = (application: Application) => application.requestType === '数据下载'
    && ['待下载', '已下载'].includes(application.businessStatus);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-5">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">我的申请</h1>
            <p className="mt-1 text-sm text-text-secondary">统一查看数据下载和数据表权限申请</p>
          </div>
        </div>

        <FilterBar onSearch={handleSearch} onReset={handleReset}>
          <FilterItem label="申请单号">
            <Input placeholder="请输入申请单号" value={requestId} onChange={(event) => setRequestId(event.target.value)} />
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
                <SelectItem value="审批中">审批中</SelectItem>
                <SelectItem value="审批通过">审批通过</SelectItem>
                <SelectItem value="已驳回">已驳回</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
          <FilterItem label="申请名称">
            <Input placeholder="请输入申请名称" value={requestName} onChange={(event) => setRequestName(event.target.value)} />
          </FilterItem>
          <FilterItem label="申请时间"><Input type="date" /></FilterItem>
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
        {(pageState === 'empty' || (pageState === 'data' && filteredApplications.length === 0)) && (
          <div className="rounded-lg border bg-white">
            <EmptyState type="no-data" title="暂无申请记录" description="没有符合当前筛选条件的申请" />
          </div>
        )}
        {pageState === 'data' && filteredApplications.length > 0 && (
          <>
            <div className="overflow-hidden rounded-lg border bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">申请单号</TableHead>
                    <TableHead className="font-semibold">申请类型</TableHead>
                    <TableHead className="font-semibold">申请名称</TableHead>
                    <TableHead className="font-semibold">所属系统/模块</TableHead>
                    <TableHead className="font-semibold">申请时间</TableHead>
                    <TableHead className="font-semibold">审批状态</TableHead>
                    <TableHead className="font-semibold">当前节点</TableHead>
                    <TableHead className="font-semibold">业务状态</TableHead>
                    <TableHead className="text-right font-semibold">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs font-medium text-primary">{application.requestId}</TableCell>
                      <TableCell><RequestTypeBadge type={application.requestType} /></TableCell>
                      <TableCell className="font-medium">{application.requestName}</TableCell>
                      <TableCell className="text-text-secondary">{application.module}</TableCell>
                      <TableCell className="text-sm text-text-secondary">{application.applyTime}</TableCell>
                      <TableCell><StatusBadge status={application.approvalStatus} size="sm" /></TableCell>
                      <TableCell className="text-text-secondary">{application.currentNode}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${businessStatusStyles[application.businessStatus]}`}>
                          {application.businessStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/approval-center/request/${application.id}`)}>
                            <Eye className="mr-1 h-4 w-4" />详情
                          </Button>
                          {canDownload(application) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-success hover:bg-success/10 hover:text-success"
                              onClick={() => navigate(`/?requestId=${encodeURIComponent(application.requestId)}`)}
                            >
                              <Download className="mr-1 h-4 w-4" />去下载
                            </Button>
                          )}
                          {application.canWithdraw && (
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setWithdrawingId(application.id)}>
                              撤回
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">共 {filteredApplications.length} 条申请</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>上一页</Button>
                <span className="px-3 py-1 text-sm text-text-secondary">1 / 1</span>
                <Button variant="outline" size="sm" disabled>下一页</Button>
              </div>
            </div>
          </>
        )}
      </div>

      <AlertDialog open={!!withdrawingId} onOpenChange={(open) => !open && setWithdrawingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认撤回申请</AlertDialogTitle>
            <AlertDialogDescription>
              撤回后审批流程将立即终止。如仍需该数据或权限，需要重新发起申请。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => withdrawingId && handleWithdraw(withdrawingId)}
            >
              确认撤回
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
