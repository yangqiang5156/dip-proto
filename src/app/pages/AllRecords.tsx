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
import { StatusBadge, ApprovalStatus } from '../components/download-center/StatusBadge';
import { RiskLevelBadge } from '../components/download-center/RiskLevelBadge';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Eye,
  RotateCw,
  Loader2,
  XCircle,
  ShieldAlert,
} from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high';
type FileStatus = '未生成' | '生成中' | '待下载' | '已下载' | '已过期' | '生成失败';

interface AdminRecord {
  id: string;
  requestId: string;
  applicant: string;
  department: string;
  module: string;
  entryName: string;
  riskLevel: RiskLevel;
  approvalStatus: ApprovalStatus;
  fileStatus: FileStatus;
  lastOperationTime: string;
  operator?: string;
}

type PageState = 'loading' | 'error' | 'empty' | 'data' | 'permission-denied';

export default function AllRecords() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('data');
  const [status, setStatus] = useState('');
  const [module, setModule] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [fileStatus, setFileStatus] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in production this would come from admin API
  const records: AdminRecord[] = [
    {
      id: '1',
      requestId: 'DL202604290031',
      applicant: '李明',
      department: '产品部',
      module: '数据分析',
      entryName: '用户行为分析',
      riskLevel: 'high',
      approvalStatus: '审批中',
      fileStatus: '未生成',
      lastOperationTime: '2026-04-29 14:35:10',
      operator: '张敏（直属领导）',
    },
    {
      id: '2',
      requestId: 'DL202604290028',
      applicant: '王芳',
      department: '财务部',
      module: '财务管理',
      entryName: '销售数据导出',
      riskLevel: 'high',
      approvalStatus: '已驳回',
      fileStatus: '未生成',
      lastOperationTime: '2026-04-29 11:05:40',
      operator: '周强（功能负责人）',
    },
    {
      id: '3',
      requestId: 'DL202604280156',
      applicant: '张敏',
      department: '市场部',
      module: '客户管理',
      entryName: '客户信息表',
      riskLevel: 'medium',
      approvalStatus: '待下载',
      fileStatus: '待下载',
      lastOperationTime: '2026-04-27 17:45:33',
      operator: '系统',
    },
    {
      id: '4',
      requestId: 'DL202604260089',
      applicant: '刘强',
      department: '运营部',
      module: '订单管理',
      entryName: '订单明细',
      riskLevel: 'low',
      approvalStatus: '已下载',
      fileStatus: '已下载',
      lastOperationTime: '2026-04-26 18:30:12',
      operator: '李明（申请人）',
    },
    {
      id: '5',
      requestId: 'DL202604250147',
      applicant: '陈华',
      department: '人力资源部',
      module: '人力资源',
      entryName: '员工绩效数据',
      riskLevel: 'medium',
      approvalStatus: '审批通过',
      fileStatus: '生成中',
      lastOperationTime: '2026-04-25 12:05:15',
      operator: '系统',
    },
    {
      id: '6',
      requestId: 'DL202604240123',
      applicant: '周杰',
      department: '技术部',
      module: '系统管理',
      entryName: '系统日志导出',
      riskLevel: 'low',
      approvalStatus: '审批通过',
      fileStatus: '生成失败',
      lastOperationTime: '2026-04-24 16:45:30',
      operator: '系统',
    },
    {
      id: '7',
      requestId: 'DL202604230078',
      applicant: '吴明',
      department: '市场部',
      module: '营销管理',
      entryName: '客户触达记录',
      riskLevel: 'medium',
      approvalStatus: '已过期',
      fileStatus: '已过期',
      lastOperationTime: '2026-04-23 10:25:15',
      operator: '系统',
    },
    {
      id: '8',
      requestId: 'DL202604220134',
      applicant: '郑丽',
      department: '财务部',
      module: '财务管理',
      entryName: '费用报销明细',
      riskLevel: 'low',
      approvalStatus: '文件生成中',
      fileStatus: '生成中',
      lastOperationTime: '2026-04-22 14:50:40',
      operator: '系统',
    },
    {
      id: '9',
      requestId: 'DL202604210095',
      applicant: '钱伟',
      department: '采购部',
      module: '采购管理',
      entryName: '供应商信息表',
      riskLevel: 'medium',
      approvalStatus: '审批通过',
      fileStatus: '生成失败',
      lastOperationTime: '2026-04-21 09:30:18',
      operator: '系统',
    },
    {
      id: '10',
      requestId: 'DL202604200112',
      applicant: '孙美',
      department: '客服部',
      module: '客户管理',
      entryName: '客户投诉记录',
      riskLevel: 'low',
      approvalStatus: '已下载',
      fileStatus: '已下载',
      lastOperationTime: '2026-04-20 15:20:35',
      operator: '孙美（申请人）',
    },
  ];

  const handleSearch = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleReset = () => {
    setStatus('');
    setModule('');
    setRiskLevel('');
    setFileStatus('');
    setTimeRange('');
    setSearchTerm('');
  };

  const handleRetry = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleViewDetail = (id: string) => {
    navigate(`/approval/${id}`);
  };

  const getFileStatusBadge = (fileStatus: FileStatus) => {
    const config: Record<FileStatus, { className: string; label: string }> = {
      未生成: { className: 'bg-muted text-text-secondary border border-border', label: '未生成' },
      生成中: { className: 'bg-info-light text-info border border-info/20', label: '生成中' },
      待下载: { className: 'bg-primary-light text-primary border border-primary/20', label: '待下载' },
      已下载: { className: 'bg-success-light text-success border border-success/20', label: '已下载' },
      已过期: { className: 'bg-muted text-text-secondary border border-border', label: '已过期' },
      生成失败: { className: 'bg-destructive-light text-destructive border border-destructive/20', label: '失败' },
    };

    const item = config[fileStatus];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.className}`}>
        {item.label}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        {/* Admin Notice */}
        

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar onSearch={handleSearch} onReset={handleReset}>
            <FilterItem label="申请单号/申请人">
              <Input
                placeholder="输入申请单号或申请人"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

            <FilterItem label="模块">
              <Select value={module} onValueChange={setModule}>
                <SelectTrigger>
                  <SelectValue placeholder="全部模块" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部模块</SelectItem>
                  <SelectItem value="data-analysis">数据分析</SelectItem>
                  <SelectItem value="finance">财务管理</SelectItem>
                  <SelectItem value="customer">客户管理</SelectItem>
                  <SelectItem value="order">订单管理</SelectItem>
                  <SelectItem value="hr">人力资源</SelectItem>
                  <SelectItem value="system">系统管理</SelectItem>
                </SelectContent>
              </Select>
            </FilterItem>

            <FilterItem label="风险等级">
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="全部等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部等级</SelectItem>
                  <SelectItem value="high">高风险</SelectItem>
                  <SelectItem value="medium">中风险</SelectItem>
                  <SelectItem value="low">低风险</SelectItem>
                </SelectContent>
              </Select>
            </FilterItem>

            <FilterItem label="文件状态">
              <Select value={fileStatus} onValueChange={setFileStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="generating">生成中</SelectItem>
                  <SelectItem value="ready">待下载</SelectItem>
                  <SelectItem value="downloaded">已下载</SelectItem>
                  <SelectItem value="expired">已过期</SelectItem>
                  <SelectItem value="failed">生成失败</SelectItem>
                </SelectContent>
              </Select>
            </FilterItem>

            <FilterItem label="时间范围">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="全部时间" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部时间</SelectItem>
                  <SelectItem value="today">今天</SelectItem>
                  <SelectItem value="week">本周</SelectItem>
                  <SelectItem value="month">本月</SelectItem>
                  <SelectItem value="quarter">本季度</SelectItem>
                </SelectContent>
              </Select>
            </FilterItem>
          </FilterBar>
        </div>

        {/* Loading State */}
        {pageState === 'loading' && (
          <div className="bg-white rounded-lg border border-border p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-text-secondary">加载中...</p>
          </div>
        )}

        {/* Error State */}
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

        {/* Permission Denied State */}
        {pageState === 'permission-denied' && (
          <div className="bg-white rounded-lg border border-border p-20 flex flex-col items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-warning mb-3" />
            <h3 className="text-base font-medium text-text-primary mb-2">权限不足</h3>
            <p className="text-sm text-text-secondary mb-4">您没有访问此页面的权限，请联系管理员</p>
          </div>
        )}

        {/* Empty State */}
        {pageState === 'empty' && (
          <div className="bg-white rounded-lg border border-border">
            <EmptyState
              type="no-data"
              title="暂无匹配记录"
              description="没有找到符合筛选条件的记录"
            />
          </div>
        )}

        {/* Data Table */}
        {pageState === 'data' && (
          <>
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">申请单号</TableHead>
                    <TableHead className="font-semibold">申请人</TableHead>
                    <TableHead className="font-semibold">部门</TableHead>
                    <TableHead className="font-semibold">模块</TableHead>
                    <TableHead className="font-semibold">入口名称</TableHead>
                    <TableHead className="font-semibold">风险等级</TableHead>
                    <TableHead className="font-semibold">审批状态</TableHead>
                    <TableHead className="font-semibold">文件状态</TableHead>
                    <TableHead className="font-semibold">最近操作时间</TableHead>
                    <TableHead className="font-semibold">操作人</TableHead>
                    <TableHead className="font-semibold text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow
                      key={record.id}
                      className={`hover:bg-muted/30 ${
                        record.fileStatus === '生成失败' ? 'bg-destructive-light/10' : ''
                      }`}
                    >
                      <TableCell className="font-medium font-mono text-xs text-primary">
                        {record.requestId}
                      </TableCell>
                      <TableCell className="font-medium">{record.applicant}</TableCell>
                      <TableCell className="text-text-secondary">
                        {record.department}
                      </TableCell>
                      <TableCell className="text-text-secondary">{record.module}</TableCell>
                      <TableCell className="font-medium">{record.entryName}</TableCell>
                      <TableCell>
                        <RiskLevelBadge level={record.riskLevel} size="sm" showIcon={false} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={record.approvalStatus} size="sm" />
                      </TableCell>
                      <TableCell>
                        {getFileStatusBadge(record.fileStatus)}
                      </TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {record.lastOperationTime}
                      </TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {record.operator}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(record.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                共 {records.length} 条记录
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
    </div>
  );
}
