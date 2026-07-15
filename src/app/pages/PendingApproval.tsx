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
import { RiskLevelBadge } from '../components/download-center/RiskLevelBadge';
import {
  XCircle,
  Loader2,
  RotateCw
} from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high';

interface PendingApproval {
  id: string;
  requestId: string;
  applicant: string;
  department: string;
  module: string;
  entryName: string;
  riskLevel: RiskLevel;
  currentNode: string;
  arrivedAt: string;
  waitingTime: string;
  isNew?: boolean;
}

type PageState = 'loading' | 'error' | 'empty' | 'data';

export default function PendingApproval() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('data');
  const [requestId, setRequestId] = useState('');
  const [applicant, setApplicant] = useState('');
  const [module, setModule] = useState('');
  const [entryName, setEntryName] = useState('');

  // Mock data - in real app this would come from API
  const approvals: PendingApproval[] = [
    {
      id: '1',
      requestId: 'DL202604290015',
      applicant: '李明',
      department: '产品部',
      module: '数据分析',
      entryName: '用户行为分析',
      riskLevel: 'high',
      currentNode: '功能负责人',
      arrivedAt: '2026-04-29 09:15:30',
      waitingTime: '2小时15分',
      isNew: true,
    },
    {
      id: '2',
      requestId: 'DL202604290012',
      applicant: '王芳',
      department: '财务部',
      module: '财务管理',
      entryName: '销售数据导出',
      riskLevel: 'high',
      currentNode: '功能负责人',
      arrivedAt: '2026-04-29 08:30:15',
      waitingTime: '3小时',
      isNew: true,
    },
    {
      id: '3',
      requestId: 'DL202604280098',
      applicant: '张敏',
      department: '市场部',
      module: '客户管理',
      entryName: '客户信息表',
      riskLevel: 'medium',
      currentNode: '功能负责人',
      arrivedAt: '2026-04-28 16:45:10',
      waitingTime: '18小时45分',
    },
    {
      id: '4',
      requestId: 'DL202604280075',
      applicant: '刘强',
      department: '运营部',
      module: '订单管理',
      entryName: '订单明细',
      riskLevel: 'low',
      currentNode: '功能负责人',
      arrivedAt: '2026-04-28 14:20:30',
      waitingTime: '21小时10分',
    },
    {
      id: '5',
      requestId: 'DL202604280056',
      applicant: '陈华',
      department: '人力资源部',
      module: '人力资源',
      entryName: '员工绩效数据',
      riskLevel: 'medium',
      currentNode: '功能负责人',
      arrivedAt: '2026-04-28 11:10:00',
      waitingTime: '1天15分',
    },
    {
      id: '6',
      requestId: 'DL202604270143',
      applicant: '周杰',
      department: '技术部',
      module: '系统管理',
      entryName: '系统日志导出',
      riskLevel: 'low',
      currentNode: '功能负责人',
      arrivedAt: '2026-04-27 15:30:22',
      waitingTime: '1天20小时',
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
    setApplicant('');
    setModule('');
    setEntryName('');
  };

  const handleRetry = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleApprove = (id: string) => {
    navigate(`/approval-decision/${id}`);
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        {/* Filter Bar */}
        <FilterBar onSearch={handleSearch} onReset={handleReset}>
          <FilterItem label="申请单号">
            <Input
              placeholder="请输入申请单号"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
            />
          </FilterItem>

          <FilterItem label="申请人">
            <Input
              placeholder="请输入申请人"
              value={applicant}
              onChange={(e) => setApplicant(e.target.value)}
            />
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

          <FilterItem label="时间范围">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="全部时间" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部时间</SelectItem>
                <SelectItem value="today">今天</SelectItem>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterBar>

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

        {/* Empty State */}
        {pageState === 'empty' && (
          <div className="bg-white rounded-lg border border-border">
            <EmptyState
              type="no-data"
              title="当前没有待处理申请"
              description="太棒了！您已经处理完所有待审批的申请"
            />
          </div>
        )}

        {/* Data Table */}
        {pageState === 'data' && (
          <>
            <div className="bg-white rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">申请单号</TableHead>
                    <TableHead className="font-semibold">申请人</TableHead>
                    <TableHead className="font-semibold">所属部门</TableHead>
                    <TableHead className="font-semibold">模块</TableHead>
                    <TableHead className="font-semibold">入口名称</TableHead>
                    <TableHead className="font-semibold">风险等级</TableHead>
                    <TableHead className="font-semibold">当前节点</TableHead>
                    <TableHead className="font-semibold">到达时间</TableHead>
                    <TableHead className="font-semibold">等待时长</TableHead>
                    <TableHead className="font-semibold text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.map((approval) => (
                    <TableRow
                      key={approval.id}
                      className={`hover:bg-muted/30 ${
                        approval.riskLevel === 'high' ? 'bg-destructive-light/20' : ''
                      }`}
                    >
                      <TableCell className="font-medium font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-primary">{approval.requestId}</span>
                          {approval.isNew && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary text-primary-foreground">
                              新
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{approval.applicant}</TableCell>
                      <TableCell className="text-text-secondary">
                        {approval.department}
                      </TableCell>
                      <TableCell className="text-text-secondary">{approval.module}</TableCell>
                      <TableCell className="font-medium">{approval.entryName}</TableCell>
                      <TableCell>
                        <RiskLevelBadge level={approval.riskLevel} size="sm" />
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {approval.currentNode}
                      </TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {approval.arrivedAt}
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${
                          approval.waitingTime.includes('天') || parseInt(approval.waitingTime) > 12
                            ? 'text-warning'
                            : 'text-text-secondary'
                        }`}>
                          {approval.waitingTime}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(approval.id)}
                        >
                          审批
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
                共 {approvals.length} 条待审批记录
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
