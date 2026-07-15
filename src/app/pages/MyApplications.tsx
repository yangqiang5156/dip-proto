import React, { useState } from 'react';
import { useNavigate } from 'react-router';
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
import { StatusBadge } from '../components/download-center';
import { Eye, RotateCw, XCircle, Loader2, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
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

type ApplicationStatus = '审批中' | '已驳回' | '审批通过' | '文件生成中' | '待下载' | '已下载' | '已过期' | '生成失败';

interface Application {
  id: string;
  requestId: string;
  entryName: string;
  module: string;
  applyTime: string;
  status: ApplicationStatus;
  currentNode?: string;
  fileStatus?: '生成中' | '可下载' | '已下载' | '已过期' | '生成失败';
  canWithdraw: boolean;
}

type PageState = 'loading' | 'error' | 'empty' | 'data';

export default function MyApplications() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('data');
  const [requestId, setRequestId] = useState('');
  const [status, setStatus] = useState('');
  const [entryName, setEntryName] = useState('');
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  // Mock data - in real app this would come from API
  const applications: Application[] = [
    {
      id: '1',
      requestId: 'REQ20260429001',
      entryName: '销售分析报表导出',
      module: '数据分析',
      applyTime: '2026-04-29 10:30:15',
      status: '审批中',
      currentNode: '部门主管',
      canWithdraw: true,
    },
    {
      id: '2',
      requestId: 'REQ20260429002',
      entryName: '用户行为数据导出',
      module: '用户管理',
      applyTime: '2026-04-29 09:15:22',
      status: '审批通过',
      currentNode: '-',
      fileStatus: '生成中',
      canWithdraw: false,
    },
    {
      id: '3',
      requestId: 'REQ20260428003',
      entryName: '订单明细导出',
      module: '订单中心',
      applyTime: '2026-04-28 16:45:30',
      status: '待下载',
      currentNode: '-',
      fileStatus: '���下载',
      canWithdraw: false,
    },
    {
      id: '4',
      requestId: 'REQ20260428004',
      entryName: '财务对账单导出',
      module: '财务管理',
      applyTime: '2026-04-28 14:20:18',
      status: '已驳回',
      currentNode: '安全审计',
      canWithdraw: false,
    },
    {
      id: '5',
      requestId: 'REQ20260427005',
      entryName: '客户信息导出',
      module: '客户管理',
      applyTime: '2026-04-27 11:35:42',
      status: '已下载',
      currentNode: '-',
      fileStatus: '已下载',
      canWithdraw: false,
    },
    {
      id: '6',
      requestId: 'REQ20260426006',
      entryName: '商品库存报表',
      module: '库存管理',
      applyTime: '2026-04-26 15:20:10',
      status: '已过期',
      currentNode: '-',
      fileStatus: '已过期',
      canWithdraw: false,
    },
    {
      id: '7',
      requestId: 'REQ20260425007',
      entryName: '物流数据导出',
      module: '物流管理',
      applyTime: '2026-04-25 09:50:33',
      status: '生成失败',
      currentNode: '-',
      fileStatus: '生成失败',
      canWithdraw: false,
    },
  ];

  const handleSearch = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleReset = () => {
    setRequestId('');
    setStatus('');
    setEntryName('');
  };

  const handleRetry = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleWithdraw = (id: string) => {
    console.log('Withdrawing request:', id);
    setWithdrawingId(null);
    alert('申请已撤回');
  };

  const handleViewDetail = (id: string) => {
    navigate(`/approval/${id}`);
  };

  const handleDownload = (id: string, entryName: string) => {
    console.log('Downloading file for request:', id);
    // 模拟下载文件
    alert(`正在下载文件: ${entryName}`);
    // 实际应用中这里会触发文件下载逻辑
  };

  const canDownload = (app: Application) => {
    return app.status === '待下载' && app.fileStatus === '可下载';
  };

  const showDownloadButton = (app: Application) => {
    return ['审批通过', '文件生成中', '待下载', '已下载', '已过期', '生成失败'].includes(app.status);
  };

  const getFileStatusBadge = (fileStatus?: string) => {
    if (!fileStatus) return '-';

    const config: Record<string, { className: string; label: string }> = {
      '生成中': { className: 'bg-info-light text-info border border-info/20', label: '生成中' },
      '可下载': { className: 'bg-success-light text-success border border-success/20', label: '可下载' },
      '已下载': { className: 'bg-muted text-text-secondary border border-border', label: '已下载' },
      '已过期': { className: 'bg-muted text-text-secondary border border-border', label: '已过期' },
      '生成失败': { className: 'bg-destructive-light text-destructive border border-destructive/20', label: '失败' },
    };

    const item = config[fileStatus] || config['已下载'];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.className}`}>
        {item.label}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        <FilterBar onSearch={handleSearch} onReset={handleReset}>
          <FilterItem label="申请单号">
            <Input
              placeholder="请输入申请单号"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
            />
          </FilterItem>

          <FilterItem label="审批状态">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">审批中</SelectItem>
                <SelectItem value="approved">审批通过</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
                <SelectItem value="downloading">待下载</SelectItem>
                <SelectItem value="downloaded">已下载</SelectItem>
                <SelectItem value="expired">已过期</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="入口名称">
            <Input
              placeholder="请输入入口名称"
              value={entryName}
              onChange={(e) => setEntryName(e.target.value)}
            />
          </FilterItem>

          <FilterItem label="申请时间">
            <Input
              type="date"
              placeholder="选择日期"
            />
          </FilterItem>
        </FilterBar>

        {pageState === 'loading' && (
          <div className="bg-white rounded-lg border border-border p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-text-secondary">加载中...</p>
          </div>
        )}

        {pageState === 'error' && (
          <div className="bg-white rounded-lg border border-border p-20 flex flex-col items-center justify-center">
            <XCircle className="w-12 h-12 text-destructive mb-3" />
            <h3 className="text-base font-medium text-text-primary mb-2">加载失败</h3>
            <p className="text-sm text-text-secondary mb-4">数据加载失败，请重试</p>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RotateCw className="w-4 h-4 mr-1.5" />
              重新加载
            </Button>
          </div>
        )}

        {pageState === 'empty' && (
          <div className="bg-white rounded-lg border border-border">
            <EmptyState
              type="no-data"
              title="暂无申请记录"
              description="您还没有提交过任何下载申请"
            />
          </div>
        )}

        {pageState === 'data' && (
          <>
            <div className="bg-white rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">申请单号</TableHead>
                    <TableHead className="font-semibold">入口名称</TableHead>
                    <TableHead className="font-semibold">所属模块</TableHead>
                    <TableHead className="font-semibold">申请时间</TableHead>
                    <TableHead className="font-semibold">当前状态</TableHead>
                    <TableHead className="font-semibold">当前节点</TableHead>
                    <TableHead className="font-semibold">文件状态</TableHead>
                    <TableHead className="font-semibold text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-primary font-mono text-xs">
                        {app.requestId}
                      </TableCell>
                      <TableCell className="font-medium">{app.entryName}</TableCell>
                      <TableCell className="text-text-secondary">{app.module}</TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {app.applyTime}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} size="sm" />
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {app.currentNode}
                      </TableCell>
                      <TableCell>
                        {getFileStatusBadge(app.fileStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(app.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            详情
                          </Button>

                          {showDownloadButton(app) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-success hover:text-success hover:bg-success/10"
                              onClick={() => handleDownload(app.id, app.entryName)}
                              disabled={!canDownload(app)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              下载
                            </Button>
                          )}

                          {app.canWithdraw && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setWithdrawingId(app.id)}
                            >
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

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                共 {applications.length} 条记录
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  上一页
                </Button>
                <span className="px-3 py-1 text-sm text-text-secondary">1 / 1</span>
                <Button variant="outline" size="sm" disabled>
                  下一页
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={!!withdrawingId} onOpenChange={(open) => !open && setWithdrawingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认撤回申请</AlertDialogTitle>
            <AlertDialogDescription>
              撤回后该申请将终止审批流程，如需下载需要重新提交申请。此操作不可恢复，确定要撤回吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => withdrawingId && handleWithdraw(withdrawingId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              确认撤回
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}