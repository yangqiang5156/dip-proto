import React, { useState } from 'react';
import { PageHeader, EmptyState } from '../components/enterprise';
import {
  ContextSummary,
  ApprovalProgress,
  RiskLevelBadge,
  DownloadRequestForm,
  FileItem,
  ApprovalNodeBuilder,
  DecisionActions,
  SystemBanner,
  AuditLogTable,
  MessageItem,
  StatusBadge,
  type ApprovalNode,
  type DownloadRequestFormData,
  type FileItemData,
  type ApprovalNodeConfig,
  type DecisionData,
  type AuditLogEntry,
  type Message,
  type ApprovalStatus,
} from '../components/download-center';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';

export default function ComponentShowcase() {
  const [approvalNodes, setApprovalNodes] = useState<ApprovalNodeConfig[]>([
    {
      id: 'node-1',
      order: 1,
      approverSource: 'manual',
      approverValue: '张三',
      resolveStatus: 'success',
    },
  ]);

  const mockApprovalProgress: ApprovalNode[] = [
    {
      id: '1',
      name: '部门主管审批',
      status: 'approved',
      approver: '张三',
      opinion: '同意申请',
      time: '2026-04-28 10:30:00',
    },
    {
      id: '2',
      name: '数据安全审批',
      status: 'current',
      approver: '李四',
    },
    {
      id: '3',
      name: '最终审批',
      status: 'pending',
    },
  ];

  const mockFileItem: FileItemData = {
    id: 'file-1',
    name: '用户数据导出_20260428.xlsx',
    size: '2.5 MB',
    generatedTime: '2026-04-28 14:30:00',
    expiryDate: '2026-05-05 14:30:00',
    remainingDownloads: 3,
    status: 'available',
  };

  const mockAuditLogs: AuditLogEntry[] = [
    {
      id: '1',
      operationType: '提交申请',
      actor: '王五',
      result: 'success',
      time: '2026-04-28 09:00:00',
      ip: '192.168.1.100',
      device: 'Chrome 124 / Windows 11',
      remarks: '申请导出用户数据',
    },
    {
      id: '2',
      operationType: '审批通过',
      actor: '张三',
      result: 'success',
      time: '2026-04-28 10:30:00',
      ip: '192.168.1.101',
      device: 'Safari 17 / macOS 14',
    },
    {
      id: '3',
      operationType: '文件下载',
      actor: '王五',
      result: 'success',
      time: '2026-04-28 15:00:00',
      ip: '192.168.1.100',
      device: 'Chrome 124 / Windows 11',
    },
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      type: 'file_ready',
      title: '文件已生成',
      content: '您申请的"用户数据导出"文件已生成完成,请及时下载',
      time: '10分钟前',
      isRead: false,
    },
    {
      id: '2',
      type: 'approved',
      title: '审批已通过',
      content: '您的下载申请已通过部门主管审批',
      time: '2小时前',
      isRead: true,
    },
    {
      id: '3',
      type: 'expiring_soon',
      title: '文件即将过期',
      content: '您的文件将在24小时后过期,请尽快下载',
      time: '1天前',
      isRead: false,
    },
  ];

  const statusList: ApprovalStatus[] = [
    '审批中',
    '已驳回',
    '审批通过',
    '文件生成中',
    '待下载',
    '已下载',
    '已过期',
    '生成失败',
    '已停用',
  ];

  const handleFormSubmit = (data: DownloadRequestFormData) => {
    console.log('Form submitted:', data);
    alert('申请已提交');
  };

  const handleDecision = (decision: DecisionData) => {
    console.log('Decision made:', decision);
    alert(`审批${decision.action === 'approve' ? '通过' : '驳回'}`);
  };

  const handleDownload = (fileId: string) => {
    console.log('Downloading file:', fileId);
    alert(`下载文件: ${fileId}`);
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="企业组件库"
        description="下载中心设计系统 - 所有可复用组件的展示与文档"
      />

      <div className="flex-1 p-6 overflow-auto">
        <Tabs defaultValue="enterprise" className="w-full">
          <TabsList>
            <TabsTrigger value="enterprise">企业基础组件</TabsTrigger>
            <TabsTrigger value="business">业务组件</TabsTrigger>
            <TabsTrigger value="status">状态徽章</TabsTrigger>
            <TabsTrigger value="data">数据展示</TabsTrigger>
          </TabsList>

          <TabsContent value="enterprise" className="space-y-6 mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">空状态组件</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="border border-border rounded-lg">
                  <EmptyState type="no-data" />
                </div>
                <div className="border border-border rounded-lg">
                  <EmptyState type="no-permission" />
                </div>
                <div className="border border-border rounded-lg">
                  <EmptyState
                    type="no-pending"
                    action={{ label: '创建新申请', onClick: () => {} }}
                  />
                </div>
                <div className="border border-border rounded-lg">
                  <EmptyState
                    type="error"
                    action={{ label: '重新加载', onClick: () => {} }}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">系统横幅</h2>
              <div className="space-y-4">
                <SystemBanner
                  type="info"
                  title="配置提示"
                  message="当前入口尚未配置审批流程,请先配置审批流程后再提交申请"
                  action={{
                    label: '前往配置',
                    onClick: () => alert('跳转到配置页面'),
                  }}
                />
                <SystemBanner
                  type="warning"
                  title="审批人解析警告"
                  message="动态规则无法解析审批人,已使用备用审批人"
                  onDismiss={() => alert('横幅已关闭')}
                />
                <SystemBanner
                  type="error"
                  title="文件生成失败"
                  message="由于系统错误,文件生成失败,请稍后重试或联系管理员"
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6 mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">上下文摘要</h2>
              <ContextSummary
                entryName="用户数据导出"
                moduleName="用户管理"
                pageName="用户列表页"
                downloadButtonName="导出Excel"
                exportConditions="筛选条件: 注册时间 2026-01-01 至 2026-04-28, 用户状态: 活跃"
                riskLevel="medium"
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">审批进度时间线</h2>
              <ApprovalProgress nodes={mockApprovalProgress} />
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">文件卡片</h2>
              <div className="space-y-4">
                <FileItem file={mockFileItem} onDownload={handleDownload} />
                <FileItem
                  file={{ ...mockFileItem, id: 'file-2', status: 'expiring' }}
                  onDownload={handleDownload}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">消息通知</h2>
              <div className="space-y-3">
                {mockMessages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    onClick={() => alert(`点击消息: ${message.title}`)}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6 mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">审批状态徽章</h2>
              <div className="flex flex-wrap gap-3">
                {statusList.map((status) => (
                  <StatusBadge key={status} status={status} />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">风险等级徽章</h2>
              <div className="flex gap-4">
                <RiskLevelBadge level="low" />
                <RiskLevelBadge level="medium" />
                <RiskLevelBadge level="high" />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6 mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">审计日志表格</h2>
              <AuditLogTable
                logs={mockAuditLogs}
                onRowClick={(log) => alert(`查看日志详情: ${log.operationType}`)}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
