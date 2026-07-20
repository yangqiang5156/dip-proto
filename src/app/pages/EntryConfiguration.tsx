import React, { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { RiskLevelBadge } from '../components/download-center/RiskLevelBadge';
import { EntryConfigEditor } from '../components/download-center/EntryConfigEditor';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Plus,
  Edit,
  Power,
  Copy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  RotateCw,
  ShieldAlert,
  FileCheck,
  MoreVertical,
} from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high';
type EntryStatus = '启用' | '停用';

interface EntryConfig {
  id: string;
  entryId: string;
  entryName: string;
  module: string;
  page: string;
  dataType: string;
  riskLevel: RiskLevel;
  approvalEnabled: boolean;
  status: EntryStatus;
  hasHealthIssue: boolean;
  healthIssueMessage?: string;
}

type PageState = 'loading' | 'error' | 'empty' | 'data';

export default function EntryConfiguration() {
  const [pageState, setPageState] = useState<PageState>('data');
  const [module, setModule] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [status, setStatus] = useState('');
  const [approvalEnabled, setApprovalEnabled] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [selectedEntry, setSelectedEntry] = useState<EntryConfig | undefined>(undefined);

  // Mock data
  const configs: EntryConfig[] = [
    {
      id: '1',
      entryId: 'ENTRY001',
      entryName: '销售数据导出',
      module: '财务管理',
      page: '销售报表',
      dataType: '交易数据',
      riskLevel: 'high',
      approvalEnabled: true,
      status: '启用',
      hasHealthIssue: false,
    },
    {
      id: '2',
      entryId: 'ENTRY002',
      entryName: '用户行为分析',
      module: '数据分析',
      page: '用户画像',
      dataType: '用户数据',
      riskLevel: 'medium',
      approvalEnabled: true,
      status: '启用',
      hasHealthIssue: true,
      healthIssueMessage: '缺少安全部门审批节点',
    },
    {
      id: '3',
      entryId: 'ENTRY003',
      entryName: '客户信息表',
      module: '客户管理',
      page: '客户列表',
      dataType: '客户数据',
      riskLevel: 'high',
      approvalEnabled: true,
      status: '启用',
      hasHealthIssue: false,
    },
    {
      id: '4',
      entryId: 'ENTRY004',
      entryName: '订单明细',
      module: '订单管理',
      page: '订单中心',
      dataType: '订单数据',
      riskLevel: 'low',
      approvalEnabled: true,
      status: '启用',
      hasHealthIssue: false,
    },
    {
      id: '5',
      entryId: 'ENTRY005',
      entryName: '员工绩效数据',
      module: '人力资源',
      page: '绩效管理',
      dataType: 'HR数据',
      riskLevel: 'medium',
      approvalEnabled: true,
      status: '停用',
      hasHealthIssue: false,
    },
    {
      id: '6',
      entryId: 'ENTRY006',
      entryName: '系统日志导出',
      module: '系统管理',
      page: '日志中心',
      dataType: '系统日志',
      riskLevel: 'low',
      approvalEnabled: false,
      status: '启用',
      hasHealthIssue: false,
    },
    {
      id: '7',
      entryId: 'ENTRY007',
      entryName: '供应商信息表',
      module: '采购管理',
      page: '供应商管理',
      dataType: '供应商数据',
      riskLevel: 'medium',
      approvalEnabled: true,
      status: '启用',
      hasHealthIssue: true,
      healthIssueMessage: '审批流程未完整配置',
    },
    {
      id: '8',
      entryId: 'ENTRY008',
      entryName: '费用报销明细',
      module: '财务管理',
      page: '报销管理',
      dataType: '财务数据',
      riskLevel: 'medium',
      approvalEnabled: true,
      status: '启用',
      hasHealthIssue: false,
    },
  ];

  const handleSearch = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleReset = () => {
    setModule('');
    setRiskLevel('');
    setStatus('');
    setApprovalEnabled('');
  };

  const handleRetry = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleCreateEntry = () => {
    setEditorMode('create');
    setSelectedEntry(undefined);
    setEditorOpen(true);
  };

  const handleEdit = (id: string) => {
    const entry = configs.find(c => c.id === id);
    if (entry) {
      setEditorMode('edit');
      setSelectedEntry(entry);
      setEditorOpen(true);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: EntryStatus) => {
    console.log('Toggle status for:', id, 'from', currentStatus);
  };

  const handleCopy = (id: string) => {
    console.log('Copy configuration:', id);
  };

  const handleSaveEntry = (data: any, enableOnSave: boolean) => {
    console.log('Saving entry:', data, 'Enable:', enableOnSave);
    // In a real app, this would save to backend
    setEditorOpen(false);
  };

  const getStatusBadge = (status: EntryStatus) => {
    if (status === '启用') {
      return (
        <Badge className="bg-success-light text-success border border-success/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          启用
        </Badge>
      );
    }
    return (
      <Badge className="bg-muted text-text-secondary border border-border">
        <XCircle className="h-3 w-3 mr-1" />
        停用
      </Badge>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex items-center justify-end">
          <Button onClick={handleCreateEntry}>
            <Plus className="h-4 w-4 mr-2" />
            新建入口
          </Button>
        </div>
        {/* Filter Bar */}
        <FilterBar onSearch={handleSearch} onReset={handleReset}>
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

          <FilterItem label="状态">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="enabled">启用</SelectItem>
                <SelectItem value="disabled">停用</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="是否启用审批">
            <Select value={approvalEnabled} onValueChange={setApprovalEnabled}>
              <SelectTrigger>
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="yes">已启用</SelectItem>
                <SelectItem value="no">未启用</SelectItem>
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
              title="暂无入口配置"
              description='点击"新建入口"创建第一个下载入口配置'
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
                    <TableHead className="font-semibold">入口ID</TableHead>
                    <TableHead className="font-semibold">入口名称</TableHead>
                    <TableHead className="font-semibold">所属模块</TableHead>
                    <TableHead className="font-semibold">所属页面</TableHead>
                    <TableHead className="font-semibold">数据类型</TableHead>
                    <TableHead className="font-semibold">风险等级</TableHead>
                    <TableHead className="font-semibold">审批启用</TableHead>
                    <TableHead className="font-semibold">状态</TableHead>
                    <TableHead className="font-semibold text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configs.map((config) => (
                    <TableRow
                      key={config.id}
                      className={`hover:bg-muted/30 ${
                        config.hasHealthIssue ? 'bg-warning-light/10' : ''
                      }`}
                    >
                      <TableCell className="font-medium font-mono text-xs text-primary">
                        {config.entryId}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{config.entryName}</span>
                          {config.hasHealthIssue && (
                            <AlertTriangle className="h-4 w-4 text-warning" title={config.healthIssueMessage} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-text-secondary">{config.module}</TableCell>
                      <TableCell className="text-text-secondary">{config.page}</TableCell>
                      <TableCell className="text-text-secondary">{config.dataType}</TableCell>
                      <TableCell>
                        <RiskLevelBadge level={config.riskLevel} size="sm" showIcon={false} />
                      </TableCell>
                      <TableCell>
                        {config.approvalEnabled ? (
                          <Badge className="bg-primary-light text-primary border border-primary/20">
                            <FileCheck className="h-3 w-3 mr-1" />
                            已启用
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            未启用
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(config.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(config.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(config.id, config.status)}
                            >
                              <Power className="h-4 w-4 mr-2" />
                              {config.status === '启用' ? '停用' : '启用'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopy(config.id)}>
                              <Copy className="h-4 w-4 mr-2" />
                              复制配置
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                共 {configs.length} 个入口配置
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

      <EntryConfigEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        mode={editorMode}
        data={selectedEntry ? {
          entryId: selectedEntry.entryId,
          entryName: selectedEntry.entryName,
          module: selectedEntry.module,
          page: selectedEntry.page,
          buttonName: 'Export',
          dataType: selectedEntry.dataType,
          riskLevel: selectedEntry.riskLevel,
          status: selectedEntry.status === '启用' ? 'enabled' : 'disabled'
        } : undefined}
        onSave={handleSaveEntry}
      />
    </div>
  );
}
