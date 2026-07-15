import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import {
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Settings,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  RotateCw,
  ShieldOff,
  Calendar,
} from 'lucide-react';

type LogType = 'application' | 'approval' | 'download' | 'config' | 'exception';
type OperationResult = 'success' | 'failure' | 'pending' | 'rejected';
type PageState = 'normal' | 'loading' | 'empty' | 'no-permission';

interface AuditLogEntry {
  id: string;
  requestId?: string;
  entryName: string;
  applicant: string;
  operator: string;
  operationType: string;
  operationResult: OperationResult;
  timestamp: string;
  remark: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export default function AuditLogs() {
  const [activeTab, setActiveTab] = useState<LogType>('application');
  const [pageState, setPageState] = useState<PageState>('normal');
  const [requestId, setRequestId] = useState('');
  const [entryName, setEntryName] = useState('');
  const [operator, setOperator] = useState('');
  const [operationType, setOperationType] = useState('');
  const [operationResult, setOperationResult] = useState('');
  const [timeRange, setTimeRange] = useState('');

  // Mock audit data
  const auditLogs: Record<LogType, AuditLogEntry[]> = {
    application: [
      {
        id: '1',
        requestId: 'REQ-20260429-001',
        entryName: '销售数据导出',
        applicant: '张三',
        operator: '张三',
        operationType: '提交申请',
        operationResult: 'success',
        timestamp: '2026-04-29 10:23:15',
        remark: '申请导出Q1销售数据用于季度分析',
        ipAddress: '10.120.45.67',
        deviceInfo: 'Chrome 130 / macOS',
      },
      {
        id: '2',
        requestId: 'REQ-20260429-002',
        entryName: '客户信息表',
        applicant: '李四',
        operator: '李四',
        operationType: '提交申请',
        operationResult: 'success',
        timestamp: '2026-04-29 09:15:32',
        remark: '需要导出华东区客户信息用于市场分析',
        ipAddress: '10.120.45.89',
        deviceInfo: 'Chrome 130 / Windows',
      },
      {
        id: '3',
        requestId: 'REQ-20260428-088',
        entryName: '用户行为分析',
        applicant: '王五',
        operator: '王五',
        operationType: '撤回申请',
        operationResult: 'success',
        timestamp: '2026-04-28 16:45:12',
        remark: '需求变更，撤回重新申请',
        ipAddress: '10.120.45.92',
        deviceInfo: 'Firefox 125 / macOS',
      },
    ],
    approval: [
      {
        id: '4',
        requestId: 'REQ-20260429-001',
        entryName: '销售数据导出',
        applicant: '张三',
        operator: '赵经理',
        operationType: '一级审批',
        operationResult: 'success',
        timestamp: '2026-04-29 11:05:42',
        remark: '同意，数据用途合理',
        ipAddress: '10.120.45.101',
        deviceInfo: 'Chrome 130 / Windows',
      },
      {
        id: '5',
        requestId: 'REQ-20260429-001',
        entryName: '销售数据导出',
        applicant: '张三',
        operator: '孙总监',
        operationType: '二级审批',
        operationResult: 'success',
        timestamp: '2026-04-29 14:22:18',
        remark: '批准',
        ipAddress: '10.120.45.110',
        deviceInfo: 'Safari 17 / macOS',
      },
      {
        id: '6',
        requestId: 'REQ-20260428-087',
        entryName: '员工绩效数据',
        applicant: '周六',
        operator: '钱经理',
        operationType: '一级审批',
        operationResult: 'rejected',
        timestamp: '2026-04-28 15:30:25',
        remark: '申请理由不充分，需补充使用场景说明',
        ipAddress: '10.120.45.115',
        deviceInfo: 'Chrome 130 / Windows',
      },
    ],
    download: [
      {
        id: '7',
        requestId: 'REQ-20260429-001',
        entryName: '销售数据导出',
        applicant: '张三',
        operator: '张三',
        operationType: '文件下载',
        operationResult: 'success',
        timestamp: '2026-04-29 14:35:50',
        remark: '文件大小: 2.3 MB, 下载次数: 1/3',
        ipAddress: '10.120.45.67',
        deviceInfo: 'Chrome 130 / macOS',
      },
      {
        id: '8',
        requestId: 'REQ-20260428-085',
        entryName: '订单明细',
        applicant: '吴七',
        operator: '吴七',
        operationType: '文件下载',
        operationResult: 'success',
        timestamp: '2026-04-28 17:20:15',
        remark: '文件大小: 5.7 MB, 下载次数: 2/10',
        ipAddress: '10.120.45.120',
        deviceInfo: 'Chrome 130 / Windows',
      },
      {
        id: '9',
        requestId: 'REQ-20260428-083',
        entryName: '供应商信息表',
        applicant: '郑八',
        operator: '郑八',
        operationType: '文件下载',
        operationResult: 'failure',
        timestamp: '2026-04-28 16:15:08',
        remark: '下载失败: 文件已过期',
        ipAddress: '10.120.45.125',
        deviceInfo: 'Edge 130 / Windows',
      },
    ],
    config: [
      {
        id: '10',
        requestId: '-',
        entryName: '销售数据导出',
        applicant: '-',
        operator: '系统管理员',
        operationType: '修改配置',
        operationResult: 'success',
        timestamp: '2026-04-29 08:00:00',
        remark: '修改文件有效期: 7天 → 5天',
        ipAddress: '10.120.45.200',
        deviceInfo: 'Chrome 130 / Windows',
      },
      {
        id: '11',
        requestId: '-',
        entryName: '客户信息表',
        applicant: '-',
        operator: '系统管理员',
        operationType: '新建配置',
        operationResult: 'success',
        timestamp: '2026-04-28 13:45:30',
        remark: '创建新入口配置，风险等级: 高',
        ipAddress: '10.120.45.200',
        deviceInfo: 'Chrome 130 / Windows',
      },
      {
        id: '12',
        requestId: '-',
        entryName: '用户行为分析',
        applicant: '-',
        operator: '系统管理员',
        operationType: '审批链配置',
        operationResult: 'success',
        timestamp: '2026-04-28 11:20:15',
        remark: '更新审批流程，新增安全审批节点',
        ipAddress: '10.120.45.200',
        deviceInfo: 'Chrome 130 / Windows',
      },
    ],
    exception: [
      {
        id: '13',
        requestId: 'REQ-20260429-003',
        entryName: '费用报销明细',
        applicant: '冯九',
        operator: '系统',
        operationType: '文件生成失败',
        operationResult: 'failure',
        timestamp: '2026-04-29 15:10:25',
        remark: '数据源查询超时，已通知申请人',
        ipAddress: '-',
        deviceInfo: '-',
      },
      {
        id: '14',
        requestId: 'REQ-20260428-090',
        entryName: '系统日志导出',
        applicant: '陈十',
        operator: '系统',
        operationType: '审批人解析失败',
        operationResult: 'failure',
        timestamp: '2026-04-28 14:35:50',
        remark: '直属领导查询失败，已使用备用审批人',
        ipAddress: '-',
        deviceInfo: '-',
      },
      {
        id: '15',
        requestId: 'REQ-20260428-089',
        entryName: '供应商信息表',
        applicant: '褚十一',
        operator: '系统',
        operationType: '下载超限',
        operationResult: 'failure',
        timestamp: '2026-04-28 13:22:10',
        remark: '下载次数已达上限(5/5)，拒绝下载',
        ipAddress: '10.120.45.135',
        deviceInfo: 'Chrome 130 / Windows',
      },
    ],
  };

  const currentLogs = auditLogs[activeTab];

  const handleSearch = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('normal');
    }, 800);
  };

  const handleReset = () => {
    setRequestId('');
    setEntryName('');
    setOperator('');
    setOperationType('');
    setOperationResult('');
    setTimeRange('');
  };

  const handleRetry = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('normal');
    }, 800);
  };

  const getResultBadge = (result: OperationResult) => {
    switch (result) {
      case 'success':
        return (
          <Badge className="bg-success-light text-success border border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            成功
          </Badge>
        );
      case 'failure':
        return (
          <Badge className="bg-destructive-light text-destructive border border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            失败
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-destructive-light text-destructive border border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            驳回
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-warning-light text-warning border border-warning/20">
            <Loader2 className="w-3 h-3 mr-1" />
            处理中
          </Badge>
        );
    }
  };

  const getTabIcon = (tab: LogType) => {
    switch (tab) {
      case 'application':
        return FileText;
      case 'approval':
        return CheckCircle2;
      case 'download':
        return Download;
      case 'config':
        return Settings;
      case 'exception':
        return AlertTriangle;
    }
  };

  // Permission denied state
  if (pageState === 'no-permission') {
    return (
      <div className="h-full flex flex-col">
        <PageHeader
          title="审计日志"
          description="查看下载中心的完整操作历史记录"
          breadcrumbs={[{ label: '下载中心' }, { label: '审计日志' }]}
        />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-12 max-w-md text-center">
            <ShieldOff className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              权限不足
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              审计日志仅对管理员、安全角色和审计角色开放
            </p>
            <p className="text-xs text-text-tertiary">
              如需访问此页面，请联系系统管理员申请相应权限
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        {/* Role Notice */}
        

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LogType)}>
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="application" className="gap-2">
              <FileText className="w-4 h-4" />
              申请日志
            </TabsTrigger>
            <TabsTrigger value="approval" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              审批日志
            </TabsTrigger>
            <TabsTrigger value="download" className="gap-2">
              <Download className="w-4 h-4" />
              下载日志
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="w-4 h-4" />
              配置变更
            </TabsTrigger>
            <TabsTrigger value="exception" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              异常日志
            </TabsTrigger>
          </TabsList>

          {/* Filter Bar */}
          <FilterBar onSearch={handleSearch} onReset={handleReset}>
            {activeTab !== 'config' && (
              <FilterItem label="申请单号">
                <Input
                  placeholder="输入申请单号"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                />
              </FilterItem>
            )}

            <FilterItem label="入口名称">
              <Input
                placeholder="输入入口名称"
                value={entryName}
                onChange={(e) => setEntryName(e.target.value)}
              />
            </FilterItem>

            <FilterItem label="操作人">
              <Input
                placeholder="输入操作人"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
              />
            </FilterItem>

            <FilterItem label="操作类型">
              <Select value={operationType} onValueChange={setOperationType}>
                <SelectTrigger>
                  <SelectValue placeholder="全部类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {activeTab === 'application' && (
                    <>
                      <SelectItem value="submit">提交申请</SelectItem>
                      <SelectItem value="withdraw">撤回申请</SelectItem>
                    </>
                  )}
                  {activeTab === 'approval' && (
                    <>
                      <SelectItem value="approve-1">一级审批</SelectItem>
                      <SelectItem value="approve-2">二级审批</SelectItem>
                      <SelectItem value="approve-3">三级审批</SelectItem>
                      <SelectItem value="reject">驳回</SelectItem>
                    </>
                  )}
                  {activeTab === 'download' && (
                    <SelectItem value="download">文件下载</SelectItem>
                  )}
                  {activeTab === 'config' && (
                    <>
                      <SelectItem value="create">新建配置</SelectItem>
                      <SelectItem value="update">修改配置</SelectItem>
                      <SelectItem value="delete">删除配置</SelectItem>
                      <SelectItem value="chain">审批链配置</SelectItem>
                    </>
                  )}
                  {activeTab === 'exception' && (
                    <>
                      <SelectItem value="file-gen-fail">文件生成失败</SelectItem>
                      <SelectItem value="resolver-fail">审批人解析失败</SelectItem>
                      <SelectItem value="download-limit">下载超限</SelectItem>
                      <SelectItem value="timeout">请求超时</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </FilterItem>

            <FilterItem label="操作结果">
              <Select value={operationResult} onValueChange={setOperationResult}>
                <SelectTrigger>
                  <SelectValue placeholder="全部结果" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部结果</SelectItem>
                  <SelectItem value="success">成功</SelectItem>
                  <SelectItem value="failure">失败</SelectItem>
                  <SelectItem value="rejected">驳回</SelectItem>
                  <SelectItem value="pending">处理中</SelectItem>
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
                  <SelectItem value="week">最近7天</SelectItem>
                  <SelectItem value="month">最近30天</SelectItem>
                  <SelectItem value="custom">自定义范围</SelectItem>
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

          {/* Empty State */}
          {pageState === 'empty' && (
            <div className="bg-white rounded-lg border border-border p-20 flex flex-col items-center justify-center">
              <Calendar className="w-12 h-12 text-text-tertiary mb-3" />
              <h3 className="text-base font-medium text-text-primary mb-2">
                暂无审计记录
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                当前筛选条件下没有找到相关记录
              </p>
              <Button onClick={handleReset} variant="outline" size="sm">
                重置筛选
              </Button>
            </div>
          )}

          {/* Audit Table */}
          {pageState === 'normal' && (
            <TabsContent value={activeTab} className="mt-0">
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      {activeTab !== 'config' && (
                        <TableHead className="font-semibold">申请单号</TableHead>
                      )}
                      <TableHead className="font-semibold">入口名称</TableHead>
                      {activeTab !== 'config' && (
                        <TableHead className="font-semibold">申请人</TableHead>
                      )}
                      <TableHead className="font-semibold">
                        {activeTab === 'approval' ? '审批人' : '操作人'}
                      </TableHead>
                      <TableHead className="font-semibold">操作类型</TableHead>
                      <TableHead className="font-semibold">操作结果</TableHead>
                      <TableHead className="font-semibold">操作时间</TableHead>
                      <TableHead className="font-semibold">
                        {activeTab === 'approval' ? '审批意见' : '备注'}
                      </TableHead>
                      {(activeTab === 'application' ||
                        activeTab === 'download' ||
                        activeTab === 'config') && (
                        <TableHead className="font-semibold">IP地址</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/30">
                        {activeTab !== 'config' && (
                          <TableCell className="font-mono text-xs text-primary">
                            {log.requestId}
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{log.entryName}</TableCell>
                        {activeTab !== 'config' && (
                          <TableCell className="text-text-secondary">
                            {log.applicant}
                          </TableCell>
                        )}
                        <TableCell className="text-text-secondary">
                          {log.operator}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{log.operationType}</span>
                        </TableCell>
                        <TableCell>{getResultBadge(log.operationResult)}</TableCell>
                        <TableCell className="text-text-secondary text-sm">
                          {log.timestamp}
                        </TableCell>
                        <TableCell className="text-text-secondary text-sm max-w-xs">
                          {log.remark}
                        </TableCell>
                        {(activeTab === 'application' ||
                          activeTab === 'download' ||
                          activeTab === 'config') && (
                          <TableCell className="text-text-tertiary text-xs">
                            {log.ipAddress || '-'}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  共 {currentLogs.length} 条记录
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
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
