import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  FileText,
  AlertTriangle,
  Bell,
  CheckCheck,
  ChevronRight,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

type NotificationCategory = 'all' | 'pending-approval' | 'application-progress' | 'file-notification' | 'exception';

type NotificationType =
  | 'application-submitted'
  | 'approval-pending'
  | 'approval-approved'
  | 'approval-rejected'
  | 'file-ready'
  | 'file-expiring'
  | 'file-generation-failed';

interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory[];
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  actionLink?: string;
  requestId?: string;
}

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    // Pending approvals (for approvers)
    {
      id: '1',
      type: 'approval-pending',
      category: ['all', 'pending-approval'],
      title: '待审批：销售数据导出申请',
      description: '张三 申请导出销售数据，申请单号 REQ-20260429-001',
      timestamp: '2026-04-29 10:25:00',
      isRead: false,
      actionLabel: '去审批',
      actionLink: '/approval-decision/1',
      requestId: 'REQ-20260429-001',
    },
    {
      id: '2',
      type: 'approval-pending',
      category: ['all', 'pending-approval'],
      title: '待审批：客户信息表导出',
      description: '李四 申请导出客户信息表，申请单号 REQ-20260429-002',
      timestamp: '2026-04-29 09:18:00',
      isRead: false,
      actionLabel: '去审批',
      actionLink: '/approval-decision/2',
      requestId: 'REQ-20260429-002',
    },

    // Application progress (for applicants)
    {
      id: '3',
      type: 'application-submitted',
      category: ['all', 'application-progress'],
      title: '申请已提交',
      description: '您的销售数据导出申请已提交，等待审批中',
      timestamp: '2026-04-29 10:23:15',
      isRead: false,
      actionLabel: '查看详情',
      actionLink: '/approval/1',
      requestId: 'REQ-20260429-001',
    },
    {
      id: '4',
      type: 'approval-approved',
      category: ['all', 'application-progress'],
      title: '一级审批已通过',
      description: '赵经理 已通过您的销售数据导出申请，等待二级审批',
      timestamp: '2026-04-29 11:05:42',
      isRead: true,
      actionLabel: '查看详情',
      actionLink: '/approval/1',
      requestId: 'REQ-20260429-001',
    },
    {
      id: '5',
      type: 'approval-approved',
      category: ['all', 'application-progress'],
      title: '审批已全部通过',
      description: '孙总监 已通过您的销售数据导出申请，文件生成中',
      timestamp: '2026-04-29 14:22:18',
      isRead: true,
      actionLabel: '查看详情',
      actionLink: '/approval/1',
      requestId: 'REQ-20260429-001',
    },
    {
      id: '6',
      type: 'approval-rejected',
      category: ['all', 'application-progress'],
      title: '申请已被驳回',
      description: '钱经理 驳回了您的员工绩效数据申请：申请理由不充分',
      timestamp: '2026-04-28 15:30:25',
      isRead: true,
      actionLabel: '查看详情',
      actionLink: '/approval/3',
      requestId: 'REQ-20260428-087',
    },

    // File notifications (for applicants)
    {
      id: '7',
      type: 'file-ready',
      category: ['all', 'file-notification'],
      title: '文件已生成，可以下载',
      description: '销售数据导出文件已生成，文件有效期至 2026-05-06',
      timestamp: '2026-04-29 14:30:12',
      isRead: false,
      actionLabel: '去下载',
      actionLink: '/export-center',
      requestId: 'REQ-20260429-001',
    },
    {
      id: '8',
      type: 'file-expiring',
      category: ['all', 'file-notification'],
      title: '文件即将过期',
      description: '订单明细导出文件将在 24 小时后过期，请尽快下载',
      timestamp: '2026-04-28 18:00:00',
      isRead: true,
      actionLabel: '去下载',
      actionLink: '/export-center',
      requestId: 'REQ-20260425-042',
    },

    // Exceptions (for admins and applicants)
    {
      id: '9',
      type: 'file-generation-failed',
      category: ['all', 'exception'],
      title: '文件生成失败',
      description: '费用报销明细文件生成失败：数据源查询超时，请稍后重试',
      timestamp: '2026-04-29 15:10:25',
      isRead: false,
      actionLabel: '查看详情',
      actionLink: '/approval/5',
      requestId: 'REQ-20260429-003',
    },
  ]);

  const filteredNotifications = notifications.filter((notif) => {
    if (activeCategory === 'all') return true;
    return notif.category.includes(activeCategory);
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'application-submitted':
        return <FileText className="w-5 h-5 text-primary" />;
      case 'approval-pending':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'approval-approved':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'approval-rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'file-ready':
        return <Download className="w-5 h-5 text-success" />;
      case 'file-expiring':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'file-generation-failed':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    if (diffDays < 7) return `${diffDays} 天前`;
    return timestamp.split(' ')[0];
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[420px] max-w-full p-0 flex flex-col gap-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <SheetDescription className="sr-only">消息通知列表</SheetDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-lg">消息通知</SheetTitle>
              {unreadCount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground h-5 min-w-5 px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-7"
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1" />
                全部已读
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Category Tabs */}
        <div className="px-6 pt-4 flex-shrink-0">
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as NotificationCategory)}>
            <TabsList className="w-full grid grid-cols-5 h-auto p-1">
              <TabsTrigger value="all" className="text-xs px-2 py-1.5">
                全部
              </TabsTrigger>
              <TabsTrigger value="pending-approval" className="text-xs px-2 py-1.5">
                待审批
              </TabsTrigger>
              <TabsTrigger value="application-progress" className="text-xs px-2 py-1.5">
                申请进度
              </TabsTrigger>
              <TabsTrigger value="file-notification" className="text-xs px-2 py-1.5">
                文件通知
              </TabsTrigger>
              <TabsTrigger value="exception" className="text-xs px-2 py-1.5">
                异常
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="w-12 h-12 text-text-tertiary mb-3" />
              <p className="text-sm text-text-secondary mb-1">暂无新消息</p>
              <p className="text-xs text-text-tertiary">
                {activeCategory === 'all' ? '当前没有未读通知' : '该分类下暂无消息'}
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <div
                    className={`py-4 transition-colors cursor-pointer ${
                      notification.isRead ? 'opacity-60' : ''
                    } hover:bg-muted/30 -mx-6 px-6`}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={`text-sm font-medium ${
                              notification.isRead ? 'text-text-secondary' : 'text-text-primary'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-text-secondary mb-2 line-clamp-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-text-tertiary">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.actionLabel && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                // In a real app, this would navigate
                                console.log('Navigate to:', notification.actionLink);
                              }}
                            >
                              {notification.actionLabel}
                              <ChevronRight className="w-3 h-3 ml-0.5" />
                            </Button>
                          )}
                        </div>
                        {notification.requestId && (
                          <p className="text-xs text-text-tertiary font-mono mt-1">
                            {notification.requestId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < filteredNotifications.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}